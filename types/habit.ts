export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[];
}

