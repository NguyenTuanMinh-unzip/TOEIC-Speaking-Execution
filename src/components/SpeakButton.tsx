"use client";

import { speak } from "@/lib/speech";

/** A small "hear it" button that speaks the given text with the model voice. */
export function SpeakButton({
  text,
  label,
  rate = 0.95,
  className = "",
}: {
  text: string;
  label?: string;
  rate?: number;
  className?: string;
}) {
  return (
    <button
      onClick={() => speak(text, { rate })}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 text-sm font-semibold text-gray-200 transition hover:bg-ink-700 ${className}`}
      aria-label={`Listen: ${text}`}
    >
      <span aria-hidden>🔊</span>
      {label ?? "Hear"}
    </button>
  );
}
