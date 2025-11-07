"use client";

import { HabitWithEntries } from "@/types/habit";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface HabitCardProps {
  habit: HabitWithEntries;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getTodayEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    return habit.entries.find((entry) => entry.date === today);
  };

  const isCompletedToday = getTodayEntry()?.completed ?? false;
  const today = new Date().toISOString().split("T")[0];

  const handleToggle = () => {
    onToggle(habit.id, today);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${habit.name}"?`)) {
      setIsDeleting(true);
      onDelete(habit.id);
    }
  };

  // Get streak count
  const getStreak = () => {
    const sortedEntries = [...habit.entries]
      .filter((e) => e.completed)
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

  const streak = getStreak();

  if (isDeleting) return null;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeftColor: habit.color, borderLeftWidth: "4px" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
            style={{ backgroundColor: habit.color }}
          >
            {habit.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {habit.name}
            </h3>
            {streak > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🔥 {streak} day streak
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete habit"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            isCompletedToday
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
          }`}
        >
          {isCompletedToday ? (
            <>
              <Check className="w-5 h-5" />
              Completed
            </>
          ) : (
            <>
              <X className="w-5 h-5" />
              Mark as done
            </>
          )}
        </button>
      </div>

      {/* Recent activity */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const dateStr = date.toISOString().split("T")[0];
            const entry = habit.entries.find((e) => e.date === dateStr);
            const isCompleted = entry?.completed ?? false;
            const isToday = dateStr === today;

            return (
              <div
                key={index}
                className={`flex-1 h-8 rounded ${
                  isCompleted
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                } ${isToday ? "ring-2 ring-blue-500" : ""}`}
                title={date.toLocaleDateString()}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

