// ---------------------------------------------------------------------------
// Pronunciation focus auto-assignment.
//   Day 1–10:  i / iː, th, ending sounds
//   Day 11–20: s / sh, v / f
//   Day 21+:   review weak sounds (rotating)
// ---------------------------------------------------------------------------

export interface PronFocus {
  title: string;
  sounds: string[];
  minimalPairs: [string, string][];
  /** Clean single words to drill one-by-one in the trainer (recognizer-friendly). */
  practiceWords: string[];
  drill: string[];
  /** Phoneme tip keys (into PHONEME_TIPS) for this focus — fallback guidance. */
  tipKeys: string[];
}

const PHASE_1: PronFocus = {
  title: "Core Vowels, TH & Endings",
  sounds: ["/ɪ/ vs /iː/", "/θ/ and /ð/ (th)", "final consonants"],
  minimalPairs: [
    ["ship", "sheep"],
    ["bit", "beat"],
    ["think", "this"],
    ["bath", "father"],
    ["want", "won't"],
    ["car", "card"],
  ],
  practiceWords: ["ship", "sheep", "bit", "beat", "think", "this", "three", "mother", "asked", "worked", "needed", "wanted"],
  drill: [
    "I sit on the seat.",
    "Think about this thing with your teeth.",
    "I wanted, I needed, I worked, I asked.",
  ],
  tipKeys: ["ɪ", "iː", "θ", "ð", "endings"],
};

const PHASE_2: PronFocus = {
  title: "Sibilants & Fricatives",
  sounds: ["/s/ vs /ʃ/ (s / sh)", "/v/ vs /f/"],
  minimalPairs: [
    ["sea", "she"],
    ["sip", "ship"],
    ["save", "safe"],
    ["van", "fan"],
    ["vine", "fine"],
    ["leave", "leaf"],
  ],
  practiceWords: ["sea", "she", "sip", "ship", "save", "safe", "van", "fan", "fine", "vine", "leaf", "leave"],
  drill: [
    "She sells sea shells.",
    "Very fine vans drive far.",
    "Save the file and leave the leaf.",
  ],
  tipKeys: ["s", "ʃ", "v", "f"],
};

const REVIEW: PronFocus = {
  title: "Word Stress & Linking",
  sounds: ["stress on content words", "link consonant → vowel"],
  minimalPairs: [
    ["present", "record"],
    ["water", "little"],
    ["important", "comfortable"],
  ],
  practiceWords: ["present", "record", "water", "little", "important", "comfortable", "vegetable", "photograph", "computer", "delicious"],
  drill: [
    "I'd like an apple.",
    "Pick it up and put it on.",
    "I really want to go.",
  ],
  tipKeys: ["stress", "endings"],
};

const REVIEW_POOL: PronFocus[] = [PHASE_1, PHASE_2, REVIEW];

/** Pronunciation focus for a given program day. */
export function pronFocusForDay(day: number): PronFocus {
  if (day <= 10) return PHASE_1;
  if (day <= 20) return PHASE_2;
  // Day 21+: rotate through the review pool by week.
  const week = Math.floor((day - 21) / 7);
  return REVIEW_POOL[week % REVIEW_POOL.length];
}

/** Ordered trainer items: single words first, then short drill sentences. */
export function practiceItemsForDay(day: number): string[] {
  const f = pronFocusForDay(day);
  return [...f.practiceWords, ...f.drill];
}
