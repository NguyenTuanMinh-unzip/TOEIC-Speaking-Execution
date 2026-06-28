"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { speak, stopSpeaking, speechSupported } from "@/lib/speech";
import { REPEATS_PER_SENTENCE, type ShadowScript } from "@/lib/shadowing-data";
import { pronFocusForDay } from "@/lib/pronunciation";
import { Recorder } from "./Recorder";
import { PronunciationHelp } from "./PronunciationHelp";

/** Sentence-by-sentence shadowing: hear the model 5x, then record yourself. */
export function ShadowingPlayer({
  script,
  day,
  onAllSeen,
}: {
  script: ShadowScript;
  day: number;
  onAllSeen?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [rep, setRep] = useState(0); // completed repeats of current sentence
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(new Set([0]));
  const cancelRef = useRef(false);

  const sentence = script.sentences[index];
  const supported = speechSupported();
  const focusTips = pronFocusForDay(day).tipKeys;

  useEffect(() => {
    return () => {
      cancelRef.current = true;
      stopSpeaking();
    };
  }, []);

  // Reset rep counter when sentence changes.
  useEffect(() => {
    setRep(0);
    stopSpeaking();
    setPlaying(false);
    cancelRef.current = true;
  }, [index]);

  useEffect(() => {
    if (seen.size === script.sentences.length) onAllSeen?.();
  }, [seen, script.sentences.length, onAllSeen]);

  const playRepeats = useCallback(() => {
    cancelRef.current = false;
    setPlaying(true);
    setRep(0);
    let count = 0;
    const next = () => {
      if (cancelRef.current) {
        setPlaying(false);
        return;
      }
      if (count >= REPEATS_PER_SENTENCE) {
        setPlaying(false);
        return;
      }
      count += 1;
      setRep(count);
      speak(sentence, {
        rate: 0.85,
        onEnd: () => {
          if (count < REPEATS_PER_SENTENCE && !cancelRef.current) {
            setTimeout(next, 500);
          } else {
            setPlaying(false);
          }
        },
      });
    };
    next();
  }, [sentence]);

  const stop = useCallback(() => {
    cancelRef.current = true;
    stopSpeaking();
    setPlaying(false);
  }, []);

  function go(to: number) {
    const clamped = Math.max(0, Math.min(script.sentences.length - 1, to));
    setIndex(clamped);
    setSeen((prev) => new Set(prev).add(clamped));
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="uppercase tracking-widest">{script.source}</span>
          <span>
            Sentence {index + 1} / {script.sentences.length}
          </span>
        </div>
        <h2 className="mt-1 text-sm font-bold text-gray-400">{script.title}</h2>

        <p className="my-5 text-center text-2xl font-bold leading-snug">{sentence}</p>

        {!supported && (
          <p className="mb-3 text-center text-xs text-gold">
            Your browser has no speech voice — read the sentence aloud yourself, 5 times.
          </p>
        )}

        {/* Repeat tracker dots */}
        <div className="mb-4 flex justify-center gap-2">
          {Array.from({ length: REPEATS_PER_SENTENCE }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${
                i < rep ? "bg-accent" : "bg-ink-600"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          {playing ? (
            <button onClick={stop} className="btn-danger flex-1">
              Stop
            </button>
          ) : (
            <button onClick={playRepeats} disabled={!supported} className="btn-primary flex-1">
              ▶ Play 5× &amp; shadow
            </button>
          )}
        </div>

        <div className="mt-3 flex justify-between">
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="btn-ghost px-4 py-2 text-sm"
          >
            ← Prev
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index === script.sentences.length - 1}
            className="btn-ghost px-4 py-2 text-sm"
          >
            Next →
          </button>
        </div>
      </div>

      <PronunciationHelp text={sentence} fallbackTips={focusTips} />

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
          Record your shadow of this sentence (optional)
        </p>
        <Recorder
          day={day}
          taskType="shadowing"
          topic={script.title}
          subTask={`s${index + 1}`}
          label={`Shadow — sentence ${index + 1}`}
          score={{ mode: "read", target: sentence }}
        />
      </div>
    </div>
  );
}
