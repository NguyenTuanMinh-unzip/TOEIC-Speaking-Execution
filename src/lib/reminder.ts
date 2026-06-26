// ---------------------------------------------------------------------------
// Reminder helpers: notification permission, firing, and a downloadable .ics
// so the phone's calendar can remind the user every day even when the app is
// closed (a no-backend app can't push reliably on its own).
// ---------------------------------------------------------------------------

import { START_DATE } from "./constants";

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return "denied";
  return Notification.requestPermission();
}

/** Fire a notification now (via the service worker if available, else direct). */
export async function fireReminder(title: string, body: string): Promise<void> {
  if (!notificationsSupported() || Notification.permission !== "granted") return;
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      reg.active?.postMessage({ type: "notify", title, body });
      return;
    }
  } catch {
    /* fall through */
  }
  new Notification(title, { body, icon: "/icon-192.png" });
}

/** Build a daily-recurring VEVENT (.ics) with an alarm at the chosen time. */
export function buildReminderICS(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const [y, mo, d] = START_DATE.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dtstart = `${y}${pad(mo)}${pad(d)}T${pad(h)}${pad(m)}00`;
  const stamp = `${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TOEIC Speaking Execution//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:toeic-daily-${dtstart}@toeic.local`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtstart}`,
    "DURATION:PT120M",
    "RRULE:FREQ=DAILY;COUNT=180",
    "SUMMARY:TOEIC Speaking — 120 min practice",
    "DESCRIPTION:Speak every day. No excuses. Open the app and finish all 4 tasks.",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Time to practice speaking",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(time: string): void {
  const ics = buildReminderICS(time);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "toeic-daily-reminder.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
