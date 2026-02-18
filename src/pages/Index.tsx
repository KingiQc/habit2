import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useHabits } from "@/contexts/HabitContext";
import { formatDate } from "@/types/habit";
import HabitCard from "@/components/HabitCard";
import BottomNav from "@/components/BottomNav";
import CreateHabitModal from "@/components/CreateHabitModal";
import HabitCalendar from "@/components/HabitCalendar";
import { useNavigate } from "react-router-dom";
import type { Habit } from "@/types/habit";

export default function Index() {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).toUpperCase();

  // Filter habits for selected date (by repeat days)
  const selectedDay = new Date(selectedDate + "T00:00:00").getDay();
  const filteredHabits = habits.filter((h) => h.repeatDays.includes(selectedDay));

  const handleLongPress = (habit: Habit) => {
    setEditHabit(habit);
    setShowCreate(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-muted-foreground tracking-wider">
            {dateStr}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon icon="mdi:calendar-month" width={22} />
            </button>
            <button
              onClick={() => { setEditHabit(null); setShowCreate(true); }}
              className="flex items-center gap-1.5 text-foreground font-semibold text-sm"
            >
              CREATE
              <Icon icon="mdi:plus-circle-outline" width={22} />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">Habits</h1>

        {/* Calendar */}
        {showCalendar && (
          <HabitCalendar
            habits={habits}
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
          />
        )}

        {/* Habit Grid */}
        {filteredHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Icon icon="mdi:fire" width={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">No habits yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap CREATE to add your first habit</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredHabits.map((habit, index) => (
              <div
                key={habit.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(habit);
                }}
              >
                <HabitCard
                  habit={habit}
                  index={index}
                  onTap={() => navigate(`/habit/${habit.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />

      <CreateHabitModal
        open={showCreate}
        onClose={() => { setShowCreate(false); setEditHabit(null); }}
        editHabit={editHabit}
      />
    </div>
  );
}
