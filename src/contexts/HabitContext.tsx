import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Habit } from "@/types/habit";
import { formatDate, generateId } from "@/types/habit";

type HabitContextType = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completions" | "createdAt" | "order">) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date?: string) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
};

const HabitContext = createContext<HabitContextType>({
  habits: [],
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  toggleCompletion: () => {},
  reorderHabits: () => {},
});

function loadHabits(): Habit[] {
  try {
    return JSON.parse(localStorage.getItem("habit-data") || "[]");
  } catch {
    return [];
  }
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    localStorage.setItem("habit-data", JSON.stringify(habits));
  }, [habits]);

  const addHabit = useCallback(
    (habit: Omit<Habit, "id" | "completions" | "createdAt" | "order">) => {
      setHabits((prev) => [
        ...prev,
        {
          ...habit,
          id: generateId(),
          completions: [],
          createdAt: new Date().toISOString(),
          order: prev.length,
        },
      ]);
    },
    []
  );

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleCompletion = useCallback((id: string, date?: string) => {
    const dateStr = date || formatDate(new Date());
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(dateStr);
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== dateStr)
            : [...h.completions, dateStr],
        };
      })
    );
  }, []);

  const reorderHabits = useCallback((fromIndex: number, toIndex: number) => {
    setHabits((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr.map((h, i) => ({ ...h, order: i }));
    });
  }, []);

  return (
    <HabitContext.Provider
      value={{ habits, addHabit, updateHabit, deleteHabit, toggleCompletion, reorderHabits }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => useContext(HabitContext);
