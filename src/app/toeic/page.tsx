"use client";

import { useState } from "react";
import { TaskPageShell } from "@/components/TaskPageShell";
import { Recorder } from "@/components/Recorder";
import { HintList } from "@/components/TemplateCard";
import { SpeakButton } from "@/components/SpeakButton";
import { StuckHelp } from "@/components/StuckHelp";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import {
  toeicForDay,
  pictureUrl,
  PICTURE_HINTS,
  ANSWER_HINTS,
  OPINION_HINTS,
} from "@/lib/toeic-data";
import {
  PICTURE_SAMPLE,
  questionSampleForDay,
  opinionSampleForDay,
} from "@/lib/samples";

const SUBTASKS = ["task1", "task2", "task3", "task4"];

function fallbackPicture(label: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='520'><rect width='100%' height='100%' fill='#e8eef5'/><text x='50%' y='50%' fill='#64788d' font-family='sans-serif' font-size='28' text-anchor='middle'>Picture: ${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ToeicPage() {
  const mounted = useMounted();
  const day = useCurrentDay();
  const [done, setDone] = useState<Set<string>>(new Set());

  if (!mounted || day === 0) {
    return (
      <TaskPageShell taskType="toeic" title="TOEIC Practice" minutes={30} canComplete={false}>
        <div />
      </TaskPageShell>
    );
  }

  const data = toeicForDay(day);
  const canComplete = SUBTASKS.every((s) => done.has(s));

  function mark(id: string) {
    setDone((prev) => new Set(prev).add(id));
  }

  function Badge({ id }: { id: string }) {
    return done.has(id) ? (
      <span className="pill bg-accent-soft text-accent">Recorded ✓</span>
    ) : (
      <span className="pill bg-gold/20 text-gold">Record required</span>
    );
  }

  return (
    <TaskPageShell
      taskType="toeic"
      title="TOEIC Practice"
      subtitle="4 tasks. Record every one. No skipping."
      minutes={30}
      canComplete={canComplete}
      blockedHint="Record all 4 tasks (Read, Describe, Answer, Opinion) to complete."
    >
      {/* Task 1 — Read Aloud */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Task 1 — Read Aloud</h3>
          <Badge id="task1" />
        </div>
        <p className="rounded-xl bg-ink-800 p-4 text-lg leading-relaxed">{data.readAloud}</p>
        <SpeakButton text={data.readAloud} label="Hear model" rate={0.95} />
        <Recorder
          day={day}
          taskType="toeic"
          topic="Read Aloud"
          subTask="task1"
          onSaved={() => mark("task1")}
          score={{ mode: "read", target: data.readAloud }}
        />
      </section>

      {/* Task 2 — Describe a Picture */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Task 2 — Describe a Picture</h3>
          <Badge id="task2" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pictureUrl(data.picture.seed)}
          alt={data.picture.label}
          className="aspect-[8/5] w-full rounded-xl bg-ink-800 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackPicture(data.picture.label);
          }}
        />
        <HintList title="Use these openers" lines={PICTURE_HINTS} />
        <StuckHelp lines={PICTURE_SAMPLE} />
        <Recorder
          day={day}
          taskType="toeic"
          topic="Describe Picture"
          subTask="task2"
          onSaved={() => mark("task2")}
          score={{ mode: "template", templateLines: PICTURE_HINTS, targetSentences: 3 }}
        />
      </section>

      {/* Task 3 — Answer a Question */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Task 3 — Answer a Question</h3>
          <Badge id="task3" />
        </div>
        <p className="rounded-xl bg-ink-800 p-4 text-lg font-semibold">{data.question}</p>
        <HintList title="Hints" lines={ANSWER_HINTS} />
        <StuckHelp lines={[questionSampleForDay(day)]} />
        <Recorder
          day={day}
          taskType="toeic"
          topic="Answer Question"
          subTask="task3"
          onSaved={() => mark("task3")}
          score={{ mode: "template", templateLines: ANSWER_HINTS, targetSentences: 3 }}
        />
      </section>

      {/* Task 4 — Express an Opinion */}
      <section className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Task 4 — Express an Opinion</h3>
          <Badge id="task4" />
        </div>
        <p className="rounded-xl bg-ink-800 p-4 text-lg font-semibold">{data.opinion}</p>
        <HintList title="Template" lines={OPINION_HINTS} />
        <StuckHelp lines={[opinionSampleForDay(day)]} />
        <Recorder
          day={day}
          taskType="toeic"
          topic="Opinion"
          subTask="task4"
          onSaved={() => mark("task4")}
          score={{ mode: "template", templateLines: OPINION_HINTS, targetSentences: 3 }}
        />
      </section>
    </TaskPageShell>
  );
}
