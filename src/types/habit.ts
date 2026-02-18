export interface Habit {
  id: string;
  name: string;
  icon: string;
  colorId: string;
  reminderEnabled: boolean;
  reminderTime: string;
  repeatDays: number[];
  completions: string[];
  createdAt: string;
  order: number;
}

export interface User {
  name: string;
  age: number;
  email: string;
  password: string;
}

export interface HabitColor {
  id: string;
  bg: string;
  accent: string;
  label: string;
}

export const HABIT_COLORS: HabitColor[] = [
  { id: "burgundy", bg: "#5C1A2A", accent: "#FF3B6F", label: "Burgundy" },
  { id: "navy", bg: "#1A3A5C", accent: "#3B8FFF", label: "Navy" },
  { id: "olive", bg: "#4A4520", accent: "#C4B84D", label: "Olive" },
  { id: "brown", bg: "#5C3A1A", accent: "#FF8C3B", label: "Brown" },
  { id: "purple", bg: "#2D1A5C", accent: "#8B5CF6", label: "Purple" },
  { id: "emerald", bg: "#1A5C3A", accent: "#34D399", label: "Emerald" },
  { id: "amber", bg: "#5C4A1A", accent: "#FBBF24", label: "Amber" },
  { id: "coral", bg: "#5C2A1A", accent: "#FF6B6B", label: "Coral" },
];

export const HABIT_ICONS: { icon: string; label: string }[] = [
  { icon: "mdi:book-open-page-variant", label: "Reading" },
  { icon: "mdi:run", label: "Running" },
  { icon: "mdi:meditation", label: "Meditate" },
  { icon: "mdi:dumbbell", label: "Workout" },
  { icon: "mdi:water", label: "Water" },
  { icon: "mdi:food-apple", label: "Eat Healthy" },
  { icon: "mdi:sleep", label: "Sleep" },
  { icon: "mdi:music", label: "Music" },
  { icon: "mdi:code-tags", label: "Code" },
  { icon: "mdi:palette", label: "Art" },
  { icon: "mdi:tennis", label: "Tennis" },
  { icon: "mdi:bike", label: "Cycling" },
  { icon: "mdi:yoga", label: "Yoga" },
  { icon: "mdi:pill", label: "Medicine" },
  { icon: "mdi:heart-pulse", label: "Health" },
  { icon: "mdi:school", label: "Study" },
  { icon: "mdi:walk", label: "Walk" },
  { icon: "mdi:finance", label: "Finance" },
  { icon: "mdi:notebook", label: "Journal" },
  { icon: "mdi:smoking-off", label: "No Smoking" },
];

export function getColor(colorId: string): HabitColor {
  return HABIT_COLORS.find((c) => c.id === colorId) || HABIT_COLORS[0];
}

export function calculateStreak(completions: string[]): number {
  if (!completions.length) return 0;
  const sorted = [...completions].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i - 1]);
    const prev = new Date(sorted[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / 86400000
    );
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export function calculateBestStreak(completions: string[]): number {
  if (!completions.length) return 0;
  const sorted = [...completions].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  return best;
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
