// ---------------------------------------------------------------------------
// Phonetic data: IPA transcriptions + per-phoneme "how to pronounce" guidance
// (mouth shape, in Vietnamese) + a video search link. IPA for arbitrary fixed
// content comes from a build-time generated CMUdict map (ipa-dict.generated).
// ---------------------------------------------------------------------------

import { IPA_DICT } from "./ipa-dict.generated";

export interface PhonemeTip {
  key: string;
  symbol: string; // e.g. "/ʃ/"
  label: string; // short English label
  howVi: string; // mouth-shape guidance in Vietnamese
  example: string; // an example word to hear
  /** Mouth-diagram variant. */
  mouth: "smile" | "relaxed" | "round" | "tongue-teeth" | "lip-teeth" | "neutral";
  voiced?: boolean;
  /** YouTube search query for a how-to video. */
  videoSearch: string;
}

export const PHONEME_TIPS: Record<string, PhonemeTip> = {
  "ɪ": {
    key: "ɪ", symbol: "/ɪ/", label: "short i — ship", mouth: "relaxed",
    howVi: "Âm 'i' NGẮN. Miệng thả lỏng, hé nhẹ; lưỡi cao vừa. Đọc nhanh, dứt khoát — đừng kéo dài.",
    example: "ship", videoSearch: "how to pronounce short i vowel ɪ sound English",
  },
  "iː": {
    key: "iː", symbol: "/iː/", label: "long ee — sheep", mouth: "smile",
    howVi: "Âm 'i' DÀI. Môi hơi mỉm cười kéo sang hai bên, lưỡi cao và căng. Kéo dài hơn /ɪ/.",
    example: "sheep", videoSearch: "how to pronounce long ee vowel iː sound English",
  },
  "θ": {
    key: "θ", symbol: "/θ/", label: "th — think", mouth: "tongue-teeth",
    howVi: "Đặt ĐẦU LƯỠI giữa hai hàm răng, thổi hơi ra nhẹ. KHÔNG rung cổ họng.",
    example: "think", videoSearch: "how to pronounce TH sound θ voiceless English",
  },
  "ð": {
    key: "ð", symbol: "/ð/", label: "th — this", mouth: "tongue-teeth", voiced: true,
    howVi: "Đầu lưỡi chạm nhẹ răng cửa trên, thổi hơi CÓ RUNG cổ họng (đặt tay lên cổ thấy rung).",
    example: "this", videoSearch: "how to pronounce TH sound ð voiced English",
  },
  "ʃ": {
    key: "ʃ", symbol: "/ʃ/", label: "sh — she", mouth: "round",
    howVi: "Môi tròn và đẩy ra trước, lưỡi nâng gần vòm miệng. Âm 'sh' như khi suỵt im lặng.",
    example: "she", videoSearch: "how to pronounce SH sound ʃ English",
  },
  "s": {
    key: "s", symbol: "/s/", label: "s — sea", mouth: "smile",
    howVi: "Môi KHÔNG tròn, lưỡi gần lợi trên, hơi thoát ra rãnh giữa lưỡi — âm 'sss' như rắn.",
    example: "sea", videoSearch: "how to pronounce S sound English",
  },
  "v": {
    key: "v", symbol: "/v/", label: "v — van", mouth: "lip-teeth", voiced: true,
    howVi: "Răng cửa trên chạm nhẹ MÔI DƯỚI, thổi hơi CÓ RUNG. Đừng đọc thành 'd' hay 'b'.",
    example: "van", videoSearch: "how to pronounce V sound English mouth",
  },
  "f": {
    key: "f", symbol: "/f/", label: "f — fan", mouth: "lip-teeth",
    howVi: "Răng cửa trên chạm nhẹ môi dưới, thổi hơi KHÔNG rung (giống /v/ nhưng không rung).",
    example: "fan", videoSearch: "how to pronounce F sound English mouth",
  },
  endings: {
    key: "endings", symbol: "-ed / -s / -t", label: "final sounds", mouth: "neutral",
    howVi: "Phát âm RÕ phụ âm cuối, đừng nuốt mất. Vd: 'worked' = /wɜːrkt/ phải bật âm /t/ ở cuối.",
    example: "worked", videoSearch: "how to pronounce ed endings final consonants English",
  },
  stress: {
    key: "stress", symbol: "ˈ", label: "word stress", mouth: "neutral",
    howVi: "Nhấn MẠNH và DÀI hơn ở âm tiết trọng âm, các âm còn lại đọc nhẹ và nhanh. Vd: imPORtant.",
    example: "important", videoSearch: "English word stress pronunciation lesson",
  },
};

