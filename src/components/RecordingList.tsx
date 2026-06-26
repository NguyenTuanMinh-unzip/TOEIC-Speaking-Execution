"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteRecording,
  getAllRecordings,
  getRecordingsByDay,
} from "@/lib/audio-db";
import type { Recording } from "@/lib/types";
import { useStore } from "@/lib/store";

const TASK_LABEL: Record<string, string> = {
  pronunciation: "Pronunciation",
  shadowing: "Shadowing",
  speaking: "Speaking",
  toeic: "TOEIC",
};

function fmtDur(ms: number): string {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecordingList({
  day,
  refreshKey = 0,
  emptyHint = "No recordings yet.",
}: {
  /** If provided, show only this day's recordings; otherwise show all. */
  day?: number;
  /** Bump to force a reload (e.g. after a new recording is saved). */
  refreshKey?: number;
  emptyHint?: string;
}) {
  const [recs, setRecs] = useState<Recording[]>([]);
  const [urls, setUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const refreshCounts = useStore((s) => s.refreshCounts);

  const load = useCallback(async () => {
    setLoading(true);
    const data = day != null ? await getRecordingsByDay(day) : await getAllRecordings();
    setRecs(data);
    const next: Record<number, string> = {};
    for (const r of data) next[r.id] = URL.createObjectURL(r.blob);
    setUrls((prev) => {
      Object.values(prev).forEach((u) => URL.revokeObjectURL(u));
      return next;
    });
    setLoading(false);
  }, [day]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, refreshKey]);

  useEffect(() => {
    return () => {
      Object.values(urls).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: number) {
    await deleteRecording(id);
    await refreshCounts();
    await load();
  }

  if (loading) return <p className="text-sm text-gray-600">Loading recordings…</p>;
  if (recs.length === 0) return <p className="text-sm text-gray-600">{emptyHint}</p>;

  return (
    <ul className="space-y-3">
      {recs.map((r) => (
        <li key={r.id} className="rounded-2xl border border-ink-700 bg-ink-850 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="pill bg-ink-700 text-gray-300">Day {r.day}</span>
            <span className="pill bg-accent-soft text-accent">
              {TASK_LABEL[r.taskType] ?? r.taskType}
              {r.subTask ? ` · ${r.subTask}` : ""}
            </span>
            <span className="text-gray-500">{r.topic}</span>
            <span className="ml-auto text-gray-600">
              {fmtTime(r.timestamp)} · {fmtDur(r.durationMs)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <audio controls src={urls[r.id]} className="w-full" />
            <button
              onClick={() => handleDelete(r.id)}
              className="shrink-0 rounded-lg border border-ink-600 px-3 py-2 text-xs font-semibold text-gray-400 hover:border-danger hover:text-danger"
              aria-label="Delete recording"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
