"use client";

import { useState } from "react";

interface HabitFormProps {
  onSubmit: (values: {
    name: string;
    color: string;
    icon: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

const COLORS = ["#0f3d2e", "#14503c", "#1e624b", "#2a755a"];

const ICONS = ["💪", "📚", "🏃", "🧘", "💧", "🥗", "✍️", "🎯", "📖", "🎨", "🎵", "🌱"];

export default function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for your habit.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await onSubmit({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
    });

    setSubmitting(false);

    if (result.success) {
      setName("");
      setSelectedColor(COLORS[0]);
      setSelectedIcon(ICONS[0]);
      onCancel();
      return;
    }

    setError(result.error ?? "Something went wrong. Please try again.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="habit-name"
          className="text-sm font-medium text-brand-dark uppercase tracking-wide"
        >
          Habit Name
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Morning meditation"
          className="w-full rounded-xl border border-brand-dark/20 bg-brand-cream px-4 py-3 text-base text-brand-dark placeholder:text-brand-dark/50 focus:border-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark/20"
          autoFocus
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-brand-dark uppercase tracking-wide">
          Icon
        </p>
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((icon) => {
            const isSelected = selectedIcon === icon;
            return (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all ${
                  isSelected
                    ? "border-brand-dark bg-brand-dark/10 text-brand-dark"
                    : "border-brand-dark/10 bg-white text-brand-dark hover:border-brand-dark/30"
                }`}
              >
                <span className="text-xl">{icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-brand-dark uppercase tracking-wide">
          Accent Color
        </p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-10 w-10 rounded-full border-2 transition-all ${
                  isSelected ? "border-black shadow-subtle scale-110" : "border-transparent"
                }`}
              />
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-100/60 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark-soft disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Habit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-brand-dark/20 px-5 py-3 text-sm font-semibold text-brand-dark transition hover:border-brand-dark/40 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
