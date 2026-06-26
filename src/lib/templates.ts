// ---------------------------------------------------------------------------
// Fixed speaking templates. The user MUST follow these. No free-typing mode.
// Output is speech, not text — these are scaffolds to remove "what do I say?"
// ---------------------------------------------------------------------------

export interface SpeakingTemplate {
  id: "daily_life" | "opinion";
  title: string;
  lines: string[];
  /** Minimum sentences expected (grows with the monthly checkpoints). */
}

export const TEMPLATES: Record<SpeakingTemplate["id"], SpeakingTemplate> = {
  daily_life: {
    id: "daily_life",
    title: "Daily Life Template",
    lines: ["I usually...", "I often...", "Sometimes...", "For example,...", "I like it because..."],
  },
  opinion: {
    id: "opinion",
    title: "Opinion Template",
    lines: ["I think...", "First,...", "Second,...", "That's why..."],
  },
};

/** Pick the template for a day. Even days = daily life, odd = opinion-ish mix.
 *  Daily Life is the workhorse; Opinion appears every 3rd day to build variety
 *  without introducing free speaking. */
export function templateForDay(day: number): SpeakingTemplate {
  return day % 3 === 0 ? TEMPLATES.opinion : TEMPLATES.daily_life;
}
