import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { getColor, calculateStreak, formatDate } from "@/types/habit";
import type { Habit } from "@/types/habit";
import { useHabits } from "@/contexts/HabitContext";

interface HabitCardProps {
  habit: Habit;
  onTap: () => void;
  index: number;
}

export default function HabitCard({ habit, onTap, index }: HabitCardProps) {
  const { toggleCompletion, deleteHabit } = useHabits();
  const color = getColor(habit.colorId);
  const streak = calculateStreak(habit.completions);
  const todayStr = formatDate(new Date());
  const completedToday = habit.completions.includes(todayStr);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showSwipe, setShowSwipe] = useState(false);

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedToday) {
      if (confirm("Undo today's completion?")) {
        toggleCompletion(habit.id);
      }
    } else {
      toggleCompletion(habit.id);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x < -80) {
          setShowSwipe(true);
        } else {
          setShowSwipe(false);
        }
      }}
      className="relative"
    >
      <AnimatePresence>
        {showSwipe && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => deleteHabit(habit.id)}
            className="absolute right-0 top-0 bottom-0 w-20 bg-red-600 rounded-[24px] flex items-center justify-center z-0"
          >
            <Icon icon="mdi:delete" width={28} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        onClick={onTap}
        className="habit-card cursor-pointer relative z-10"
        style={{ backgroundColor: color.bg, minHeight: "160px" }}
      >
        {/* Top section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-4xl font-bold text-white">{streak}</span>
            <motion.span
              animate={justCompleted ? { y: [-4, 0], scale: [1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Icon icon="mdi:fire" width={20} className="text-orange-400" />
            </motion.span>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleCheck}
            className="check-btn"
            style={{
              backgroundColor: completedToday ? color.accent : "transparent",
              border: completedToday ? "none" : `2px solid ${color.accent}`,
            }}
          >
            {completedToday && (
              <motion.div
                initial={justCompleted ? { scale: 0.5 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Icon icon="mdi:check" width={22} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        </div>

        <span className="text-xs font-medium text-white/70 tracking-wider uppercase">
          Days
        </span>

        {/* Bottom section */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2.5">
          <Icon
            icon={habit.icon}
            width={24}
            style={{ color: `${color.accent}80` }}
          />
          <span className="text-base font-medium text-white">{habit.name}</span>
        </div>
      </div>
    </motion.div>
  );
}
