"use client";

import type { PhonemeTip } from "@/lib/phonetics";
import { videoUrl } from "@/lib/phonetics";
import { MouthDiagram } from "./MouthDiagram";
import { SpeakButton } from "./SpeakButton";

/** One sound's guidance: symbol, Vietnamese how-to, mouth diagram, audio
 *  example, and a link to a how-to video. */
export function PhonemeTipCard({ tip }: { tip: PhonemeTip }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-ink-800 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <span className="font-mono text-lg font-black text-accent">{tip.symbol}</span>
          <span className="text-sm font-semibold text-gray-700">{tip.label}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <SpeakButton text={tip.example} label="Ví dụ" rate={0.8} />
          <a
            href={videoUrl(tip)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-xs font-semibold text-danger hover:bg-danger/15"
          >
            ▶ Video
          </a>
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="shrink-0">
          <MouthDiagram tip={tip} />
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{tip.howVi}</p>
      </div>
    </div>
  );
}
