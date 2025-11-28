"use client";

import { X, Sparkles, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface AITipModalProps {
  isOpen: boolean;
  onClose: () => void;
  tip: string | null;
  loading: boolean;
  error: string | null;
  habitName?: string;
}

export default function AITipModal({
  isOpen,
  onClose,
  tip,
  loading,
  error,
  habitName,
}: AITipModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-strong shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-dark/10 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-brand-dark/10 p-2">
              <Sparkles className="h-5 w-5 text-brand-dark" />
            </div>
            <h2 className="text-2xl font-semibold text-brand-dark">
              {habitName ? `AI Insights: ${habitName}` : "AI Habit Tip"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-dark/50 transition hover:bg-brand-dark/10 hover:text-brand-dark"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-brand-dark" />
              <p className="text-sm text-brand-dark/70">
                {habitName ? "Analyzing your habit performance..." : "Getting your personalized tip..."}
              </p>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 text-brand-dark">
              <p className="mb-2 font-semibold">
                Error
              </p>
              <p className="text-sm">
                {error}
              </p>
            </div>
          )}

          {tip && !loading && (
            <div className="space-y-4">
              <div className="border border-brand-dark/10 bg-brand-dark/5 p-6">
                <p className="text-lg leading-relaxed text-brand-dark whitespace-pre-wrap">
                  {tip}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-dark/60">
                <Sparkles className="h-4 w-4" />
                <span>Powered by OpenAI</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-brand-dark/10 p-6">
          <button
            onClick={onClose}
            className="bg-brand-dark px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark-soft"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

