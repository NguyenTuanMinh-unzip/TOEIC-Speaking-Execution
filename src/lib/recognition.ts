// ---------------------------------------------------------------------------
// Wrapper around the browser SpeechRecognition API (Chrome / Edge / Safari).
// Used to transcribe the user's speech live so we can score it. No API key,
// no backend — the browser handles recognition.
// ---------------------------------------------------------------------------

/* Minimal ambient types — webkitSpeechRecognition isn't in the standard lib. */
interface SRAlternative { transcript: string; confidence: number }
interface SRResult { 0: SRAlternative; isFinal: boolean; length: number }
interface SRResultList { length: number; [i: number]: SRResult }
interface SREvent extends Event { resultIndex: number; results: SRResultList }
interface SRErrorEvent extends Event { error: string }
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SRCtor = new () => SpeechRecognitionLike;

function getCtor(): SRCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SRCtor;
    webkitSpeechRecognition?: SRCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function recognitionSupported(): boolean {
  return getCtor() !== null;
}

export interface RecognitionHandle {
  stop: () => void;
  /** Best transcript so far (final + interim). */
  getTranscript: () => string;
}

export interface StartOptions {
  lang?: string;
  onPartial?: (text: string) => void;
  onEnd?: (finalText: string) => void;
  onError?: (err: string) => void;
}

/**
 * Start live recognition. Returns a handle to stop it and read the transcript.
 * Returns null if unsupported.
 */
export function startRecognition(opts: StartOptions = {}): RecognitionHandle | null {
  const Ctor = getCtor();
  if (!Ctor) return null;

  const rec = new Ctor();
  rec.lang = opts.lang ?? "en-US";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  let finalText = "";
  let interim = "";

  const full = () => (finalText + " " + interim).trim();

  rec.onresult = (e: SREvent) => {
    interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      const txt = res[0]?.transcript ?? "";
      if (res.isFinal) finalText += " " + txt;
      else interim += " " + txt;
    }
    opts.onPartial?.(full());
  };

  rec.onerror = (e: SRErrorEvent) => {
    opts.onError?.(e.error);
  };

  rec.onend = () => {
    opts.onEnd?.(full());
  };

  try {
    rec.start();
  } catch {
    return null;
  }

  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    },
    getTranscript: () => full(),
  };
}
