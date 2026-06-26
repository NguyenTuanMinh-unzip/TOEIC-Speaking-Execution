"use client";

import { useState } from "react";
import { useMounted } from "@/lib/hooks";
import { useSettings } from "@/lib/settings-store";
import {
  downloadICS,
  fireReminder,
  notificationPermission,
  requestNotificationPermission,
} from "@/lib/reminder";

export default function SettingsPage() {
  const mounted = useMounted();
  const {
    reminderEnabled,
    reminderTime,
    setReminderEnabled,
    setReminderTime,
  } = useSettings();
  const [perm, setPerm] = useState<string>("");

  if (!mounted) {
    return <div className="py-24 text-center text-gray-600">Loading…</div>;
  }

  const currentPerm = perm || notificationPermission();

  async function enableReminders() {
    const result = await requestNotificationPermission();
    setPerm(result);
    if (result === "granted") setReminderEnabled(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Setup</h1>
        <p className="mt-1 text-sm text-gray-400">
          Reminders and installing the app on your phone.
        </p>
      </div>

      {/* Reminder */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold">Daily reminder</h2>
            <p className="text-sm text-gray-400">A nudge if you haven&apos;t finished the day.</p>
          </div>
          <button
            role="switch"
            aria-checked={reminderEnabled}
            onClick={() => {
              if (!reminderEnabled) enableReminders();
              else setReminderEnabled(false);
            }}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              reminderEnabled ? "bg-accent" : "bg-ink-600"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                reminderEnabled ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-ink-800 px-4 py-3">
          <label htmlFor="time" className="text-sm font-semibold text-gray-300">
            Remind me at
          </label>
          <input
            id="time"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-gray-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Notifications:</span>
          <span
            className={`pill ${
              currentPerm === "granted"
                ? "bg-accent/15 text-accent"
                : currentPerm === "denied"
                ? "bg-danger/15 text-danger"
                : "bg-slate-100 text-gray-500"
            }`}
          >
            {currentPerm === "unsupported" ? "not supported" : String(currentPerm)}
          </span>
          {currentPerm !== "granted" && currentPerm !== "unsupported" && (
            <button onClick={enableReminders} className="btn-ghost px-4 py-2 text-sm">
              Enable notifications
            </button>
          )}
          {currentPerm === "granted" && (
            <button
              onClick={() => fireReminder("TOEIC Speaking", "This is a test reminder. Speak now.")}
              className="btn-ghost px-4 py-2 text-sm"
            >
              Send test
            </button>
          )}
        </div>

        <p className="rounded-xl bg-gold/10 px-4 py-3 text-xs leading-relaxed text-gold/90">
          Note: in-app notifications only fire while the app is open in a tab. For a reminder that
          works even when the app is closed, add the daily calendar event below.
        </p>
      </section>

      {/* Calendar reminder */}
      <section className="card space-y-3">
        <h2 className="font-bold">Calendar reminder (works offline)</h2>
        <p className="text-sm text-gray-400">
          Download a daily recurring event (180 days) and open it on your phone. Your calendar app
          will remind you every day at your chosen time — even if the app is closed.
        </p>
        <button onClick={() => downloadICS(reminderTime)} className="btn-primary w-full">
          ⬇ Download daily reminder (.ics)
        </button>
      </section>

      {/* Install */}
      <section className="card space-y-3">
        <h2 className="font-bold">Install on your phone</h2>
        <p className="text-sm text-gray-400">
          Add the app to your home screen so it opens full-screen like a native app and works
          offline.
        </p>
        <div className="space-y-2 text-sm">
          <div className="rounded-xl bg-ink-800 px-4 py-3">
            <p className="font-semibold text-gray-200">Android (Chrome)</p>
            <p className="text-gray-400">Menu ⋮ → “Add to Home screen” / “Install app”.</p>
          </div>
          <div className="rounded-xl bg-ink-800 px-4 py-3">
            <p className="font-semibold text-gray-200">iPhone (Safari)</p>
            <p className="text-gray-400">Share button → “Add to Home Screen”.</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Tip: installing and the offline cache need the site served over HTTPS (or localhost).
        </p>
      </section>
    </div>
  );
}
