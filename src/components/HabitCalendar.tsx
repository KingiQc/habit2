import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { formatDate, getColor } from "@/types/habit";
import type { Habit } from "@/types/habit";

interface HabitCalendarProps {
  habits: Habit[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function HabitCalendar({ habits, selectedDate, onSelectDate }: HabitCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const completionDates = useMemo(() => {
    const dates = new Set<string>();
    habits.forEach((h) => h.completions.forEach((c) => dates.add(c)));
    return dates;
  }, [habits]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const todayStr = formatDate(new Date());

  return (
    <div className="bg-secondary rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground p-1">
          <Icon icon="mdi:chevron-left" width={22} />
        </button>
        <span className="font-semibold text-foreground">{monthName}</span>
        <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground p-1">
          <Icon icon="mdi:chevron-right" width={22} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasCompletion = completionDates.has(dateStr);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              onClick={() => onSelectDate(dateStr)}
              className={`relative py-2 rounded-xl text-sm transition-all ${
                isSelected
                  ? "bg-foreground text-background font-bold"
                  : isToday
                  ? "bg-accent text-foreground font-semibold"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {day}
              {hasCompletion && (
                <span
                  className="absolute bottom-0.5 right-1 w-1.5 h-1.5 rounded-full bg-orange-500"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
