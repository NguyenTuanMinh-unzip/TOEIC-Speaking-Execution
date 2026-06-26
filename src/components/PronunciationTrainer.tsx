"use client";

import { useState } from "react";
import { Recorder } from "./Recorder";
import { SpeakButton } from "./SpeakButton";

/** Word → pronounce → score, one item at a time. The item to say is shown big
 *  and clear; the recorder scores the speech against exactly that item. */
export function PronunciationTrainer({
  items,
  day,
  topic,
}: {
  items: string[];
  day: number;
  topic: string;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());

  const item = items[index];
  const isWord = !item.includes(" ");
  const atEnd = index === items.length - 1;

  function go(to: number) {
    setIndex(Math.max(0, Math.min(items.length - 1, to)));
  }

  return (
    <div className="space-y-4">
      {/* Progress dots */}
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

      {/* The thing to say — big and clear */}
      <div className="card flex flex-col items-center gap-4 py-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Say this out loud</p>
        <p className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">{item}</p>
        <SpeakButton text={item} label="Hear it" rate={isWord ? 0.8 : 0.9} />
      </div>

      {/* Record & score against THIS item (key forces a fresh recorder per item) */}
      <Recorder
        key={index}
        day={day}
        taskType="pronunciation"
        topic={topic}
        subTask={`item-${index + 1}`}
        score={{ mode: "read", target: item }}
        onSaved={() => setDone((prev) => new Set(prev).add(index))}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => go(index - 1)} disabled={index === 0} className="btn-ghost flex-1">
          ← Prev
        </button>
        <button
          onClick={() => go(index + 1)}
          disabled={atEnd}
          className="btn-primary flex-1"
        >
          {atEnd ? "Last item" : "Next word →"}
        </button>
      </div>
    </div>
  );
}
