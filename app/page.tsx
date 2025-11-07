"use client";

import { useState, useEffect } from "react";
import HabitCard from "@/components/HabitCard";
import HabitForm from "@/components/HabitForm";
import AITipModal from "@/components/AITipModal";
import { Sparkles } from "lucide-react";
import { HabitWithEntries } from "@/types/habit";
import { getHabits, createHabit, deleteHabit } from "@/app/actions/habits";
import { toggleHabitEntry } from "@/app/actions/entries";
import { getAITip } from "@/app/actions/ai";

export default function Home() {
  const [habits, setHabits] = useState<HabitWithEntries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiTipModalOpen, setAITipModalOpen] = useState(false);
  const [aiTip, setAITip] = useState<string | null>(null);
  const [aiTipLoading, setAITipLoading] = useState(false);
  const [aiTipError, setAITipError] = useState<string | null>(null);

  // Load habits from server on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getHabits();
      if (result.success && result.data) {
        setHabits(result.data);
      } else {
        setError(result.error || "Failed to load habits");
      }
    } catch (err) {
      console.error("Error loading habits:", err);
      setError("Failed to load habits");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (name: string, color: string, icon: string) => {
    try {
      setError(null);
      const result = await createHabit({ name, color, icon });
      if (result.success && result.data) {
        // Reload habits to get the new one with entries
        await loadHabits();
      } else {
        setError(result.error || "Failed to create habit");
      }
    } catch (err) {
      console.error("Error creating habit:", err);
      setError("Failed to create habit");
    }
  };

  const handleToggleHabit = async (habitId: string, date: string) => {
    try {
      setError(null);
      const result = await toggleHabitEntry({ habitId, date });
      if (result.success) {
        // Optimistically update the UI
        setHabits((prevHabits) =>
          prevHabits.map((habit) => {
            if (habit.id !== habitId) return habit;

            const entries = [...habit.entries];
            const existingIndex = entries.findIndex((e) => e.date === date);

            if (existingIndex >= 0) {
              entries[existingIndex] = {
                ...entries[existingIndex],
                completed: !entries[existingIndex].completed,
              };
            } else if (result.data) {
              entries.push(result.data);
            }

            return { ...habit, entries };
          })
        );
      } else {
        setError(result.error || "Failed to toggle habit entry");
        // Reload on error to sync with server
        await loadHabits();
      }
    } catch (err) {
      console.error("Error toggling habit:", err);
      setError("Failed to toggle habit entry");
      await loadHabits();
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      setError(null);
      const result = await deleteHabit(habitId);
      if (result.success) {
        setHabits((prevHabits) => prevHabits.filter((h) => h.id !== habitId));
      } else {
        setError(result.error || "Failed to delete habit");
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
      setError("Failed to delete habit");
    }
  };

  const handleGetAITip = async () => {
    setAITipModalOpen(true);
    setAITipLoading(true);
    setAITipError(null);
    setAITip(null);

    try {
      const result = await getAITip();
      if (result.success && result.tip) {
        setAITip(result.tip);
      } else {
        setAITipError(result.error || "Failed to get AI tip");
      }
    } catch (err) {
      console.error("Error getting AI tip:", err);
      setAITipError("Failed to get AI tip. Please try again.");
    } finally {
      setAITipLoading(false);
    }
  };

  const completedToday = habits.filter((habit) => {
    const today = new Date().toISOString().split("T")[0];
    return habit.entries.some(
      (entry) => entry.date === today && entry.completed
    );
  }).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading habits...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Habit Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Build better habits, one day at a time
            </p>
          </div>
          <button
            onClick={handleGetAITip}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            AI Tip
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {habits.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Habits
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedToday}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed Today
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {habits.length > 0
                ? Math.round((completedToday / habits.length) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completion Rate
            </div>
          </div>
        </div>

        {/* Add Habit Form */}
        <div className="mb-8">
          <HabitForm onSubmit={handleAddHabit} />
        </div>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No habits yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Add your first habit to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Tip Modal */}
      <AITipModal
        isOpen={aiTipModalOpen}
        onClose={() => {
          setAITipModalOpen(false);
          setAITip(null);
          setAITipError(null);
        }}
        tip={aiTip}
        loading={aiTipLoading}
        error={aiTipError}
      />
    </main>
  );
}
