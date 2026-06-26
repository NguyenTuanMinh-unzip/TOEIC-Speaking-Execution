# TOEIC Speaking Execution System

A **180-day discipline system** that forces one user to speak English **every single day** for 6 months — from zero speaking to a TOEIC Speaking score of ~120.

This is **not** a learning website. It is an execution tool:

- **Speak every day. No excuses.**
- **Simple > Perfect. Repeat > Learn new.**
- **Use templates — no free-speaking thinking.**

The system pushes you to *act*, not to consume content.

---

## How it works

- **Start date:** 29 June (Day 1). Runs 180 days.
- The current **Day X / 180** is computed from the calendar — you can't fast-forward.
- Every day has **4 fixed tasks = 120 minutes**:
  1. **Pronunciation** (20 min) — auto-assigned target sounds
  2. **Shadowing** (30 min) — listen → repeat 5× → record
  3. **Guided Speaking** (40 min) — fixed templates + assigned topic, **recording required**
  4. **TOEIC Practice** (30 min) — Read Aloud, Describe Picture, Answer, Opinion — **record all 4**
- A day is a **SUCCESS DAY** only when **all 4 tasks + a recording** are checked.
- Any past day left unfinished is a **FAILED DAY** — redo it. The streak stays broken until you do.
- **Saturday = Full Training Day**: self-introduction, work, daily life, plus a TOEIC mock.
- **30 fixed topics** rotate; after 30 days the loop **repeats on purpose**.
- **Monthly checkpoints** grow the target: 5 sentences → 7–10 → 30–60s → full responses.

### Discipline rules enforced in code
- You **cannot complete Speaking without recording** (`requiresRecording` gate in the store).
- You **cannot complete TOEIC** until all 4 sub-tasks are recorded.
- Pressure messaging: `"You are breaking your 6-month commitment."` / `"✅ SUCCESS DAY – Keep going."`

---

## Tech & storage

- **Next.js 15 (App Router) + React 19 + TailwindCSS** — dark, minimal, one-screen-one-task.
- **Zustand** (with `persist`) for progress/streak state → `localStorage`.
- **IndexedDB** for audio blobs (recordings can be large; they never leave the device).
- **MediaRecorder API** for recording, **SpeechSynthesis** as the offline "model voice" for
  pronunciation drills and shadowing.

> **Why local-first, not Supabase by default?** This is a single-user tool that must work
> *immediately* on Day 1 with zero setup, zero login, and offline. The data layer is isolated in
> `src/lib/audio-db.ts` + `src/lib/store.ts`, so swapping in Supabase later is a contained change.
> A ready-to-use Postgres schema and migration path are in [`supabase/schema.sql`](supabase/schema.sql).

---

## Setup

```bash
npm install
npm run dev          # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

**Microphone:** the browser will ask for mic permission the first time you record. On
`localhost` this works over HTTP; on a deployed site you must serve over **HTTPS** for
`getUserMedia` to work.

> The program shows a countdown until Day 1 (29 June 2026). To preview the live dashboard
> before then, temporarily change `START_DATE` in `src/lib/constants.ts` to today's date.

---

## Folder structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout + AppShell (dark, fixed bottom nav)
│   │   ├── globals.css           # Tailwind + dark theme + component classes
│   │   ├── page.tsx              # DASHBOARD — "Today's Mission"
│   │   ├── pronunciation/page.tsx
│   │   ├── shadowing/page.tsx
│   │   ├── speaking/page.tsx     # CORE speaking engine (+ Saturday mode)
│   │   ├── toeic/page.tsx        # 4-task TOEIC practice
│   │   ├── progress/page.tsx     # Streak, checkpoints, 180-day map
│   │   └── history/page.tsx      # All recordings
│   ├── components/
│   │   ├── AppShell.tsx          # Nav + store init
│   │   ├── TaskPageShell.tsx     # Shared task layout + "Mark complete" gate
│   │   ├── Recorder.tsx          # MediaRecorder → IndexedDB
│   │   ├── ShadowingPlayer.tsx   # Sentence-by-sentence, 5× repeat
│   │   ├── TaskCard.tsx
│   │   ├── Checklist.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── RecordingList.tsx
│   │   ├── PressureBanner.tsx
│   │   ├── ProgressBar.tsx       # Bar + ring
│   │   ├── Timer.tsx
│   │   └── SpeakButton.tsx
│   └── lib/
│       ├── types.ts              # Domain types
│       ├── constants.ts          # START_DATE, TASKS, PRESSURE messages
│       ├── store.ts              # Zustand store + discipline rules + selectors
│       ├── audio-db.ts           # IndexedDB adapter (swap for Supabase here)
│       ├── date.ts               # Day-number / Saturday / date logic
│       ├── topics.ts             # 30 fixed topics + 30-day loop
│       ├── templates.ts          # Daily Life / Opinion templates
│       ├── pronunciation.ts      # Day-based sound focus
│       ├── toeic-data.ts         # Read/Describe/Answer/Opinion content
│       ├── shadowing-data.ts     # Shadowing scripts
│       ├── plan.ts               # Monthly checkpoints + Saturday tasks
│       ├── speech.ts             # SpeechSynthesis wrapper (model voice)
│       └── hooks.ts              # useMounted / useCurrentDay
├── supabase/schema.sql           # Optional cloud schema
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## Data model (client)

`localStorage` (via Zustand) holds one `DayProgress` per day:

```ts
DayProgress {
  day: number;            // 1..180
  date: string;           // yyyy-mm-dd
  tasks: { pronunciation, shadowing, speaking, toeic: TaskStatus };
  completed: boolean;     // all 4 done
  failed: boolean;
  completedAt?: string;
}
```

IndexedDB (`toeic-speaking-db` → `recordings`) holds each audio clip:

```ts
Recording { id, day, topic, taskType, subTask?, timestamp, durationMs, mimeType, blob }
```

See [`supabase/schema.sql`](supabase/schema.sql) for the equivalent cloud schema if you later
want sync across devices.
