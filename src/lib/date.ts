import { START_DATE, TOTAL_DAYS } from "./constants";

// ---------------------------------------------------------------------------
// Date helpers. All logic works in the user's LOCAL timezone and treats a day
// as a calendar date (no time-of-day partial credit).
// ---------------------------------------------------------------------------

/** Parse a yyyy-mm-dd string into a local Date at midnight. */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format a Date as yyyy-mm-dd in local time. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today's local date at midnight. */
export function todayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole-day difference (b - a) ignoring time-of-day. */
export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / 86_400_000);
}

/**
 * The current program day number based on today's date.
 * Returns 0 if the program hasn't started yet, clamps to TOTAL_DAYS.
 */
export function currentDayNumber(reference: Date = todayLocal()): number {
  const start = parseLocalDate(START_DATE);
  const diff = daysBetween(start, reference);
  if (diff < 0) return 0;
  return Math.min(diff + 1, TOTAL_DAYS);
}

/** The calendar date a given day number maps to. */
export function dateForDay(day: number): Date {
  const start = parseLocalDate(START_DATE);
  const d = new Date(start);
  d.setDate(start.getDate() + (day - 1));
  return d;
}

/** Whether a given day number falls on a Saturday → Full Training Day. */
export function isSaturday(day: number): boolean {
  return dateForDay(day).getDay() === 6;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function prettyDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Days remaining until the program starts (0 if started). */
export function daysUntilStart(reference: Date = todayLocal()): number {
  const diff = daysBetween(reference, parseLocalDate(START_DATE));
  return Math.max(diff, 0);
}
