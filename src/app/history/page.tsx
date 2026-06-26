"use client";

import { RecordingList } from "@/components/RecordingList";
import { useMounted } from "@/lib/hooks";

export default function HistoryPage() {
  const mounted = useMounted();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Recording History</h1>
        <p className="mt-1 text-sm text-gray-400">
          Every clip you&apos;ve saved, newest first. Stored on this device only.
        </p>
      </div>

      {mounted ? (
        <RecordingList emptyHint="No recordings yet. Go speak." />
      ) : (
        <p className="text-sm text-gray-600">Loading…</p>
      )}
    </div>
  );
}
