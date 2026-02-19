import React from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "@/contexts/ThemeContext";
import { useHabits } from "@/contexts/HabitContext";
import BottomNav from "@/components/BottomNav";

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { habits, deleteHabit } = useHabits();

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all habits? This cannot be undone.")) {
      for (const h of habits) {
        await deleteHabit(h.id);
      }
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(habits, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "habits-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const items = [
    {
      icon: isDark ? "mdi:weather-night" : "mdi:weather-sunny",
      label: isDark ? "Dark Mode" : "Light Mode",
      action: toggleTheme,
      toggle: true,
      toggled: isDark,
    },
    {
      icon: "mdi:bell-outline",
      label: "Notifications",
      action: () => {},
    },
    {
      icon: "mdi:download",
      label: "Export Data",
      action: handleExport,
    },
    {
      icon: "mdi:refresh",
      label: "Reset All Habits",
      action: handleReset,
      destructive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Settings</h1>

        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center justify-between bg-secondary rounded-2xl p-4 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Icon
                  icon={item.icon}
                  width={24}
                  className={item.destructive ? "text-red-500" : "text-foreground"}
                />
                <span className={`font-medium ${item.destructive ? "text-red-500" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
              {item.toggle ? (
                <div className={`w-12 h-7 rounded-full transition-all relative ${item.toggled ? "bg-foreground" : "bg-muted"}`}>
                  <div className={`w-5 h-5 rounded-full absolute top-1 transition-all ${item.toggled ? "right-1 bg-background" : "left-1 bg-muted-foreground"}`} />
                </div>
              ) : (
                <Icon icon="mdi:chevron-right" width={22} className="text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
