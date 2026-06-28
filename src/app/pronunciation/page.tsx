"use client";

import { TaskPageShell } from "@/components/TaskPageShell";
import { SpeakButton } from "@/components/SpeakButton";
import { PronunciationTrainer } from "@/components/PronunciationTrainer";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { pronFocusForDay, practiceItemsForDay } from "@/lib/pronunciation";
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
  const items = practiceItemsForDay(day);

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
            <span key={s} className="pill bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* The main practice: word → pronounce → score */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          Practice — read each word, then get a clarity score
        </p>
        <PronunciationTrainer items={items} day={day} topic={topic.title} fallbackTips={focus.tipKeys} />
      </div>

      {/* Minimal pairs reference */}
      <div className="card">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">
          Minimal pairs — feel the difference
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {focus.minimalPairs.map(([a, b], i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl bg-ink-800 px-4 py-3"
            >
              <span className="text-lg font-semibold">
                {a} <span className="text-gray-500">/</span> {b}
              </span>
              <div className="flex gap-1.5">
                <SpeakButton text={a} label="" />
                <SpeakButton text={b} label="" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </TaskPageShell>
  );
}
