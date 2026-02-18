import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { HABIT_COLORS, HABIT_ICONS } from "@/types/habit";
import { useHabits } from "@/contexts/HabitContext";
import type { Habit } from "@/types/habit";

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
  editHabit?: Habit | null;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CreateHabitModal({ open, onClose, editHabit }: CreateHabitModalProps) {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(editHabit?.name || "");
  const [icon, setIcon] = useState(editHabit?.icon || HABIT_ICONS[0].icon);
  const [colorId, setColorId] = useState(editHabit?.colorId || HABIT_COLORS[0].id);
  const [reminderEnabled, setReminderEnabled] = useState(editHabit?.reminderEnabled || false);
  const [reminderTime, setReminderTime] = useState(editHabit?.reminderTime || "09:00");
  const [repeatDays, setRepeatDays] = useState<number[]>(editHabit?.repeatDays || [0, 1, 2, 3, 4, 5, 6]);

  const handleSave = () => {
    if (!name.trim()) return;
    const data = { name: name.trim(), icon, colorId, reminderEnabled, reminderTime, repeatDays };
    if (editHabit) {
      updateHabit(editHabit.id, data);
    } else {
      addHabit(data);
    }
    onClose();
  };

  const toggleDay = (day: number) => {
    setRepeatDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {editHabit ? "Edit Habit" : "New Habit"}
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <Icon icon="mdi:close" width={24} />
              </button>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name"
                className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-muted-foreground/30 placeholder:text-muted-foreground"
              />
            </div>

            {/* Icon picker */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {HABIT_ICONS.map((item) => (
                  <button
                    key={item.icon}
                    onClick={() => setIcon(item.icon)}
                    className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                      icon === item.icon
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon icon={item.icon} width={24} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Color</label>
              <div className="flex gap-3 flex-wrap">
                {HABIT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setColorId(c.id)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      colorId === c.id ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : ""
                    }`}
                    style={{ backgroundColor: c.bg }}
                  />
                ))}
              </div>
            </div>

            {/* Repeat days */}
            <div className="mb-5">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Repeat</label>
              <div className="flex gap-2">
                {DAYS.map((d, i) => (
                  <button
                    key={d}
                    onClick={() => toggleDay(i)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      repeatDays.includes(i)
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {d.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reminder */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground">Reminder</label>
                <button
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-12 h-7 rounded-full transition-all relative ${
                    reminderEnabled ? "bg-foreground" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full absolute top-1 transition-all ${
                      reminderEnabled
                        ? "right-1 bg-background"
                        : "left-1 bg-muted-foreground"
                    }`}
                  />
                </button>
              </div>
              {reminderEnabled && (
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none"
                />
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full bg-foreground text-background font-semibold rounded-xl py-3.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {editHabit ? "Save Changes" : "Create Habit"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
