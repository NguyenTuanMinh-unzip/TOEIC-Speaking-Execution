"use client";

import { useState } from "react";
import { speak, stopSpeaking } from "@/lib/speech";
import { SpeakButton } from "./SpeakButton";

/** "Stuck for ideas?" → reveals a model answer to read aloud and shadow.
 *  Accepts either an array of lines or a single paragraph string. */
export function StuckHelp({
  lines,
  title = "Stuck for ideas? Show a model answer",
}: {
  lines: string[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  function playAll() {
    stopSpeaking();
    const text = lines.join(" ");
    speak(text, { rate: 0.9 });
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-gold/[0.06]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gold">
          <span aria-hidden>💡</span> {title}
        </span>
        <span className="text-gold transition" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          ▾
        </span>
      </button>

      {open && (
        <div className="space-y-2 px-4 pb-4">
          <div className="mb-1 flex justify-end">
            <button
              onClick={playAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/15"
            >
              🔊 Hear all
            </button>
          </div>
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl bg-ink-900/60 px-4 py-2.5"
            >
              <span className="text-base font-medium text-gray-100">{line}</span>
              <SpeakButton text={line} label="" rate={0.9} />
            </div>
          ))}
          <p className="pt-1 text-xs text-gray-500">
            Read it aloud once, then say it in your own words. Copying first is allowed — output first.
          </p>
        </div>
      )}
    </div>
  );
}
