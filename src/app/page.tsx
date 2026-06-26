"use client";

import Link from "next/link";
import { useStore, computeStreak, computeFailedDays, totalCompletedDays, dayCompletionFraction } from "@/lib/store";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { TASKS, TOTAL_DAYS, START_DATE } from "@/lib/constants";
import { dateForDay, isSaturday, prettyDate, daysUntilStart, parseLocalDate } from "@/lib/date";
import { topicForDay, topicRepetition } from "@/lib/topics";
import { pronFocusForDay } from "@/lib/pronunciation";
import { checkpointForDay, monthForDay } from "@/lib/plan";
import { ProgressBar, ProgressRing } from "@/components/ProgressBar";
import { TaskCard } from "@/components/TaskCard";
import { Checklist } from "@/components/Checklist";
import { PressureBanner } from "@/components/PressureBanner";

export default function Dashboard() {
  const mounted = useMounted();
  const day = useCurrentDay();

  const days = useStore((s) => s.days);
  const counts = useStore((s) => s.recordingCounts);
  const getDay = useStore((s) => s.getDay);

  if (!mounted) {
    return <div className="py-24 text-center text-gray-600">Loading…</div>;
  }

  // ----- Pre-start screen -----
  if (day === 0) {
    const left = daysUntilStart();
    return (
      <div className="card rise mt-6 overflow-hidden !bg-hero-glow text-center ring-1 ring-accent/10">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent/80">
          The system begins
        </p>
        <p className="mt-3 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-7xl font-black text-transparent">
          {left}
        </p>
        <p className="text-gray-400">{left === 1 ? "day" : "days"} until Day 1</p>
        <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-gray-500">
          Day 1 is {prettyDate(parseLocalDate(START_DATE))}. Prepare your microphone.
          There will be no flexibility.
        </p>
      </div>
    );
  }

  const today = getDay(day);
  const topic = topicForDay(day);
  const pron = pronFocusForDay(day);
  const checkpoint = checkpointForDay(day);
  const saturday = isSaturday(day);
  const fraction = dayCompletionFraction(today);
  const streak = computeStreak(days);
  const failed = computeFailedDays(days);
  const completedDays = totalCompletedDays(days);
  const overall = completedDays / TOTAL_DAYS;

  const totalRecordings = Object.values(counts).reduce(
    (sum, dayCounts) => sum + Object.values(dayCounts).reduce((a, b) => a + (b ?? 0), 0),
    0
  );
  const hasRecordingToday = Object.values(counts[day] ?? {}).some((c) => (c ?? 0) > 0);

  const bannerKind = today.completed
    ? "success"
    : failed.length > 0
    ? "fail"
    : fraction > 0
    ? "incomplete"
    : "neutral";

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="card rise overflow-hidden !bg-hero-glow ring-1 ring-accent/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent/80">
              Today&apos;s Mission
            </p>
            <h1 className="mt-1 text-4xl font-black tracking-tight">
              Day {day}
              <span className="text-lg font-bold text-gray-600"> / {TOTAL_DAYS}</span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">{prettyDate(dateForDay(day))}</p>
            {saturday && (
              <span className="pill mt-3 bg-gold/15 text-gold ring-1 ring-gold/30">
                ★ Full Training Day
              </span>
            )}
          </div>
          <ProgressRing value={fraction} size={104} stroke={9}>
            <div>
              <p className="text-2xl font-black">{Math.round(fraction * 100)}%</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500">today</p>
            </div>
          </ProgressRing>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-gray-500">
            <span>Overall progress</span>
            <span>{completedDays} / {TOTAL_DAYS} days</span>
          </div>
          <ProgressBar value={overall} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Streak" value={`${streak}🔥`} />
          <Stat label="Recordings" value={String(totalRecordings)} />
          <Stat label="Month" value={`${monthForDay(day)}/6`} />
        </div>
      </section>

      {bannerKind !== "neutral" && (
        <PressureBanner kind={bannerKind} failedCount={failed.length} />
      )}

      {/* Today's assignment */}
      <section className="grid grid-cols-2 gap-3">
        <InfoCard label="Topic" value={topic.title} sub={`Repeat #${topicRepetition(day)} · loops every 30 days`} />
        <InfoCard label="Pronunciation focus" value={pron.title} sub={pron.sounds.join(" · ")} />
        <InfoCard label="Speaking target" value={checkpoint.target} sub={`Month ${checkpoint.month}: ${checkpoint.goal}`} />
        <InfoCard label="Template" value={day % 3 === 0 ? "Opinion" : "Daily Life"} sub="Follow it exactly" />
      </section>

      {/* The 4 tasks */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          4 tasks · 120 minutes · no skipping
        </h2>
        {TASKS.map((task, i) => (
          <TaskCard key={task.type} task={task} index={i} status={today.tasks[task.type]} />
        ))}
      </section>

      {/* Checklist */}
      <section className="card">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
          Daily Checklist
        </h2>
        <Checklist day={today} hasRecording={hasRecordingToday} />
        <div className="mt-4">
          {today.completed ? (
            <p className="rounded-xl bg-accent-soft px-4 py-3 text-center font-bold text-accent">
              ✅ SUCCESS DAY — all tasks done.
            </p>
          ) : (
            <p className="rounded-xl bg-ink-800 px-4 py-3 text-center text-sm text-gray-400">
              {4 - Object.values(today.tasks).filter((t) => t === "done").length} task(s) left.
              The day is only a SUCCESS when every box is checked.
            </p>
          )}
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-gray-600">
        <Link href="/progress" className="underline hover:text-gray-400">
          See full progress →
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] py-3">
      <p className="text-xl font-black">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-gray-500">{label}</p>
    </div>
  );
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-850/70 p-4 transition hover:border-white/[0.12]">
      <span className="absolute inset-y-0 left-0 w-0.5 bg-accent/40" />
      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">{label}</p>
      <p className="mt-1 font-bold leading-tight">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{sub}</p>
    </div>
  );
}
