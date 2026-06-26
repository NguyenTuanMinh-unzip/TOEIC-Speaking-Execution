"use client";

import type { ScoreResult, Tone } from "@/lib/scoring";

const toneText: Record<Tone, string> = {
  accent: "text-accent",
  gold: "text-gold",
  danger: "text-danger",
};
const toneRing: Record<Tone, string> = {
  accent: "ring-accent/30",
  gold: "ring-gold/30",
  danger: "ring-danger/30",
};
const toneBg: Record<Tone, string> = {
  accent: "bg-accent/10",
  gold: "bg-gold/10",
  danger: "bg-danger/10",
};

export function ScoreCard({ result }: { result: ScoreResult }) {
  const pct = result.kind === "read" ? result.accuracy : result.score;
  const g = result.grade;

  return (
    <div className={`card rise space-y-4 ring-1 ${toneRing[g.tone]}`}>
      {/* Headline score */}
      <div className="flex items-center gap-4">
        <div
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${toneBg[g.tone]} ${toneText[g.tone]}`}
        >
          <span className="text-2xl font-black">{pct}</span>
        </div>
        <div>
          <p className={`text-lg font-black ${toneText[g.tone]}`}>
            {g.emoji} {g.label}
          </p>
          <p className="text-sm text-gray-400">
            {result.kind === "read"
              ? "Pronunciation clarity (words the AI heard correctly)"
              : "Structure + length score"}
          </p>
        </div>
      </div>

      {result.kind === "read" ? (
        <ReadDetail result={result} />
      ) : (
        <TemplateDetail result={result} />
      )}

      {/* What the recognizer heard */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-gray-500">
          The AI heard
        </p>
        <p className="text-sm italic text-gray-300">
          {result.transcript ? `“${result.transcript}”` : "— nothing detected —"}
        </p>
      </div>
    </div>
  );
}

function ReadDetail({ result }: { result: Extract<ScoreResult, { kind: "read" }> }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-500">
          Target — green = correct, red = missed
        </p>
        <p className="text-lg leading-relaxed">
          {result.targetWords.map((w, i) => (
            <span
              key={i}
              className={
                result.matched[i]
                  ? "text-accent"
                  : "text-danger underline decoration-danger/40 decoration-2 underline-offset-2"
              }
            >
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
      {result.missed.length > 0 && (
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-danger">Practice these:</span>{" "}
          {result.missed.slice(0, 12).join(", ")}
        </p>
      )}
    </div>
  );
}

function TemplateDetail({
  result,
}: {
  result: Extract<ScoreResult, { kind: "template" }>;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Mini label="Words" value={String(result.wordCount)} />
        <Mini label="Sentences" value={`${result.sentencesEstimate}/${result.targetSentences}`} />
        <Mini label="Pace" value={`${result.wpm} wpm`} />
      </div>
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-500">
          Template lines used ({result.usedMarkers.length}/
          {result.usedMarkers.length + result.missingMarkers.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {result.usedMarkers.map((m) => (
            <span key={m} className="pill bg-accent/15 text-accent ring-1 ring-inset ring-accent/25">
              ✓ {m}
            </span>
          ))}
          {result.missingMarkers.map((m) => (
            <span key={m} className="pill bg-slate-100 text-gray-500 ring-1 ring-inset ring-slate-200">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 py-2">
      <p className="text-base font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500">{label}</p>
    </div>
  );
}
