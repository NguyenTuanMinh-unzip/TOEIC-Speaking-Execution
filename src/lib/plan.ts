// ---------------------------------------------------------------------------
// Program-level plan helpers: monthly checkpoints, Saturday full-training
// sub-tasks, and the speaking-output target that grows over 6 months.
// ---------------------------------------------------------------------------

export interface Checkpoint {
  month: number;
  dayStart: number;
  dayEnd: number;
  goal: string;
  /** Short target shown on the speaking screen. */
  target: string;
}

export const CHECKPOINTS: Checkpoint[] = [
  { month: 1, dayStart: 1, dayEnd: 30, goal: "Speak 5 sentences", target: "5 sentences" },
  { month: 2, dayStart: 31, dayEnd: 60, goal: "Speak 7–10 sentences", target: "7–10 sentences" },
  { month: 3, dayStart: 61, dayEnd: 90, goal: "Speak 30–60 seconds", target: "30–60 seconds" },
  { month: 4, dayStart: 91, dayEnd: 120, goal: "Speak 30–60 seconds, fewer pauses", target: "30–60 seconds" },
  { month: 5, dayStart: 121, dayEnd: 150, goal: "Full TOEIC responses", target: "Full responses" },
  { month: 6, dayStart: 151, dayEnd: 180, goal: "Full TOEIC responses, exam pace", target: "Full responses" },
];

export function monthForDay(day: number): number {
  return Math.min(Math.floor((day - 1) / 30) + 1, 6);
}

export function checkpointForDay(day: number): Checkpoint {
  return CHECKPOINTS[monthForDay(day) - 1];
}

// --- Saturday "Full Training Day" sub-tasks --------------------------------
export interface SaturdaySubTask {
  id: string;
  label: string;
  prompt: string;
  minSeconds: number;
}

export const SATURDAY_TASKS: SaturdaySubTask[] = [
  {
    id: "intro",
    label: "Introduce Yourself",
    prompt: "Talk about who you are: name, where you live, your job. Speak 2–3 minutes.",
    minSeconds: 120,
  },
  {
    id: "work",
    label: "Talk About Work",
    prompt: "Describe what you do at work, a normal day, what you like and dislike.",
    minSeconds: 60,
  },
  {
    id: "life",
    label: "Talk About Daily Life",
    prompt: "Describe your routine, hobbies, weekends, and what you usually do.",
    minSeconds: 60,
  },
  {
    id: "mock",
    label: "TOEIC Mock",
    prompt: "Do one full pass of all 4 TOEIC tasks back to back, no stopping.",
    minSeconds: 0,
  },
];
