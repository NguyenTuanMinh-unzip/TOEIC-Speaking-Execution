import type { TaskDef } from "./types";

// ---------------------------------------------------------------------------
// Program constants. These are intentionally FIXED. The system is not flexible.
// ---------------------------------------------------------------------------

export const START_DATE = "2026-07-01";

/** Total program length. */
export const TOTAL_DAYS = 180;

/** Number of fixed topics before the loop restarts. */
export const TOPIC_CYCLE = 30;

/** Minutes per task — total 120 min/day. */
export const DAILY_MINUTES = 120;

export const TASKS: TaskDef[] = [
    {
        type: "pronunciation",
        label: "Pronunciation",
        minutes: 20,
        href: "/pronunciation",
        requiresRecording: false,
        blurb: "Drill today's target sounds. Mouth before brain.",
    },
    {
        type: "shadowing",
        label: "Shadowing",
        minutes: 30,
        href: "/shadowing",
        requiresRecording: false,
        blurb: "Listen → repeat → match. 5x per sentence.",
    },
    {
        type: "speaking",
        label: "Guided Speaking",
        minutes: 40,
        href: "/speaking",
        requiresRecording: true,
        blurb: "Use the template. Record your output. No free talk.",
    },
    {
        type: "toeic",
        label: "TOEIC Practice",
        minutes: 30,
        href: "/toeic",
        requiresRecording: true,
        blurb: "4 tasks. Read, describe, answer, opine. Record each.",
    },
];

export const PRESSURE = {
    fail: "You are breaking your 6-month commitment.",
    success: "✅ SUCCESS DAY – Keep going.",
    incomplete: "The day is not done. Finish every task or it counts as FAILED.",
    recordingRequired: "You cannot complete speaking without recording. Record now.",
};
