"use client";

import { TaskPageShell } from "@/components/TaskPageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { Recorder } from "@/components/Recorder";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { pronFocusForDay } from "@/lib/pronunciation";
import { topicForDay } from "@/lib/topics";

export default function PronunciationPage() {
  const mounted = useMounted();
  const day = useCurrentDay();

  if (!mounted || day === 0) {
    return (
      <TaskPageShell taskType="pronunciation" title="Pronunciation" minutes={20} canComplete={false}>
        <div />
      </TaskPageShell>
    );
  }

  const focus = pronFocusForDay(day);
  const topic = topicForDay(day);

  return (
    <TaskPageShell
      taskType="pronunciation"
      title="Pronunciation"
      subtitle={`Today's focus: ${focus.title}`}
      minutes={20}
      canComplete={true}
    >
      <div className="card">
        <p className="text-xs uppercase tracking-widest text-gray-500">Target sounds</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {focus.sounds.map((s) => (
            <span key={s} className="pill bg-accent-soft text-accent">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
          Minimal pairs — say each pair 5 times
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {focus.minimalPairs.map(([a, b], i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl bg-ink-800 px-4 py-3"
            >
              <span className="text-lg font-semibold">
                {a} <span className="text-gray-600">/</span> {b}
              </span>
              <div className="flex gap-1.5">
                <SpeakButton text={a} label="" />
                <SpeakButton text={b} label="" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
          Drill sentences — repeat after the voice
        </p>
        <ul className="space-y-2">
          {focus.drill.map((line, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 rounded-xl bg-ink-800 px-4 py-3"
            >
              <span className="text-lg font-medium">{line}</span>
              <SpeakButton text={line} rate={0.85} />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
          Optional: record yourself drilling (recommended)
        </p>
        <Recorder day={day} taskType="pronunciation" topic={topic.title} label="Pronunciation drill" />
      </div>
    </TaskPageShell>
  );
}
