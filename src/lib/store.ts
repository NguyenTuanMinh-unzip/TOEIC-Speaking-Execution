"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DayProgress, RecordingCounts, TaskStatus, TaskType } from "./types";
import { TASK_ORDER } from "./types";
import { TASKS } from "./constants";
import { buildRecordingCounts } from "./audio-db";
import { topicForDay } from "./topics";
import { currentDayNumber, dateForDay, toISODate, todayLocal } from "./date";

// ---------------------------------------------------------------------------
// Single source of truth for progress and the discipline rules. Persisted to
// localStorage. Audio blobs live in IndexedDB; here we keep only counts.
// ---------------------------------------------------------------------------

function emptyDay(day: number): DayProgress {
  return {
    day,
    date: toISODate(dateForDay(day)),
    tasks: {
      pronunciation: "not_started",
      shadowing: "not_started",
      speaking: "not_started",
      toeic: "not_started",
    },
    completed: false,
    failed: false,
  };
}

function recordingRequired(task: TaskType): boolean {
  return TASKS.find((t) => t.type === task)?.requiresRecording ?? false;
}

interface SpeakingState {
  hydrated: boolean;
  days: Record<number, DayProgress>;
  recordingCounts: RecordingCounts;

  // lifecycle
  init: () => Promise<void>;
  refreshCounts: () => Promise<void>;

  // reads
  getDay: (day: number) => DayProgress;
  recordingCount: (day: number, task: TaskType) => number;

  // writes
  startTask: (day: number, task: TaskType) => void;
  completeTask: (day: number, task: TaskType) => { ok: boolean; reason?: string };
  resetTask: (day: number, task: TaskType) => void;
  registerRecording: (day: number, task: TaskType) => void;
}

function recompute(day: DayProgress): DayProgress {
  const completed = TASK_ORDER.every((t) => day.tasks[t] === "done");
  return {
    ...day,
    completed,
    completedAt: completed ? day.completedAt ?? new Date().toISOString() : undefined,
  };
}

export const useStore = create<SpeakingState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      days: {},
      recordingCounts: {},

      init: async () => {
        try {
          const counts = await buildRecordingCounts();
          set({ recordingCounts: counts, hydrated: true });
        } catch {
          set({ hydrated: true });
        }
      },

      refreshCounts: async () => {
        try {
          const counts = await buildRecordingCounts();
          set({ recordingCounts: counts });
        } catch {
          /* ignore */
        }
      },

      getDay: (day) => get().days[day] ?? emptyDay(day),

      recordingCount: (day, task) => get().recordingCounts[day]?.[task] ?? 0,

      startTask: (day, task) =>
        set((state) => {
          const current = state.days[day] ?? emptyDay(day);
          if (current.tasks[task] === "done") return state;
          const next: DayProgress = {
            ...current,
            tasks: { ...current.tasks, [task]: "in_progress" as TaskStatus },
          };
          return { days: { ...state.days, [day]: next } };
        }),

      completeTask: (day, task) => {
        const state = get();
        if (recordingRequired(task) && state.recordingCount(day, task) < 1) {
          return { ok: false, reason: "recording" };
        }
        set((s) => {
          const current = s.days[day] ?? emptyDay(day);
          const next = recompute({
            ...current,
            tasks: { ...current.tasks, [task]: "done" as TaskStatus },
          });
          return { days: { ...s.days, [day]: next } };
        });
        return { ok: true };
      },

      resetTask: (day, task) =>
        set((state) => {
          const current = state.days[day] ?? emptyDay(day);
          const next = recompute({
            ...current,
            tasks: { ...current.tasks, [task]: "not_started" as TaskStatus },
          });
          return { days: { ...state.days, [day]: next } };
        }),

      registerRecording: (day, task) =>
        set((state) => {
          const dayCounts = { ...(state.recordingCounts[day] ?? {}) };
          dayCounts[task] = (dayCounts[task] ?? 0) + 1;
          // recording a speaking/toeic clip auto-advances the task to in_progress
          const current = state.days[day] ?? emptyDay(day);
          const tasks =
            current.tasks[task] === "not_started"
              ? { ...current.tasks, [task]: "in_progress" as TaskStatus }
              : current.tasks;
          return {
            recordingCounts: { ...state.recordingCounts, [day]: dayCounts },
            days: { ...state.days, [day]: { ...current, tasks } },
          };
        }),
    }),
    {
      name: "toeic-speaking-progress",
      partialize: (state) => ({ days: state.days }),
      onRehydrateStorage: () => (state) => {
        // After localStorage rehydrates, pull recording counts from IndexedDB.
        state?.init();
      },
    }
  )
);

// --- Derived selectors (pure, used by components) --------------------------

/** Fraction (0..1) of today's tasks completed. */
export function dayCompletionFraction(day: DayProgress): number {
  const done = TASK_ORDER.filter((t) => day.tasks[t] === "done").length;
  return done / TASK_ORDER.length;
}

/** Consecutive completed days ending at (or just before) the current day. */
export function computeStreak(days: Record<number, DayProgress>): number {
  const today = currentDayNumber();
  if (today === 0) return 0;
  let streak = 0;
  // If today isn't finished yet, start the count from yesterday.
  let d = days[today]?.completed ? today : today - 1;
  while (d >= 1 && days[d]?.completed) {
    streak++;
    d--;
  }
  return streak;
}

/** Days that should have been completed but weren't (calendar date passed). */
export function computeFailedDays(days: Record<number, DayProgress>): number[] {
  const today = currentDayNumber();
  const failed: number[] = [];
  for (let d = 1; d < today; d++) {
    if (!days[d]?.completed) failed.push(d);
  }
  return failed;
}

export function totalCompletedDays(days: Record<number, DayProgress>): number {
  return Object.values(days).filter((d) => d.completed).length;
}

// Re-export for convenience.
export { TASK_ORDER, TASKS };
export { todayLocal, topicForDay };
