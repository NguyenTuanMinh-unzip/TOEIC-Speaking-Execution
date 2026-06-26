"use client";

import { useEffect, useRef, useState } from "react";

/** A simple count-up practice timer with a target. It guides the user toward
 *  the prescribed minutes but never blocks completion — the artifacts (and
 *  recordings) are what gate a task, not a clock. */
export function Timer({ targetMinutes }: { targetMinutes: number }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const target = targetMinutes * 60;
  const pct = Math.min(1, seconds / target) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const reached = seconds >= target;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">Focus timer</p>
          <p className="font-mono text-3xl font-bold tabular-nums">
            {mm}:{ss}
            <span className="ml-2 text-sm text-gray-500">/ {targetMinutes}:00</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRunning((r) => !r)} className="btn-ghost">
            {running ? "Pause" : seconds === 0 ? "Start" : "Resume"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(0);
            }}
            className="btn-ghost"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
        <div
          className={`h-full rounded-full transition-all ${reached ? "bg-accent" : "bg-gold"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {reached && (
        <p className="mt-2 text-xs font-semibold text-accent">Target reached. Keep going if you can.</p>
      )}
    </div>
  );
}
