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
  drill: string[];
}

const PHASE_1: PronFocus = {
  title: "Core Vowels, TH & Endings",
  sounds: ["/ɪ/ vs /iː/", "/θ/ and /ð/ (th)", "final consonants"],
  minimalPairs: [
    ["ship", "sheep"],
    ["bit", "beat"],
    ["think", "this"],
    ["bath", "father"],
    ["wan", "want"],
    ["car", "card"],
  ],
  drill: [
    "Sit and seat. I sit on the seat.",
    "Think about this thing with your teeth.",
    "I wanted, I needed, I worked, I asked. (say every ending)",
  ],
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
  drill: [
    "She sells sea shells by the sea shore.",
    "Very fine vans drive very far.",
    "Save the file. Leave the leaf.",
  ],
};

const REVIEW_POOL: PronFocus[] = [
  PHASE_1,
  PHASE_2,
  {
    title: "Word Stress & Linking",
    sounds: ["stress on content words", "link consonant → vowel"],
    minimalPairs: [
      ["PREsent (noun)", "preSENT (verb)"],
      ["an apple", "an_apple"],
      ["pick it up", "pi-ki-tup"],
    ],
    drill: [
      "I'd like an apple. (link 'an apple')",
      "Pick it up and put it on. (link every word)",
      "I REALLY WANT to GO. (stress content words)",
    ],
  },
];

/** Pronunciation focus for a given program day. */
export function pronFocusForDay(day: number): PronFocus {
  if (day <= 10) return PHASE_1;
  if (day <= 20) return PHASE_2;
  // Day 21+: rotate through the review pool by week.
  const week = Math.floor((day - 21) / 7);
  return REVIEW_POOL[week % REVIEW_POOL.length];
}
