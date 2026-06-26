"use client";

import { PRESSURE } from "@/lib/constants";

type Kind = "success" | "fail" | "incomplete" | "neutral";

export function PressureBanner({
  kind,
  failedCount = 0,
}: {
  kind: Kind;
  failedCount?: number;
}) {
  if (kind === "success") {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent-soft px-5 py-4 text-center">
        <p className="text-lg font-black text-accent">{PRESSURE.success}</p>
      </div>
    );
  }
  if (kind === "fail") {
    return (
      <div className="rounded-2xl border border-danger/50 bg-danger-soft px-5 py-4 text-center">
        <p className="text-lg font-black text-danger">{PRESSURE.fail}</p>
        {failedCount > 0 && (
          <p className="mt-1 text-sm text-danger/80">
            {failedCount} unfinished {failedCount === 1 ? "day" : "days"}. Redo them. The streak is broken until you do.
          </p>
        )}
      </div>
    );
  }
  if (kind === "incomplete") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-center">
        <p className="font-bold text-gold">{PRESSURE.incomplete}</p>
      </div>
    );
  }
  return null;
}
