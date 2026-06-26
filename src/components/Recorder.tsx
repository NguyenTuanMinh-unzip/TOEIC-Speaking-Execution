"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { addRecording } from "@/lib/audio-db";
import { useStore } from "@/lib/store";
import type { TaskType } from "@/lib/types";

type Phase = "idle" | "recording" | "saving" | "saved" | "error";

interface RecorderProps {
  day: number;
  taskType: TaskType;
  topic: string;
  subTask?: string;
  /** Optional label for this recording slot. */
  label?: string;
  /** Called after a recording is successfully saved. */
  onSaved?: () => void;
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

export function Recorder({ day, taskType, topic, subTask, label, onSaved }: RecorderProps) {
  const registerRecording = useStore((s) => s.registerRecording);
  const refreshCounts = useStore((s) => s.refreshCounts);

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [cleanup, previewUrl]);

  const start = useCallback(async () => {
    setErrorMsg("");
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
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });
        cleanup();
        setPhase("saving");
        try {
          await addRecording({ day, topic, taskType, subTask, durationMs, blob });
          registerRecording(day, taskType);
          await refreshCounts();
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
          setPhase("saved");
          onSaved?.();
        } catch (err) {
          setErrorMsg("Could not save the recording.");
          setPhase("error");
        }
      };

      startRef.current = Date.now();
      setElapsed(0);
      mr.start();
      setPhase("recording");
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startRef.current);
      }, 200);
    } catch (err) {
      setErrorMsg(
        "Microphone access was blocked. Allow the mic in your browser to record."
      );
      setPhase("error");
    }
  }, [cleanup, day, onSaved, previewUrl, refreshCounts, registerRecording, subTask, taskType, topic]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-4">
      {label && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </p>
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
            <span
              className={`h-3 w-3 rounded-full bg-danger ${
                phase === "saving" ? "" : ""
              }`}
            />
            {phase === "saved" ? "Record again" : phase === "saving" ? "Saving…" : "Record"}
          </button>
        )}

        {phase === "recording" && (
          <span className="flex items-center gap-2 text-sm font-semibold text-danger">
            <span className="h-3 w-3 animate-recordPulse rounded-full bg-danger" />
            REC
          </span>
        )}
        {phase === "saved" && (
          <span className="pill bg-accent-soft text-accent">Saved ✓</span>
        )}
      </div>

      {previewUrl && (
        <audio controls src={previewUrl} className="mt-4 w-full" />
      )}

      {errorMsg && <p className="mt-3 text-sm text-danger">{errorMsg}</p>}
    </div>
  );
}
