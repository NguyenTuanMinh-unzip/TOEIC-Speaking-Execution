"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addRecording } from "@/lib/audio-db";
import { useStore } from "@/lib/store";
import type { TaskType } from "@/lib/types";
import {
  startRecognition,
  recognitionSupported,
  type RecognitionHandle,
} from "@/lib/recognition";
import { scoreRead, scoreTemplate, type ScoreResult } from "@/lib/scoring";
import { ScoreCard } from "./ScoreCard";

type Phase = "idle" | "recording" | "saving" | "saved" | "error";

/** Optional auto-scoring configuration. */
export type ScoreConfig =
  | { mode: "read"; target: string }
  | { mode: "template"; templateLines: string[]; targetSentences: number };

interface RecorderProps {
  day: number;
  taskType: TaskType;
  topic: string;
  subTask?: string;
  /** Optional label for this recording slot. */
  label?: string;
  /** Called after a recording is successfully saved. */
  onSaved?: () => void;
  /** If set, transcribe the speech and show an accuracy score. */
  score?: ScoreConfig;
}

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  return candidates.find((c) => MediaRecorder.isTypeSupported(c)) ?? "";
}

export function Recorder({
  day,
  taskType,
  topic,
  subTask,
  label,
  onSaved,
  score,
}: RecorderProps) {
  const registerRecording = useStore((s) => s.registerRecording);
  const refreshCounts = useStore((s) => s.refreshCounts);

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [partial, setPartial] = useState("");
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recogRef = useRef<RecognitionHandle | null>(null);

  const scoringOn = !!score;
  const canScore = scoringOn && recognitionSupported();

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recogRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [cleanup, previewUrl]);

  function computeScore(transcript: string, durationMs: number): ScoreResult | null {
    if (!score) return null;
    if (score.mode === "read") return scoreRead(score.target, transcript);
    return scoreTemplate(transcript, score.templateLines, durationMs, score.targetSentences);
  }

  const start = useCallback(async () => {
    setErrorMsg("");
    setScoreResult(null);
    setPartial("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = pickMime();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const durationMs = Date.now() - startRef.current;
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const transcript = recogRef.current?.getTranscript() ?? "";
        recogRef.current?.stop();
        recogRef.current = null;
        cleanup();
        setPhase("saving");
        try {
          await addRecording({ day, topic, taskType, subTask, durationMs, blob });
          registerRecording(day, taskType);
          await refreshCounts();
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
          if (scoringOn) setScoreResult(computeScore(transcript, durationMs));
          setPhase("saved");
          onSaved?.();
        } catch {
          setErrorMsg("Could not save the recording.");
          setPhase("error");
        }
      };

      // Start live transcription in parallel (best-effort).
      if (scoringOn && recognitionSupported()) {
        recogRef.current = startRecognition({
          onPartial: (t) => setPartial(t),
          onError: () => {},
        });
      }

      startRef.current = Date.now();
      setElapsed(0);
      mr.start();
      setPhase("recording");
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startRef.current);
      }, 200);
    } catch {
      setErrorMsg("Microphone access was blocked. Allow the mic in your browser to record.");
      setPhase("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanup, day, onSaved, previewUrl, refreshCounts, registerRecording, subTask, taskType, topic, scoringOn]);

  const stop = useCallback(() => {
    recogRef.current?.stop();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {label && (
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
            {scoringOn && (
              <span
                className={`pill ${
                  canScore
                    ? "bg-accent/10 text-accent ring-1 ring-inset ring-accent/20"
                    : "bg-slate-100 text-gray-500"
                }`}
              >
                {canScore ? "Auto-score on" : "Score: Chrome/Edge only"}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          {phase === "recording" ? (
            <button onClick={stop} className="btn-danger flex-1" aria-label="Stop recording">
              <span className="h-3 w-3 rounded-sm bg-white" />
              Stop ({fmt(elapsed)})
            </button>
          ) : (
            <button
              onClick={start}
              disabled={phase === "saving"}
              className="btn-primary flex-1"
              aria-label="Start recording"
            >
              <span className="h-3 w-3 rounded-full bg-danger" />
              {phase === "saved"
                ? "Record again"
                : phase === "saving"
                ? "Saving…"
                : scoringOn
                ? "Record & score"
                : "Record"}
            </button>
          )}

          {phase === "recording" && (
            <span className="flex items-center gap-2 text-sm font-semibold text-danger">
              <span className="h-3 w-3 animate-recordPulse rounded-full bg-danger" />
              REC
            </span>
          )}
          {phase === "saved" && !scoreResult && (
            <span className="pill bg-accent/15 text-accent">Saved ✓</span>
          )}
        </div>

        {/* Live transcript while recording */}
        {phase === "recording" && canScore && (
          <p className="mt-3 min-h-[1.25rem] text-sm italic text-gray-400">
            {partial ? partial : "Listening… speak now."}
          </p>
        )}

        {previewUrl && <audio controls src={previewUrl} className="mt-4 w-full" />}

        {errorMsg && <p className="mt-3 text-sm text-danger">{errorMsg}</p>}
      </div>

      {scoreResult && <ScoreCard result={scoreResult} />}
    </div>
  );
}
