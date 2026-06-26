// ---------------------------------------------------------------------------
// Thin wrapper around the browser SpeechSynthesis API. Used as the "model
// voice" for pronunciation drills and shadowing, so the whole system works
// offline with zero external media files.
// ---------------------------------------------------------------------------

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  // Prefer a natural-sounding English voice.
  return (
    voices.find((v) => /en-US/i.test(v.lang) && /natural|google|samantha|aria/i.test(v.name)) ??
    voices.find((v) => /en[-_]?(US|GB)/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    voices[0]
  );
}

export interface SpeakOptions {
  rate?: number; // 0.1 - 10
  onEnd?: () => void;
}

/** Speak a phrase once. Cancels any in-flight speech first. */
export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!speechSupported()) {
    opts.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.lang = v?.lang ?? "en-US";
  u.rate = opts.rate ?? 0.95;
  if (opts.onEnd) u.onend = () => opts.onEnd!();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
