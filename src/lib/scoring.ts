// ---------------------------------------------------------------------------
// Pure scoring functions. Given a target text (what the user SHOULD say) and a
// transcript (what speech-recognition HEARD), produce an accuracy score and a
// per-word matched/missed breakdown. For open speaking (no exact target) we
// score template usage + length against the monthly checkpoint.
//
// This is intelligibility scoring, not phoneme-perfect scoring: if the browser
// recognizer heard the right words, the pronunciation was clear enough.
// ---------------------------------------------------------------------------

export type Tone = "accent" | "gold" | "danger";

export interface Grade {
  label: string;
  tone: Tone;
  emoji: string;
}

export function gradeFor(pct: number): Grade {
  if (pct >= 85) return { label: "Excellent", tone: "accent", emoji: "🏆" };
  if (pct >= 70) return { label: "Good", tone: "accent", emoji: "✅" };
  if (pct >= 50) return { label: "Keep practicing", tone: "gold", emoji: "🔁" };
  return { label: "Try again", tone: "danger", emoji: "❌" };
}

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(s: string): string[] {
  const n = normalizeText(s);
  return n ? n.split(" ") : [];
}

/** Longest-common-subsequence → which target words were matched (in order). */
function matchedFlags(target: string[], spoken: string[]): boolean[] {
  const n = target.length;
  const m = spoken.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = target[i] === spoken[j]
        ? 1 + dp[i + 1][j + 1]
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const flags = new Array(n).fill(false);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (target[i] === spoken[j]) {
      flags[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return flags;
}

export interface ReadScore {
  kind: "read";
  accuracy: number; // 0..100
  targetWords: string[];
  matched: boolean[];
  missed: string[];
  transcript: string;
  grade: Grade;
}

/** Score read-aloud / shadowing / drills against an exact target sentence. */
export function scoreRead(target: string, transcript: string): ReadScore {
  const t = tokenize(target);
  const s = tokenize(transcript);
  const flags = matchedFlags(t, s);
  const hits = flags.filter(Boolean).length;
  const accuracy = t.length ? Math.round((hits / t.length) * 100) : 0;
  const missed = t.filter((_, i) => !flags[i]);
  return {
    kind: "read",
    accuracy,
    targetWords: t,
    matched: flags,
    missed,
    transcript: transcript.trim(),
    grade: gradeFor(accuracy),
  };
}

export interface TemplateScore {
  kind: "template";
  score: number; // 0..100
  usedMarkers: string[];
  missingMarkers: string[];
  coverage: number; // 0..100 template markers used
  wordCount: number;
  wpm: number;
  sentencesEstimate: number;
  targetSentences: number;
  transcript: string;
  grade: Grade;
}

/** Derive a searchable marker phrase from a template line ("I usually..." -> "i usually"). */
function markerOf(line: string): string {
  return normalizeText(line.replace(/\.\.\.|…/g, " "));
}

/**
 * Score open speaking: did they use the template, and did they speak enough?
 * targetSentences comes from the monthly checkpoint (5, 7, ...).
 */
export function scoreTemplate(
  transcript: string,
  templateLines: string[],
  durationMs: number,
  targetSentences: number
): TemplateScore {
  const norm = normalizeText(transcript);
  const words = tokenize(transcript);
  const wordCount = words.length;

  const used: string[] = [];
  const missing: string[] = [];
  for (const line of templateLines) {
    const marker = markerOf(line);
    if (marker && norm.includes(marker)) used.push(line);
    else missing.push(line);
  }
  const coverage = templateLines.length
    ? Math.round((used.length / templateLines.length) * 100)
    : 0;

  const minutes = Math.max(durationMs / 60000, 1 / 60);
  const wpm = Math.round(wordCount / minutes);

  // Rough sentence estimate: blend template markers hit with words-per-~8.
  const sentencesEstimate = Math.max(used.length, Math.round(wordCount / 8));
  const lengthRatio = Math.min(1, sentencesEstimate / Math.max(1, targetSentences));

  // 55% template usage + 45% length adequacy.
  const score = Math.round((coverage * 0.55 + lengthRatio * 100 * 0.45));

  return {
    kind: "template",
    score,
    usedMarkers: used,
    missingMarkers: missing,
    coverage,
    wordCount,
    wpm,
    sentencesEstimate,
    targetSentences,
    transcript: transcript.trim(),
    grade: gradeFor(score),
  };
}

export type ScoreResult = ReadScore | TemplateScore;
