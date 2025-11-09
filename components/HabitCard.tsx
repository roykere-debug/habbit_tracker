"use client";

import { HabitWithEntries } from "@/types/habit";
import { Check, Flame, Trash2 } from "lucide-react";
import { useState } from "react";

interface HabitCardProps {
  habit: HabitWithEntries;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

const calculateStreak = (habit: HabitWithEntries) => {
  const sortedEntries = [...habit.entries]
    .filter((entry) => entry.completed)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sortedEntries.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    const entryDateStr = entryDate.toISOString().split("T")[0];
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (entryDateStr === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const todayEntry = habit.entries.find((entry) => entry.date === today);
  const isCompletedToday = todayEntry?.completed ?? false;
  const streak = calculateStreak(habit);
  const totalCompletions = habit.entries.filter((entry) => entry.completed).length;

  const handleToggle = () => {
    onToggle(habit.id, today);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      setIsDeleting(true);
      onDelete(habit.id);
    }
  };

  if (isDeleting) return null;

  return (
    <div
      className={`group relative flex items-start gap-5 rounded-3xl border border-brand-dark/10 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle ${
        isCompletedToday ? "border-brand-dark bg-brand-dark/5" : ""
      }`}
    >
      <button
        onClick={handleToggle}
        className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border text-white transition ${
          isCompletedToday
            ? "border-brand-dark bg-brand-dark"
            : "border-brand-dark/20 bg-white text-brand-dark/0 hover:border-brand-dark/40"
        }`}
        aria-label={isCompletedToday ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompletedToday && <Check className="h-5 w-5" />}
      </button>

      <div className="flex-1 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-dark text-lg text-white"
                style={{ backgroundColor: habit.color }}
              >
                {habit.icon}
              </div>
              <h3 className="text-lg font-semibold text-brand-dark">{habit.name}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-brand-dark/70">
              <span className="flex items-center gap-1 rounded-full bg-brand-dark/5 px-3 py-1">
                <Flame className="h-4 w-4 text-brand-dark" />
                {streak} day streak
              </span>
              <span className="rounded-full bg-brand-dark/5 px-3 py-1">
                {totalCompletions} total check-ins
              </span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="rounded-full border border-transparent p-2 text-brand-dark/40 transition hover:border-brand-dark/20 hover:text-brand-dark"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-brand-dark/60">
            <span>{isCompletedToday ? "Completed today" : "Show up today"}</span>
            <button
              onClick={handleToggle}
              className="rounded-full border border-brand-dark/20 px-4 py-2 text-sm font-medium text-brand-dark transition hover:border-brand-dark/40 hover:bg-brand-dark/5"
            >
              {isCompletedToday ? "Undo" : "Mark as done"}
            </button>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - index));
              const dateStr = date.toISOString().split("T")[0];
              const entry = habit.entries.find((item) => item.date === dateStr);
              const isCompleted = entry?.completed ?? false;
              const isToday = dateStr === today;

              return (
                <div
                  key={dateStr}
                  className={`flex h-10 flex-1 items-center justify-center rounded-2xl border transition ${
                    isCompleted
                      ? "border-brand-dark bg-brand-dark"
                      : "border-brand-dark/10 bg-brand-dark/5"
                  } ${isToday ? "ring-2 ring-brand-dark/30" : ""}`}
                  title={date.toLocaleDateString(undefined, {
                    weekday: "long",
                  })}
                  aria-label={`${date.toLocaleDateString(undefined, {
                    weekday: "long",
                  })} ${isCompleted ? "completed" : "not completed"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
