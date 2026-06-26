"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// User settings (reminder preferences). Persisted separately from progress.
// ---------------------------------------------------------------------------

interface SettingsState {
  reminderEnabled: boolean;
  reminderTime: string; // "HH:MM" 24h
  /** yyyy-mm-dd of the last day we fired a reminder, to avoid duplicates. */
  lastNotified: string;
  setReminderEnabled: (v: boolean) => void;
  setReminderTime: (t: string) => void;
  markNotified: (date: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      reminderEnabled: false,
      reminderTime: "20:00",
      lastNotified: "",
      setReminderEnabled: (v) => set({ reminderEnabled: v }),
      setReminderTime: (t) => set({ reminderTime: t }),
      markNotified: (date) => set({ lastNotified: date }),
    }),
    { name: "toeic-settings" }
  )
);
