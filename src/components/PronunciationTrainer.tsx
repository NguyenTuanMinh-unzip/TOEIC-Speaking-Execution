"use client";

import { useState } from "react";
import { Recorder } from "./Recorder";
import { SpeakButton } from "./SpeakButton";
import { PhonemeTipCard } from "./PhonemeTipCard";
import { lookupWord, tipsForItem } from "@/lib/phonetics";
import type { ScoreResult } from "@/lib/scoring";

/** Word → pronounce → score, one item at a time. Shows the IPA, and reveals
 *  mouth-shape guidance for the relevant sounds after repeated wrong attempts. */
export function PronunciationTrainer({
  items,
  day,
  topic,
  fallbackTips,
}: {
  items: string[];
  day: number;
  topic: string;
  /** Phoneme keys to fall back to when an item isn't a known word. */
  fallbackTips: string[];
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [failures, setFailures] = useState<Record<number, number>>({});
  const [openTips, setOpenTips] = useState<Set<number>>(new Set());

  const item = items[index];
  const isWord = !item.includes(" ");
  const atEnd = index === items.length - 1;
  const info = lookupWord(item);
  const tips = tipsForItem(item, fallbackTips);
  const fails = failures[index] ?? 0;
  const tipsOpen = openTips.has(index);

  function go(to: number) {
    setIndex(Math.max(0, Math.min(items.length - 1, to)));
  }
  function toggleTips() {
    setOpenTips((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }
  function handleScored(result: ScoreResult) {
    if (result.kind !== "read") return;
    if (result.accuracy >= 60) return;
    setFailures((prev) => {
      const n = (prev[index] ?? 0) + 1;
      if (n >= 2) setOpenTips((s) => new Set(s).add(index)); // auto-reveal help
      return { ...prev, [index]: n };
    });
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">
          {isWord ? "Word" : "Sentence"} {index + 1} / {items.length}
        </p>
        <p className="text-xs text-gray-500">{done.size} scored</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to item ${i + 1}`}
            className={`h-2 flex-1 rounded-full transition ${
              done.has(i) ? "bg-accent" : i === index ? "bg-accent/40" : "bg-ink-700"
            }`}
          />
        ))}
      </div>

      {/* The thing to say — big, with IPA */}
      <div className="card flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Say this out loud</p>
        <p className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{item}</p>
        {info && (
          <p className="font-mono text-xl font-semibold text-accent">{info.ipa}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <SpeakButton text={item} label="Hear it" rate={isWord ? 0.8 : 0.9} />
          {tips.length > 0 && (
            <button
              onClick={toggleTips}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/15"
            >
              👄 Cách phát âm
            </button>
          )}
        </div>
        {fails >= 2 && (
          <p className="text-xs font-semibold text-danger">
            Bạn phát âm chưa đúng {fails} lần — xem khẩu hình bên dưới 👇
          </p>
        )}
      </div>

      {/* Mouth-shape guidance */}
      {tipsOpen && tips.length > 0 && (
        <div className="card rise space-y-3 ring-1 ring-accent/15">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Hướng dẫn khẩu hình — các âm trong từ này
          </p>
          {tips.map((t) => (
            <PhonemeTipCard key={t.key} tip={t} />
          ))}
        </div>
      )}

      {/* Record & score against THIS item */}
      <Recorder
        key={index}
        day={day}
        taskType="pronunciation"
        topic={topic}
        subTask={`item-${index + 1}`}
        score={{ mode: "read", target: item }}
        onScored={handleScored}
        onSaved={() => setDone((prev) => new Set(prev).add(index))}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => go(index - 1)} disabled={index === 0} className="btn-ghost flex-1">
          ← Prev
        </button>
        <button onClick={() => go(index + 1)} disabled={atEnd} className="btn-primary flex-1">
          {atEnd ? "Last item" : "Next word →"}
        </button>
      </div>
    </div>
  );
}
