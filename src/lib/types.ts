// ---------------------------------------------------------------------------
// Core domain types for the TOEIC Speaking Execution System.
// ---------------------------------------------------------------------------

export type TaskType = "pronunciation" | "shadowing" | "speaking" | "toeic";

export type TaskStatus = "not_started" | "in_progress" | "done";

/** The four fixed daily tasks, in fixed order, with their fixed durations. */
export const TASK_ORDER: TaskType[] = [
  "pronunciation",
  "shadowing",
  "speaking",
  "toeic",
];

export interface TaskDef {
  type: TaskType;
  label: string;
  minutes: number;
  href: string;
  /** Whether finishing this task requires at least one saved recording. */
  requiresRecording: boolean;
  blurb: string;
}

/** Persisted progress for a single day, keyed by day number (1..180). */
export interface DayProgress {
  day: number;
  /** ISO date (yyyy-mm-dd) this day maps to. */
  date: string;
  tasks: Record<TaskType, TaskStatus>;
  /** True once all four tasks are done. */
  completed: boolean;
  /** Marked failed if the calendar date passed without completion. */
  failed: boolean;
  /** ISO timestamp the day was completed. */
  completedAt?: string;
}

/** Metadata stored alongside each audio blob in IndexedDB. */
export interface RecordingMeta {
  id: number;
  day: number;
  topic: string;
  taskType: TaskType;
  /** Optional sub-task id (e.g. TOEIC task1..task4, Saturday intro/work/life). */
  subTask?: string;
  timestamp: number; // epoch ms
  durationMs: number;
  mimeType: string;
}

export interface Recording extends RecordingMeta {
  blob: Blob;
}

/** Counts of recordings per day -> taskType, used to gate task completion. */
export type RecordingCounts = Record<number, Partial<Record<TaskType, number>>>;
