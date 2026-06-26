"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/settings-store";
import { useStore } from "@/lib/store";
import { currentDayNumber, toISODate, todayLocal } from "@/lib/date";
import { fireReminder, notificationPermission } from "@/lib/reminder";
import { PRESSURE } from "@/lib/constants";

/** Registers the service worker (PWA/offline) and runs the daily reminder
 *  check while the app is open. Renders nothing. */
export function PWA() {
  const days = useStore((s) => s.days);
  const reminderEnabled = useSettings((s) => s.reminderEnabled);
  const reminderTime = useSettings((s) => s.reminderTime);
  const lastNotified = useSettings((s) => s.lastNotified);
  const markNotified = useSettings((s) => s.markNotified);

  // Register the service worker (production only — avoids dev HMR conflicts).
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Daily reminder loop.
  useEffect(() => {
    if (!reminderEnabled) return;

    function check() {
      if (notificationPermission() !== "granted") return;
      const today = toISODate(todayLocal());
      if (lastNotified === today) return;

      const now = new Date();
      const cur = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      if (cur < reminderTime) return;

      const day = currentDayNumber();
      if (day === 0) return;
      const done = days[day]?.completed;
      if (done) return;

      fireReminder(
        "TOEIC Speaking — Day " + day,
        PRESSURE.incomplete + " Speak now."
      );
      markNotified(today);
    }

    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [reminderEnabled, reminderTime, lastNotified, markNotified, days]);

  return null;
}
