"use client";

import { useState } from "react";
import { TaskPageShell } from "@/components/TaskPageShell";
import { TemplateCard } from "@/components/TemplateCard";
import { Recorder } from "@/components/Recorder";
import { RecordingList } from "@/components/RecordingList";
import { StuckHelp } from "@/components/StuckHelp";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { useStore } from "@/lib/store";
import { topicForDay, topicRepetition } from "@/lib/topics";
import { templateForDay } from "@/lib/templates";
import { checkpointForDay, SATURDAY_TASKS, targetSentencesForDay } from "@/lib/plan";
import { topicSampleForDay } from "@/lib/samples";
import { isSaturday } from "@/lib/date";

const SAT_SAMPLES: Record<string, string[]> = {
  intro: [
    "Hello, my name is ... and I am ... years old.",
    "I live in ... with my family.",
    "I work as a ... and I usually start at eight.",
    "In my free time, I like reading and listening to music.",
    "I am learning English so I can speak more confidently.",
  ],
  work: [
    "I usually work in an office during the week.",
    "I often start my day by checking email.",
    "Sometimes I have meetings in the afternoon.",
    "For example, yesterday I finished a report.",
    "I like my job because I learn new things.",
  ],
  life: [
    "I usually wake up early and have breakfast.",
    "I often exercise or take a short walk.",
    "Sometimes I meet my friends on weekends.",
    "For example, last weekend I watched a movie.",
    "I like my daily life because it is simple and calm.",
  ],
};

export default function SpeakingPage() {
  const mounted = useMounted();
  const day = useCurrentDay();
  const speakingCount = useStore((s) => (day ? s.recordingCounts[day]?.speaking ?? 0 : 0));

  const [satDone, setSatDone] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState(0);

  if (!mounted || day === 0) {
    return (
      <TaskPageShell taskType="speaking" title="Guided Speaking" minutes={40} canComplete={false}>
        <div />
      </TaskPageShell>
    );
  }

  const topic = topicForDay(day);
  const template = templateForDay(day);
  const checkpoint = checkpointForDay(day);
  const saturday = isSaturday(day);

  // Saturday requires intro + work + life recordings; normal day requires >=1.
  const requiredSat = ["intro", "work", "life"];
  const canComplete = saturday
    ? requiredSat.every((id) => satDone.has(id))
    : speakingCount >= 1;

  function markSat(id: string) {
    setSatDone((prev) => new Set(prev).add(id));
    setRefreshKey((k) => k + 1);
  }

  return (
    <TaskPageShell
      taskType="speaking"
      title={saturday ? "Full Speaking Mode" : "Guided Speaking"}
      subtitle={
        saturday
          ? "★ Saturday Full Training Day — record every block."
          : `Topic: ${topic.title} · Repeat #${topicRepetition(day)}`
      }
      minutes={40}
      canComplete={canComplete}
      blockedHint={
        saturday
          ? "Record all three blocks (intro, work, daily life) to complete."
          : "You must record at least one response to complete speaking."
      }
    >
      <div className="rounded-2xl border border-accent/30 bg-accent-soft/40 px-5 py-4">
        <p className="text-xs uppercase tracking-widest text-accent">Today&apos;s target</p>
        <p className="text-lg font-bold">{checkpoint.target}</p>
        <p className="text-sm text-gray-400">Month {checkpoint.month}: {checkpoint.goal}</p>
      </div>

      {saturday ? (
        // ---------------- SATURDAY: FULL SPEAKING MODE ----------------
        <div className="space-y-5">
          {SATURDAY_TASKS.filter((t) => t.id !== "mock").map((t) => (
            <div key={t.id} className="card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{t.label}</h3>
                {satDone.has(t.id) ? (
                  <span className="pill bg-accent-soft text-accent">Recorded ✓</span>
                ) : (
                  <span className="pill bg-gold/20 text-gold">
                    {t.minSeconds >= 60 ? `${Math.round(t.minSeconds / 60)} min` : "speak"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{t.prompt}</p>
              <StuckHelp lines={SAT_SAMPLES[t.id] ?? []} />
              <Recorder
                day={day}
                taskType="speaking"
                topic={`Saturday · ${t.label}`}
                subTask={t.id}
                onSaved={() => markSat(t.id)}
              />
            </div>
          ))}
          <div className="card">
            <p className="text-sm text-gray-400">
              Then go to <span className="font-semibold text-gray-200">TOEIC Practice</span> and do a
              full mock (all 4 tasks back to back).
            </p>
          </div>
        </div>
      ) : (
        // ---------------- NORMAL DAY: GUIDED SPEAKING ----------------
        <div className="space-y-5">
          <div className="card">
            <p className="text-xs uppercase tracking-widest text-gray-500">Speak about</p>
            <p className="text-xl font-bold">{topic.title}</p>
            <ul className="mt-2 space-y-1 text-gray-400">
              {topic.prompts.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>

          <TemplateCard template={template} accent />

          <StuckHelp lines={topicSampleForDay(day)} />

          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-gray-500">
              Record yourself speaking the template (required)
            </p>
            <Recorder
              day={day}
              taskType="speaking"
              topic={topic.title}
              subTask={template.id}
              onSaved={() => setRefreshKey((k) => k + 1)}
              score={{
                mode: "template",
                templateLines: template.lines,
                targetSentences: targetSentencesForDay(day),
              }}
            />
          </div>
        </div>
      )}

      <div className="card">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">Today&apos;s recordings</p>
        <RecordingList day={day} refreshKey={refreshKey} emptyHint="Record your first response above." />
      </div>
    </TaskPageShell>
  );
}
