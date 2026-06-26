"use client";

import Link from "next/link";
import type { TaskDef, TaskStatus } from "@/lib/types";

const STATUS_META: Record<TaskStatus, { label: string; cls: string }> = {
  not_started: { label: "Not started", cls: "bg-white/[0.04] text-gray-400 ring-1 ring-inset ring-white/[0.06]" },
  in_progress: { label: "In progress", cls: "bg-gold/15 text-gold ring-1 ring-inset ring-gold/25" },
  done: { label: "Done", cls: "bg-accent/15 text-accent ring-1 ring-inset ring-accent/25" },
};

export function TaskCard({
  task,
  status,
  index,
  locked,
}: {
  task: TaskDef;
  status: TaskStatus;
  index: number;
  locked?: boolean;
}) {
  const meta = STATUS_META[status];
  const done = status === "done";

  return (
    <div
      className={`card flex items-center gap-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.12] ${
        done ? "!border-accent/25" : ""
      }`}
    >
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-black transition ${
          done
            ? "bg-gradient-to-br from-accent to-accent-600 text-ink-950 shadow-glow-sm"
            : "bg-ink-700 text-gray-400 ring-1 ring-inset ring-white/[0.05]"
        }`}
      >
        {done ? "✓" : index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-bold">{task.label}</p>
          <span className="text-xs text-gray-600">{task.minutes}m</span>
        </div>
        <p className="truncate text-sm text-gray-500">{task.blurb}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`pill ${meta.cls}`}>{meta.label}</span>
        <Link href={task.href} className={done ? "btn-ghost px-4 py-2 text-sm" : "btn-primary px-4 py-2 text-sm"}>
          {done ? "Review" : status === "in_progress" ? "Continue" : "Start"}
        </Link>
      </div>
    </div>
  );
}
