import type { Recording, RecordingMeta, TaskType } from "./types";

// ---------------------------------------------------------------------------
// IndexedDB wrapper for audio blobs. Recordings can be large, so they live in
// IndexedDB (not localStorage). Metadata is duplicated into the Zustand store
// as lightweight counts to gate task completion synchronously.
//
// This module is the single storage adapter. To move to the cloud later,
// reimplement these functions against Supabase Storage + a `recordings` table
// and keep the same signatures.
// ---------------------------------------------------------------------------

const DB_NAME = "toeic-speaking-db";
const STORE = "recordings";
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("day", "day", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(db: IDBDatabase, mode: IDBTransactionMode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

export interface NewRecording {
  day: number;
  topic: string;
  taskType: TaskType;
  subTask?: string;
  durationMs: number;
  blob: Blob;
}

/** Save a recording; resolves with the assigned id. */
export async function addRecording(rec: NewRecording): Promise<number> {
  const db = await openDB();
  const record = {
    day: rec.day,
    topic: rec.topic,
    taskType: rec.taskType,
    subTask: rec.subTask ?? null,
    timestamp: Date.now(),
    durationMs: rec.durationMs,
    mimeType: rec.blob.type || "audio/webm",
    blob: rec.blob,
  };
  return new Promise((resolve, reject) => {
    const req = tx(db, "readwrite").add(record);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllRecordings(): Promise<Recording[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "readonly").getAll();
    req.onsuccess = () => resolve((req.result as Recording[]).sort((a, b) => b.timestamp - a.timestamp));
    req.onerror = () => reject(req.error);
  });
}

export async function getRecordingsByDay(day: number): Promise<Recording[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const idx = tx(db, "readonly").index("day");
    const req = idx.getAll(IDBKeyRange.only(day));
    req.onsuccess = () => resolve((req.result as Recording[]).sort((a, b) => b.timestamp - a.timestamp));
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecording(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = tx(db, "readwrite").delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/** Build the full day -> taskType -> count map from stored metadata. */
export async function buildRecordingCounts(): Promise<
  Record<number, Partial<Record<TaskType, number>>>
> {
  const all = await getAllRecordings();
  const counts: Record<number, Partial<Record<TaskType, number>>> = {};
  for (const r of all) {
    counts[r.day] ??= {};
    counts[r.day][r.taskType] = (counts[r.day][r.taskType] ?? 0) + 1;
  }
  return counts;
}

/** Distinct sub-tasks recorded for a (day, taskType). */
export async function recordedSubTasks(day: number, taskType: TaskType): Promise<Set<string>> {
  const recs = await getRecordingsByDay(day);
  const set = new Set<string>();
  for (const r of recs) {
    if (r.taskType === taskType && r.subTask) set.add(r.subTask);
  }
  return set;
}

export type { Recording, RecordingMeta };
