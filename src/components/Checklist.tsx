"use client";

import type { DayProgress } from "@/lib/types";
import { TASK_ORDER } from "@/lib/types";

const LABELS: Record<string, string> = {
  pronunciation: "Pronunciation",
  shadowing: "Shadowing",
  speaking: "Speaking",
  toeic: "TOEIC Practice",
};

/** The mandatory daily checklist. All boxes checked → SUCCESS DAY. */
export function Checklist({
  day,
  hasRecording,
}: {
  day: DayProgress;
  hasRecording: boolean;
}) {
  const items = [
    ...TASK_ORDER.map((t) => ({
      label: LABELS[t],
      checked: day.tasks[t] === "done",
    })),
    { label: "Recording", checked: hasRecording },
  ];

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-3 rounded-xl bg-ink-800 px-4 py-3"
        >
          <span
            className={`grid h-6 w-6 place-items-center rounded-md border text-sm font-bold ${
              item.checked
                ? "border-accent bg-accent text-ink-950"
                : "border-ink-600 text-transparent"
            }`}
            aria-hidden
          >
            ✓
          </span>
          <span className={item.checked ? "font-semibold" : "text-gray-400"}>
            {item.label}
          </span>
          {!item.checked && (
            <span className="ml-auto text-xs uppercase tracking-widest text-gray-600">
              pending
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
