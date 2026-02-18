import React from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/contexts/HabitContext";
import { calculateStreak } from "@/types/habit";
import BottomNav from "@/components/BottomNav";

export default function Profile() {
  const { user, logout } = useAuth();
  const { habits } = useHabits();

  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  const activeStreaks = habits.filter((h) => calculateStreak(h.completions) > 0).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Profile</h1>

        <div className="bg-secondary rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Icon icon="mdi:account" width={32} className="text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Habits", value: habits.length, icon: "mdi:view-grid" },
            { label: "Completions", value: totalCompletions, icon: "mdi:check-all" },
            { label: "Active Streaks", value: activeStreaks, icon: "mdi:fire" },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary rounded-2xl p-4 text-center">
              <Icon icon={stat.icon} width={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-secondary rounded-2xl p-4 text-red-500 font-medium active:scale-[0.98] transition-all"
        >
          <Icon icon="mdi:logout" width={22} />
          Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
