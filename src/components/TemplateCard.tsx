"use client";

import type { SpeakingTemplate } from "@/lib/templates";

/** Displays a fixed template the user must SPEAK from. There is deliberately
 *  no text input — the output is voice, not typing. */
export function TemplateCard({
  template,
  accent = false,
}: {
  template: SpeakingTemplate;
  accent?: boolean;
}) {
  return (
    <div
      className={`card ${accent ? "border-accent/40" : ""}`}
      aria-label={`${template.title} — speak each line aloud`}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          {template.title}
        </p>
        <span className="pill bg-ink-700 text-gray-400">Speak, don&apos;t type</span>
      </div>
      <ol className="space-y-2.5">
        {template.lines.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl bg-ink-800 px-4 py-3 text-lg font-medium"
          >
            <span className="mt-0.5 text-sm font-bold text-gray-600">{i + 1}</span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A lightweight bullet template for hint lists (TOEIC hints, etc.). */
export function HintList({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-800 p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">{title}</p>
      <ul className="space-y-1.5">
        {lines.map((l, i) => (
          <li key={i} className="text-lg font-medium text-gray-100">
            “{l}”
          </li>
        ))}
      </ul>
    </div>
  );
}
