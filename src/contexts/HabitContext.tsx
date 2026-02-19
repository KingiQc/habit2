import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Habit } from "@/types/habit";
import { formatDate, generateId } from "@/types/habit";

type HabitContextType = {
  habits: Habit[];
  loading: boolean;
  addHabit: (habit: Omit<Habit, "id" | "completions" | "createdAt" | "order">) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (id: string, date?: string) => Promise<void>;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  loading: true,
  addHabit: async () => {},
  updateHabit: async () => {},
  deleteHabit: async () => {},
  toggleCompletion: async () => {},
  reorderHabits: () => {},
});

export function HabitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch habits + completions
  const fetchHabits = useCallback(async () => {
    if (!user) { setHabits([]); setLoading(false); return; }

    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order");

    if (!habitsData) { setLoading(false); return; }

    const { data: completionsData } = await supabase
      .from("habit_completions")
      .select("habit_id, completed_date")
      .eq("user_id", user.id);

    const completionMap = new Map<string, string[]>();
    (completionsData || []).forEach((c) => {
      const arr = completionMap.get(c.habit_id) || [];
      arr.push(c.completed_date);
      completionMap.set(c.habit_id, arr);
    });

    const mapped: Habit[] = habitsData.map((h) => ({
      id: h.id,
      name: h.name,
      icon: h.icon,
      colorId: h.color_id,
      reminderEnabled: h.reminder_enabled,
      reminderTime: h.reminder_time,
      repeatDays: h.repeat_days,
      completions: completionMap.get(h.id) || [],
      createdAt: h.created_at,
      order: h.sort_order,
    }));

    setHabits(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = useCallback(async (habit: Omit<Habit, "id" | "completions" | "createdAt" | "order">) => {
    if (!user) return;
    const { data, error } = await supabase.from("habits").insert({
      user_id: user.id,
      name: habit.name,
      icon: habit.icon,
      color_id: habit.colorId,
      reminder_enabled: habit.reminderEnabled,
      reminder_time: habit.reminderTime,
      repeat_days: habit.repeatDays,
      sort_order: habits.length,
    }).select().single();

    if (data && !error) {
      setHabits((prev) => [...prev, {
        id: data.id,
        name: data.name,
        icon: data.icon,
        colorId: data.color_id,
        reminderEnabled: data.reminder_enabled,
        reminderTime: data.reminder_time,
        repeatDays: data.repeat_days,
        completions: [],
        createdAt: data.created_at,
        order: data.sort_order,
      }]);
    }
  }, [user, habits.length]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    if (!user) return;
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.colorId !== undefined) dbUpdates.color_id = updates.colorId;
    if (updates.reminderEnabled !== undefined) dbUpdates.reminder_enabled = updates.reminderEnabled;
    if (updates.reminderTime !== undefined) dbUpdates.reminder_time = updates.reminderTime;
    if (updates.repeatDays !== undefined) dbUpdates.repeat_days = updates.repeatDays;

    await supabase.from("habits").update(dbUpdates).eq("id", id);
    setHabits((prev) => prev.map((h) => h.id === id ? { ...h, ...updates } : h));
  }, [user]);

  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from("habits").delete().eq("id", id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, [user]);

  const toggleCompletion = useCallback(async (id: string, date?: string) => {
    if (!user) return;
    const dateStr = date || formatDate(new Date());
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const has = habit.completions.includes(dateStr);
    if (has) {
      await supabase.from("habit_completions")
        .delete()
        .eq("habit_id", id)
        .eq("completed_date", dateStr);
    } else {
      await supabase.from("habit_completions").insert({
        habit_id: id,
        user_id: user.id,
        completed_date: dateStr,
      });
    }

    setHabits((prev) => prev.map((h) => {
      if (h.id !== id) return h;
      return {
        ...h,
        completions: has
          ? h.completions.filter((d) => d !== dateStr)
          : [...h.completions, dateStr],
      };
    }));
  }, [user, habits]);

  const reorderHabits = useCallback((fromIndex: number, toIndex: number) => {
    setHabits((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      const reordered = arr.map((h, i) => ({ ...h, order: i }));
      // Update in background
      reordered.forEach((h) => {
        supabase.from("habits").update({ sort_order: h.order }).eq("id", h.id);
      });
      return reordered;
    });
  }, []);

  return (
    <HabitContext.Provider value={{ habits, loading, addHabit, updateHabit, deleteHabit, toggleCompletion, reorderHabits }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => useContext(HabitContext);
