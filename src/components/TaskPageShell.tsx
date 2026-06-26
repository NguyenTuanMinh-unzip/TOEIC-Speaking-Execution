"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { Timer } from "./Timer";
import { PRESSURE } from "@/lib/constants";
import type { TaskType } from "@/lib/types";

interface Props {
  taskType: TaskType;
  title: string;
  subtitle?: string;
  minutes: number;
  /** Whether the "Mark complete" action should be enabled (page-specific rules). */
  canComplete: boolean;
  /** Hint shown when completion is blocked. */
  blockedHint?: string;
  children: React.ReactNode;
}

export function TaskPageShell({
  taskType,
  title,
  subtitle,
  minutes,
  canComplete,
  blockedHint,
  children,
}: Props) {
  const mounted = useMounted();
  const day = useCurrentDay();
  const router = useRouter();
  const completeTask = useStore((s) => s.completeTask);
  const status = useStore((s) => s.days[day]?.tasks[taskType]);
  const [error, setError] = useState("");

  const done = status === "done";

  function handleComplete() {
    setError("");
    const res = completeTask(day, taskType);
    if (!res.ok) {
      setError(res.reason === "recording" ? PRESSURE.recordingRequired : "Finish the task first.");
      return;
    }
    router.push("/");
  }

  if (!mounted) {
    return <div className="py-20 text-center text-gray-600">Loading…</div>;
  }

  if (day === 0) {
    return (
      <div className="card text-center">
        <p className="text-lg font-bold">The program hasn&apos;t started yet.</p>
        <p className="mt-2 text-gray-400">Come back on Day 1 (29 June).</p>
        <Link href="/" className="btn-ghost mt-4">
          Back to Today
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-gray-200">
          ← Today
        </Link>
        <span className="pill bg-ink-700 text-gray-300">{minutes} min</span>
      </div>

      <div>
        <h1 className="text-2xl font-black tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-gray-400">{subtitle}</p>}
      </div>

      <Timer targetMinutes={minutes} />

      {children}

      <div className="sticky bottom-20 z-20 pt-2">
        {done ? (
          <div className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent-soft px-5 py-4">
            <span className="font-bold text-accent">Task complete ✓</span>
            <Link href="/" className="btn-ghost">
              Back to Today
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={handleComplete}
              disabled={!canComplete}
              className="btn-primary w-full text-lg"
            >
              Mark “{title}” complete
            </button>
            {!canComplete && blockedHint && (
              <p className="mt-2 text-center text-sm text-gold">{blockedHint}</p>
            )}
            {error && <p className="mt-2 text-center text-sm text-danger">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
