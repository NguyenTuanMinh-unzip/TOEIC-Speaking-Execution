// ---------------------------------------------------------------------------
// Content for the four TOEIC Speaking practice tasks. Content rotates by day so
// the user always has something to do, but the STRUCTURE never changes.
// ---------------------------------------------------------------------------

// --- Task 1: Read Aloud paragraphs -----------------------------------------
export const READ_ALOUD: string[] = [
  "Thank you for calling Greenline Electronics. Our store is open from nine in the morning until eight in the evening, Monday through Saturday. If you would like to speak with a representative, please stay on the line. For store hours, directions, and current promotions, please visit our website.",
  "Attention passengers. The four-fifteen express train to Central Station is now boarding on platform two. Please have your tickets ready and keep your belongings with you at all times. We remind you that the train will depart promptly, so please find your seat as quickly as possible. Thank you for traveling with us.",
  "Welcome to the city art museum. Today we are featuring a special exhibition of modern photography from around the world. The exhibition is located on the second floor. Guided tours begin every hour near the main entrance. Please remember that photography is not allowed inside the galleries. Enjoy your visit.",
  "Good afternoon, everyone, and welcome to our annual staff meeting. Before we begin, I would like to thank each of you for your hard work this year. We have a lot to discuss, including our new projects and the schedule for next month. Please feel free to ask questions at any time during the presentation.",
  "This is a reminder that the community library will be closed next Monday for a national holiday. Books that are due on that day can be returned the following morning without any late fee. Our online catalog remains available at all times, so you can renew or reserve materials from home. We appreciate your understanding.",
  "Are you tired of cooking after a long day at work? Let Fresh Table do it for you. We deliver healthy, home-style meals right to your door, seven days a week. Simply choose your menu online, and we will take care of the rest. Order today and enjoy your first delivery at a special price.",
  "Welcome aboard flight two-oh-seven to Singapore. Our flight time today will be about six hours and twenty minutes. The weather at our destination is clear and warm. For your safety, please keep your seatbelt fastened whenever you are seated. Our cabin crew will be coming through the cabin shortly with refreshments.",
];

// --- Task 2: Describe a Picture --------------------------------------------
export interface PictureScene {
  seed: string;
  label: string;
}
export const PICTURE_SCENES: PictureScene[] = [
  { seed: "office-meeting", label: "a busy office or meeting" },
  { seed: "street-market", label: "an outdoor street or market" },
  { seed: "coffee-shop", label: "a cafe or restaurant" },
  { seed: "park-people", label: "a park with people" },
  { seed: "train-station", label: "a station or platform" },
  { seed: "kitchen-cook", label: "a kitchen or cooking scene" },
  { seed: "library-study", label: "a library or study space" },
  { seed: "beach-holiday", label: "a beach or holiday" },
];
export const PICTURE_HINTS = [
  "In this picture, I can see...",
  "In the foreground, there is/are...",
  "In the background...",
  "They seem to be...",
  "I think they are... because...",
];
/** Seeded photo URL (works online). Components should provide a fallback. */
export function pictureUrl(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/520`;
}

// --- Task 3: Answer a Question ---------------------------------------------
export const ANSWER_QUESTIONS: string[] = [
  "What do you usually do in your free time?",
  "How often do you eat at restaurants, and what do you order?",
  "Tell me about the last time you traveled somewhere.",
  "What kind of music do you like to listen to and when?",
  "Describe your typical morning before work.",
  "What do you usually do to relax after a long day?",
  "How do you usually keep in touch with your friends?",
  "What is your favorite place in your city and why?",
];
export const ANSWER_HINTS = [
  "In my free time, I usually...",
  "Sometimes...",
  "For example,...",
  "I like it because...",
];

// --- Task 4: Express an Opinion --------------------------------------------
export const OPINION_TOPICS: string[] = [
  "Some people prefer to work from home. Do you agree? Why?",
  "Is it better to live in a big city or a small town?",
  "Should students learn a second language at school?",
  "Do you think technology makes our lives easier?",
  "Is it better to save money or to spend it on experiences?",
  "Should people exercise every day?",
  "Is online shopping better than shopping in stores?",
  "Do you think people watch too much television?",
];
export const OPINION_HINTS = ["I think...", "First,...", "Second,...", "That's why..."];

function pick<T>(arr: T[], day: number): T {
  return arr[(day - 1) % arr.length];
}

export function toeicForDay(day: number) {
  return {
    readAloud: pick(READ_ALOUD, day),
    picture: pick(PICTURE_SCENES, day),
    question: pick(ANSWER_QUESTIONS, day),
    opinion: pick(OPINION_TOPICS, day),
  };
}