/** Render a YouTube search URL for a tip's how-to video. */
export function videoUrl(tip: PhonemeTip): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(tip.videoSearch)}`;
}

export interface WordInfo {
  ipa: string;
  phonemes: string[]; // keys into PHONEME_TIPS
}

export const WORD_INFO: Record<string, WordInfo> = {
  ship: { ipa: "/ʃɪp/", phonemes: ["ʃ", "ɪ"] },
  sheep: { ipa: "/ʃiːp/", phonemes: ["ʃ", "iː"] },
  bit: { ipa: "/bɪt/", phonemes: ["ɪ"] },
  beat: { ipa: "/biːt/", phonemes: ["iː"] },
  think: { ipa: "/θɪŋk/", phonemes: ["θ", "ɪ"] },
  this: { ipa: "/ðɪs/", phonemes: ["ð"] },
  three: { ipa: "/θriː/", phonemes: ["θ", "iː"] },
  mother: { ipa: "/ˈmʌðər/", phonemes: ["ð"] },
  asked: { ipa: "/æskt/", phonemes: ["endings", "s"] },
  worked: { ipa: "/wɜːrkt/", phonemes: ["endings"] },
  needed: { ipa: "/ˈniːdɪd/", phonemes: ["endings", "iː"] },
  wanted: { ipa: "/ˈwɒntɪd/", phonemes: ["endings"] },
  bath: { ipa: "/bæθ/", phonemes: ["θ"] },
  father: { ipa: "/ˈfɑːðər/", phonemes: ["ð", "f"] },
  want: { ipa: "/wɒnt/", phonemes: ["endings"] },
  "won't": { ipa: "/woʊnt/", phonemes: ["endings"] },
  car: { ipa: "/kɑːr/", phonemes: [] },
  card: { ipa: "/kɑːrd/", phonemes: ["endings"] },
  sea: { ipa: "/siː/", phonemes: ["s", "iː"] },
  she: { ipa: "/ʃiː/", phonemes: ["ʃ", "iː"] },
  sip: { ipa: "/sɪp/", phonemes: ["s", "ɪ"] },
  save: { ipa: "/seɪv/", phonemes: ["s", "v"] },
  safe: { ipa: "/seɪf/", phonemes: ["s", "f"] },
  van: { ipa: "/væn/", phonemes: ["v"] },
  fan: { ipa: "/fæn/", phonemes: ["f"] },
  fine: { ipa: "/faɪn/", phonemes: ["f"] },
  vine: { ipa: "/vaɪn/", phonemes: ["v"] },
  leaf: { ipa: "/liːf/", phonemes: ["f", "iː"] },
  leave: { ipa: "/liːv/", phonemes: ["v", "iː"] },
  present: { ipa: "/ˈprezənt/", phonemes: ["stress"] },
  record: { ipa: "/ˈrekɔːrd/", phonemes: ["stress", "endings"] },
  water: { ipa: "/ˈwɔːtər/", phonemes: ["stress"] },
  little: { ipa: "/ˈlɪtəl/", phonemes: ["stress", "ɪ"] },
  important: { ipa: "/ɪmˈpɔːrtənt/", phonemes: ["stress"] },
  comfortable: { ipa: "/ˈkʌmftəbəl/", phonemes: ["stress"] },
  vegetable: { ipa: "/ˈvedʒtəbəl/", phonemes: ["stress"] },
  photograph: { ipa: "/ˈfoʊtəɡræf/", phonemes: ["stress", "f"] },
  computer: { ipa: "/kəmˈpjuːtər/", phonemes: ["stress"] },
  delicious: { ipa: "/dɪˈlɪʃəs/", phonemes: ["stress", "ʃ"] },
};

function clean(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, "").replace(/^'+|'+$/g, "");
}

/** IPA for a word: curated first, then the generated CMUdict map. */
export function wordIPA(word: string): string | null {
  const w = clean(word);
  return WORD_INFO[w]?.ipa ?? IPA_DICT[w] ?? null;
}

export function lookupWord(word: string): WordInfo | null {
  return WORD_INFO[clean(word)] ?? null;
}

// Priority order for which tips to surface first when capping.
const PRIORITY = ["θ", "ð", "ʃ", "v", "f", "s", "ɪ", "iː", "endings", "stress"];
const DETECTABLE = ["θ", "ð", "ʃ", "v", "f", "s", "ɪ", "iː"];

/** Detect which mouth-tip phonemes appear in an IPA string. */
export function detectTipKeysFromIPA(ipa: string): string[] {
  return DETECTABLE.filter((sym) => ipa.includes(sym));
}

/** Resolve the phoneme tips to show for a single item; fall back to focus keys. */
export function tipsForItem(item: string, fallbackKeys: string[]): PhonemeTip[] {
  const info = lookupWord(item);
  const keys = info && info.phonemes.length ? info.phonemes : fallbackKeys;
  return keys.map((k) => PHONEME_TIPS[k]).filter(Boolean);
}

/** Resolve the phoneme tips for a whole sentence/paragraph. */
export function tipsForText(text: string, fallbackKeys: string[], cap = 6): PhonemeTip[] {
  const tokens = text.match(/[A-Za-z']+/g) ?? [];
  const found = new Set<string>();
  for (const tok of tokens) {
    const info = lookupWord(tok);
    if (info && info.phonemes.length) {
      info.phonemes.forEach((k) => found.add(k));
      continue;
    }
    const ipa = wordIPA(tok);
    if (ipa) detectTipKeysFromIPA(ipa).forEach((k) => found.add(k));
  }
  let keys = PRIORITY.filter((k) => found.has(k));
  if (keys.length === 0) keys = fallbackKeys;
  return keys
    .slice(0, cap)
    .map((k) => PHONEME_TIPS[k])
    .filter(Boolean);
}
