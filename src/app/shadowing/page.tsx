"use client";

import { useState } from "react";
import { TaskPageShell } from "@/components/TaskPageShell";
import { ShadowingPlayer } from "@/components/ShadowingPlayer";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { shadowForDay } from "@/lib/shadowing-data";

export default function ShadowingPage() {
  const mounted = useMounted();
  const day = useCurrentDay();
  const [allSeen, setAllSeen] = useState(false);

  if (!mounted || day === 0) {
    return (
      <TaskPageShell taskType="shadowing" title="Shadowing" minutes={30} canComplete={false}>
        <div />
      </TaskPageShell>
    );
  }

  const script = shadowForDay(day);

  return (
    <TaskPageShell
      taskType="shadowing"
      title="Shadowing"
      subtitle="Listen → repeat → match. 5× each sentence."
      minutes={30}
      canComplete={allSeen}
      blockedHint="Go through every sentence before marking complete."
    >
      <ShadowingPlayer script={script} day={day} onAllSeen={() => setAllSeen(true)} />
    </TaskPageShell>
  );
}
