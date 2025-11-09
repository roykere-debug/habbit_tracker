"use client";

import { useEffect, useMemo, useState } from "react";
import HabitCard from "@/components/HabitCard";
import AITipModal from "@/components/AITipModal";
import AddHabitModal from "@/components/AddHabitModal";
import { Loader2, Plus, Sparkles } from "lucide-react";
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
  const [habitModalOpen, setHabitModalOpen] = useState(false);

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

  const handleAddHabit = async ({
    name,
    color,
    icon,
  }: {
    name: string;
    color: string;
    icon: string;
  }) => {
    try {
      const result = await createHabit({ name, color, icon });
      if (result.success && result.data) {
        await loadHabits();
        setError(null);
        return { success: true };
      }

      const message = result.error || "Failed to create habit";
      setError(message);
      return { success: false, error: message };
    } catch (err) {
      console.error("Error creating habit:", err);
      const message = "Failed to create habit";
      setError(message);
      return { success: false, error: message };
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

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const completedToday = habits.filter((habit) =>
    habit.entries.some((entry) => entry.date === today && entry.completed)
  ).length;

  const bestStreak = habits.reduce((max, habit) => {
    const sortedEntries = [...habit.entries]
      .filter((entry) => entry.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sortedEntries.length === 0) {
      return max;
    }

    let streak = 0;
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);

      const entryDateStr = entryDate.toISOString().split("T")[0];
      const expectedDateStr = expectedDate.toISOString().split("T")[0];

      if (entryDateStr === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }

    return Math.max(max, streak);
  }, 0);

  const completionRate =
    habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const stats = [
    {
      label: "Active Habits",
      value: habits.length.toString(),
      suffix: "",
    },
    {
      label: "Completed Today",
      value: completedToday.toString(),
      suffix: "",
    },
    {
      label: "Best Streak",
      value: `${bestStreak}`,
      suffix: " days",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}`,
      suffix: "%",
    },
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-cream">
        <div className="flex flex-col items-center gap-3 text-brand-dark/70">
          <Loader2 className="h-8 w-8 animate-spin text-brand-dark" />
          <p className="text-sm font-medium tracking-wide">Preparing your dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-brand-cream pb-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-dark/50">
              Daily Rituals
            </p>
            <h1 className="text-4xl font-semibold text-brand-dark">Habit Companion</h1>
            <p className="text-sm text-brand-dark/70">
              A calm space to keep your commitments and build momentum.
            </p>
          </div>
          <button
            onClick={handleGetAITip}
            className="inline-flex items-center gap-2 rounded-full border border-brand-dark/20 bg-white px-6 py-2 text-sm font-semibold text-brand-dark shadow-subtle/40 transition hover:border-brand-dark/40 hover:shadow-subtle"
          >
            <Sparkles className="h-4 w-4" />
            AI Inspiration
          </button>
        </header>

        {error && (
          <div className="rounded-3xl border border-brand-dark/20 bg-white px-6 py-4 text-sm text-brand-dark">
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium">Error: {error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold uppercase tracking-widest text-brand-dark/60 underline-offset-4 hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-brand-dark/10 bg-white p-6 shadow-subtle/40 transition hover:shadow-subtle"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-dark/50">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-brand-dark">
                {stat.value}
                {stat.suffix && (
                  <span className="text-base font-normal text-brand-dark/60">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          {habits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-dark/20 bg-white px-10 py-16 text-center shadow-subtle/30">
              <h2 className="text-2xl font-semibold text-brand-dark">
                Create your first habit
              </h2>
              <p className="mt-3 text-sm text-brand-dark/70">
                Capture a simple routine you can stick with daily. Start small, stay
                steady.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setHabitModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark-soft"
                >
                  <Plus className="h-4 w-4" />
                  Add Habit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
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
        </section>
      </div>

      <button
        onClick={() => setHabitModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark text-white shadow-subtle transition hover:bg-brand-dark-soft focus:outline-none focus:ring-4 focus:ring-brand-dark/30"
        aria-label="Add new habit"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddHabitModal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        onSubmit={handleAddHabit}
      />

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
