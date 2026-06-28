"use client";

import { useState } from "react";
import { tipsForText, wordIPA } from "@/lib/phonetics";
import { PhonemeTipCard } from "./PhonemeTipCard";

/** Collapsible pronunciation aid for any sentence/paragraph: word-by-word IPA
 *  and mouth-shape guidance for the hard sounds. Used in Read Aloud & Shadowing. */
export function PronunciationHelp({
  text,
  fallbackTips,
}: {
  text: string;
  fallbackTips: string[];
}) {
  const [panel, setPanel] = useState<"ipa" | "mouth" | null>(null);
  const tips = tipsForText(text, fallbackTips);
  const words = text.split(/\s+/).filter(Boolean);

  function toggle(p: "ipa" | "mouth") {
    setPanel((cur) => (cur === p ? null : p));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap gap-2 p-3">
        <button
          onClick={() => toggle("ipa")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            panel === "ipa"
              ? "bg-accent text-white"
              : "border border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
          }`}
        >
          📖 Phiên âm (IPA)
        </button>
        <button
          onClick={() => toggle("mouth")}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            panel === "mouth"
              ? "bg-accent text-white"
              : "border border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
          }`}
        >
          👄 Khẩu hình + video
        </button>
      </div>

      {panel === "ipa" && (
        <div className="border-t border-slate-200 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-gray-500">
            Word-by-word — đọc theo phiên âm
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {words.map((w, i) => {
              const ipa = wordIPA(w);
              return (
                <span key={i} className="inline-flex flex-col items-center leading-tight">
                  <span className="text-base font-semibold text-gray-800">{w}</span>
                  <span className="font-mono text-xs text-accent">{ipa ?? "·"}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {panel === "mouth" && (
        <div className="space-y-3 border-t border-slate-200 p-3">
          <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
            Các âm khó trong câu — khẩu hình & video
          </p>
          {tips.length > 0 ? (
            tips.map((t) => <PhonemeTipCard key={t.key} tip={t} />)
          ) : (
            <p className="text-sm text-gray-500">Không có âm đặc biệt cần lưu ý.</p>
          )}
        </div>
      )}
    </div>
  );
}
