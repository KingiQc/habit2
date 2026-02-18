import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useHabits } from "@/contexts/HabitContext";
import { getColor, calculateStreak, calculateBestStreak, formatDate } from "@/types/habit";

export default function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { habits, toggleCompletion } = useHabits();
  const [viewDate, setViewDate] = React.useState(new Date());
  
  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Habit not found</p>
      </div>
    );
  }

  const color = getColor(habit.colorId);
  const streak = calculateStreak(habit.completions);
  const bestStreak = calculateBestStreak(habit.completions);
  const completionRate = habit.completions.length > 0
    ? Math.round((habit.completions.length / Math.max(1, Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / 86400000))) * 100)
    : 0;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const completionSet = new Set(habit.completions);
  const todayStr = formatDate(new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: color.bg }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white mb-4">
            <Icon icon="mdi:arrow-left" width={24} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Icon icon={habit.icon} width={32} style={{ color: color.accent }} />
            <h1 className="text-2xl font-bold text-white">{habit.name}</h1>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-5xl font-bold text-white">{streak}</span>
            <div>
              <Icon icon="mdi:fire" width={24} className="text-orange-400" />
              <span className="text-white/70 text-xs block uppercase tracking-wider">Days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: habit.completions.length },
            { label: "Best Streak", value: bestStreak },
            { label: "Rate", value: `${completionRate}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-secondary rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <Icon icon="mdi:chevron-left" width={22} />
            </button>
            <span className="font-semibold text-foreground">{monthName}</span>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <Icon icon="mdi:chevron-right" width={22} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const completed = completionSet.has(dateStr);
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={day}
                  onClick={() => toggleCompletion(habit.id, dateStr)}
                  className={`py-2 rounded-xl text-sm transition-all ${
                    completed
                      ? "font-bold text-white"
                      : isToday
                      ? "bg-accent text-foreground font-semibold"
                      : "text-foreground hover:bg-accent"
                  }`}
                  style={completed ? { backgroundColor: color.accent } : undefined}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
