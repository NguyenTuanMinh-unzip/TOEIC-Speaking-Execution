"use client";

import { useStore, computeStreak, computeFailedDays, totalCompletedDays } from "@/lib/store";
import { useCurrentDay, useMounted } from "@/lib/hooks";
import { TOTAL_DAYS } from "@/lib/constants";
import { CHECKPOINTS, monthForDay } from "@/lib/plan";
import { ProgressBar } from "@/components/ProgressBar";

type CellState = "done" | "failed" | "today" | "future";

export default function ProgressPage() {
  const mounted = useMounted();
  const day = useCurrentDay();
  const days = useStore((s) => s.days);
  const counts = useStore((s) => s.recordingCounts);

  if (!mounted) {
    return <div className="py-24 text-center text-gray-600">Loading…</div>;
  }

  const streak = computeStreak(days);
  const failed = computeFailedDays(days);
  const completed = totalCompletedDays(days);
  const totalRecordings = Object.values(counts).reduce(
    (sum, dc) => sum + Object.values(dc).reduce((a, b) => a + (b ?? 0), 0),
    0
  );
  const currentMonth = day ? monthForDay(day) : 0;

  function cellState(d: number): CellState {
    if (days[d]?.completed) return "done";
    if (day && d === day) return "today";
    if (day && d < day) return "failed";
    return "future";
  }

  const cellCls: Record<CellState, string> = {
    done: "bg-accent",
    failed: "bg-danger/70",
    today: "bg-gold ring-2 ring-gold/40",
    future: "bg-ink-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black tracking-tight">Progress</h1>

      {/* Top stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigStat label="Days done" value={`${completed}`} sub={`of ${TOTAL_DAYS}`} />
        <BigStat label="Streak" value={`${streak}🔥`} sub="consecutive" />
        <BigStat label="Recordings" value={`${totalRecordings}`} sub="total saved" />
        <BigStat label="Failed days" value={`${failed.length}`} sub="redo these" tone={failed.length ? "danger" : "default"} />
      </section>

      <section className="card">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-gray-400">Overall completion</span>
          <span className="font-bold">{Math.round((completed / TOTAL_DAYS) * 100)}%</span>
        </div>
        <ProgressBar value={completed / TOTAL_DAYS} />
      </section>

      {/* Monthly checkpoints */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Monthly Checkpoints
        </h2>
        {CHECKPOINTS.map((cp) => {
          const monthDays = Object.values(days).filter(
            (dd) => dd.completed && dd.day >= cp.dayStart && dd.day <= cp.dayEnd
          ).length;
          const span = cp.dayEnd - cp.dayStart + 1;
          const active = currentMonth === cp.month;
          const passed = day > cp.dayEnd;
          return (
            <div
              key={cp.month}
              className={`card ${active ? "border-accent/50" : ""}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-bold">
                    Month {cp.month}
                    {active && <span className="ml-2 pill bg-accent-soft text-accent">current</span>}
                    {passed && <span className="ml-2 pill bg-ink-700 text-gray-400">past</span>}
                  </p>
                  <p className="text-sm text-gray-400">{cp.goal}</p>
                </div>
                <span className="text-sm font-bold text-gray-500">
                  {monthDays}/{span}
                </span>
              </div>
              <ProgressBar value={monthDays / span} tone={active ? "accent" : "gold"} />
            </div>
          );
        })}
      </section>

      {/* 180-day grid */}
      <section className="card">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
            180-Day Map
          </h2>
          <div className="flex gap-3 text-[10px] text-gray-500">
            <Legend cls="bg-accent" label="done" />
            <Legend cls="bg-danger/70" label="failed" />
            <Legend cls="bg-gold" label="today" />
            <Legend cls="bg-ink-700" label="future" />
          </div>
        </div>
        <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
            const st = cellState(d);
            return (
              <div
                key={d}
                title={`Day ${d}: ${st}`}
                className={`aspect-square rounded-[3px] ${cellCls[st]}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function BigStat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="card text-center">
      <p className={`text-3xl font-black ${tone === "danger" ? "text-danger" : ""}`}>{value}</p>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-[10px] uppercase tracking-widest text-gray-600">{sub}</p>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
      {label}
    </span>
  );
}
