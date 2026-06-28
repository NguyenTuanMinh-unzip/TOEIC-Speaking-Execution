"use client";

import type { PhonemeTip } from "@/lib/phonetics";

// Schematic FRONT-view of the mouth ("khẩu hình") for each sound. Pure SVG,
// fully offline. The key articulator is highlighted in the accent colour.

const LIP = "#e08a98";
const LIP_DARK = "#c76b7b";
const TEETH = "#ffffff";
const TEETH_EDGE = "#cdd8e6";
const CAVITY = "#5e2530";
const TONGUE = "#ef9aab";
const ACCENT = "#0d8be0";

function Voiced() {
  return (
    <g>
      <text x="80" y="113" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">
        rung ✓ (voiced)
      </text>
    </g>
  );
}

export function MouthDiagram({ tip }: { tip: PhonemeTip }) {
  const v = tip.mouth;
  return (
    <svg viewBox="0 0 160 120" className="h-auto w-full max-w-[190px]" role="img" aria-label={`Mouth shape for ${tip.label}`}>
      <rect x="2" y="2" width="156" height="116" rx="16" fill="#f1f6fc" stroke="#dde8f3" />

      {v === "smile" && (
        <>
          <path d="M28 62 Q80 46 132 62 Q80 88 28 62 Z" fill={LIP} />
          <path d="M44 62 Q80 54 116 62 Q80 72 44 62 Z" fill={TEETH} stroke={TEETH_EDGE} />
          <path d="M28 62 Q80 46 132 62" fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" />
          <text x="80" y="103" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">môi mỉm cười, kéo ngang</text>
        </>
      )}

      {v === "relaxed" && (
        <>
          <ellipse cx="80" cy="62" rx="34" ry="17" fill={LIP} />
          <ellipse cx="80" cy="62" rx="23" ry="9" fill={CAVITY} />
          <ellipse cx="80" cy="62" rx="34" ry="17" fill="none" stroke={ACCENT} strokeWidth="2.5" />
          <text x="80" y="103" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">miệng thả lỏng, hé nhẹ</text>
        </>
      )}

      {v === "round" && (
        <>
          <ellipse cx="80" cy="60" rx="24" ry="30" fill={LIP} />
          <ellipse cx="80" cy="60" rx="12" ry="17" fill={CAVITY} />
          <ellipse cx="80" cy="60" rx="24" ry="30" fill="none" stroke={ACCENT} strokeWidth="3" />
          <text x="80" y="105" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">môi tròn, đẩy ra trước</text>
        </>
      )}

      {v === "tongue-teeth" && (
        <>
          <ellipse cx="80" cy="60" rx="38" ry="28" fill={CAVITY} />
          {/* upper teeth */}
          <rect x="50" y="36" width="60" height="13" rx="3" fill={TEETH} stroke={TEETH_EDGE} />
          <line x1="65" y1="36" x2="65" y2="49" stroke={TEETH_EDGE} />
          <line x1="80" y1="36" x2="80" y2="49" stroke={TEETH_EDGE} />
          <line x1="95" y1="36" x2="95" y2="49" stroke={TEETH_EDGE} />
          {/* lower teeth */}
          <rect x="50" y="71" width="60" height="13" rx="3" fill={TEETH} stroke={TEETH_EDGE} />
          {/* tongue tip between teeth */}
          <ellipse cx="80" cy="60" rx="16" ry="9" fill={TONGUE} stroke={ACCENT} strokeWidth="2.5" />
          <text x="80" y="105" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">lưỡi giữa hai răng</text>
          {tip.voiced && <Voiced />}
        </>
      )}

      {v === "lip-teeth" && (
        <>
          {/* upper teeth */}
          <rect x="46" y="40" width="68" height="15" rx="3" fill={TEETH} stroke={TEETH_EDGE} />
          <line x1="63" y1="40" x2="63" y2="55" stroke={TEETH_EDGE} />
          <line x1="80" y1="40" x2="80" y2="55" stroke={TEETH_EDGE} />
          <line x1="97" y1="40" x2="97" y2="55" stroke={TEETH_EDGE} />
          {/* lower lip pressed up onto the teeth */}
          <path d="M44 70 Q80 50 116 70 Q80 84 44 70 Z" fill={LIP} stroke={ACCENT} strokeWidth="2.5" />
          <text x="80" y="103" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">răng trên chạm môi dưới</text>
          {tip.voiced && <Voiced />}
        </>
      )}

      {v === "neutral" && (
        <>
          <path d="M40 62 Q80 56 120 62" fill="none" stroke={LIP_DARK} strokeWidth="4" strokeLinecap="round" />
          <path d="M40 62 Q80 72 120 62" fill="none" stroke={LIP} strokeWidth="6" strokeLinecap="round" />
          <text x="80" y="100" textAnchor="middle" fontSize="9" fill={ACCENT} fontWeight="700">bật âm rõ ràng</text>
        </>
      )}
    </svg>
  );
}
