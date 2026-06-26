// ---------------------------------------------------------------------------
// Shadowing scripts. The player breaks audio into sentences and repeats each
// one 5 times. We use the browser's built-in Speech Synthesis as the model
// voice so the system works offline with zero external media. Each sentence is
// "Listen → repeat → record".
// ---------------------------------------------------------------------------

export interface ShadowScript {
  id: number;
  title: string;
  source: string;
  sentences: string[];
}

export const SHADOW_SCRIPTS: ShadowScript[] = [
  {
    id: 1,
    title: "A Normal Morning",
    source: "Everyday English",
    sentences: [
      "I usually wake up at seven o'clock.",
      "First, I drink a glass of water.",
      "Then I take a quick shower and get dressed.",
      "I have a simple breakfast, like bread and coffee.",
      "After that, I leave the house and go to work.",
    ],
  },
  {
    id: 2,
    title: "Talking About Work",
    source: "Everyday English",
    sentences: [
      "I work in an office in the city center.",
      "My job is busy, but I like my team.",
      "In the morning, I check my email first.",
      "Sometimes I have meetings in the afternoon.",
      "I finish work at around six in the evening.",
    ],
  },
  {
    id: 3,
    title: "A Weekend Plan",
    source: "Everyday English",
    sentences: [
      "On weekends, I like to relax at home.",
      "Sometimes I meet my friends for coffee.",
      "We often talk about movies and food.",
      "In the evening, I watch a show or read a book.",
      "I try to go to bed early so I feel fresh.",
    ],
  },
  {
    id: 4,
    title: "Ordering Food",
    source: "Practical Situations",
    sentences: [
      "Hello, could I see the menu, please?",
      "I would like a chicken sandwich and a salad.",
      "Can I have a glass of water as well?",
      "How long will the food take?",
      "Thank you very much. That's all for now.",
    ],
  },
  {
    id: 5,
    title: "Giving Directions",
    source: "Practical Situations",
    sentences: [
      "Excuse me, how do I get to the station?",
      "Go straight ahead for two blocks.",
      "Then turn left at the traffic lights.",
      "The station is on your right, next to the bank.",
      "It takes about five minutes on foot.",
    ],
  },
  {
    id: 6,
    title: "Making Plans",
    source: "Practical Situations",
    sentences: [
      "Are you free this Saturday afternoon?",
      "Let's meet at the cafe near the park.",
      "How about two o'clock?",
      "I'll text you if anything changes.",
      "Great, I'm really looking forward to it.",
    ],
  },
];

export function shadowForDay(day: number): ShadowScript {
  return SHADOW_SCRIPTS[(day - 1) % SHADOW_SCRIPTS.length];
}

/** How many times the player repeats each sentence. */
export const REPEATS_PER_SENTENCE = 5;
