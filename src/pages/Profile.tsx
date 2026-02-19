import React, { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/contexts/HabitContext";
import { calculateStreak, formatDate } from "@/types/habit";
import BottomNav from "@/components/BottomNav";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const { habits } = useHabits();
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  const activeStreaks = habits.filter((h) => calculateStreak(h.completions) > 0).length;

  const weeklyData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = formatDate(d);
      const count = habits.reduce(
        (sum, h) => sum + (h.completions.includes(dateStr) ? 1 : 0),
        0
      );
      return { label: d.toLocaleDateString("en", { weekday: "short" }), completions: count };
    });
  }, [habits]);

  const monthlyData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 4 }, (_, i) => {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      let count = 0;
      for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
        const ds = formatDate(d);
        count += habits.reduce((s, h) => s + (h.completions.includes(ds) ? 1 : 0), 0);
      }
      return { label: `W${4 - i}`, completions: count };
    }).reverse();
  }, [habits]);

  const chartConfig: ChartConfig = {
    completions: { label: "Completions", color: "hsl(var(--primary))" },
  };

  const chartData = view === "weekly" ? weeklyData : monthlyData;

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
              <h2 className="text-xl font-bold text-foreground">{profile?.name || "User"}</h2>
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

        {/* Statistics Charts */}
        <div className="bg-secondary rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Activity</h3>
            <div className="flex gap-1 bg-muted rounded-xl p-1">
              {(["weekly", "monthly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {v === "weekly" ? "7 Days" : "4 Weeks"}
                </button>
              ))}
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} className="stroke-border/30" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completions" fill="var(--color-completions)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-secondary rounded-2xl p-4 text-destructive font-medium active:scale-[0.98] transition-all"
        >
          <Icon icon="mdi:logout" width={22} />
          Sign Out
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
