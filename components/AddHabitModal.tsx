"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import HabitForm from "./HabitForm";

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    color: string;
    icon: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function AddHabitModal({
  isOpen,
  onClose,
  onSubmit,
}: AddHabitModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-subtle">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-brand-dark/10 text-brand-dark transition hover:border-brand-dark/30 hover:text-brand-dark-soft"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-dark/60">
            New Habit
          </p>
          <h2 className="text-2xl font-semibold text-brand-dark">
            Build a sustainable routine
          </h2>
          <p className="text-sm text-brand-dark/70">
            Add a small habit you can show up for daily. Consistency compounds.
          </p>
        </div>
        <HabitForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
}

