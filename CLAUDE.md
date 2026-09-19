# Golf Progress Tracker

A personal web app connecting "what the coach said" → "what I practiced" →
"what changed" over time. Built with Next.js 14 (App Router, static export),
Tailwind CSS, and Zustand. Data lives in `/data/*.json` in this repo — no
external database, no auth, single user.

Hosted on GitHub Pages via `.github/workflows/deploy.yml` (builds on push to
`main`). Because it's a static export, the app itself cannot write back to
`/data` from the browser — pages that look like "add" forms (add lesson,
plan session, mark session complete) generate a JSON payload you copy and
hand to Claude in this project, which is what actually writes the file and
commits it (see Skills below).

## Current focus

**Downswing sequencing / over-the-top.** Starting the downswing with the
lower body instead of the arms/shoulders. Over-the-top is treated as a
symptom of poor sequencing rather than a separate fault to fix on its own.
Coach's cue: "let the arms drop" — a feel cue for passive arms, not a
literal instruction to skip the lower body.

*(Update this line whenever a new lesson note shifts the focus — the
`log-lesson` skill does this automatically.)*

## Context

- **Coach:** Adrian Saxton, possibly via "Aos Golf Coaching".
- **Practice setup:** Toptracer Range at a professional club.
- **Swing profile:** Fast/powerful swing that's ahead of current
  consistency. Recent numbers: ~150yd average 7-iron carry, ~170yd on a
  clean strike, up to 183yd carry / 213yd total on a flush hit (131 mph
  ball speed, 14° launch).
- **Video/photo review happens in chat** (claude.ai or Claude Code
  directly, either works) — this app does not store media. Takeaways from
  those reviews get written back as text into `video_review_notes` in
  `/data/lessons.json`, or into a session's post-session note in
  `/data/sessions.json`.

## Data schema

All files are single top-level objects with one array key, in `/data/`.

### `lessons.json` — `{ lessons: Lesson[] }`

```ts
{
  id: string;                 // "l-YYYY-MM-DD"
  date: string;                // "YYYY-MM-DD"
  coach: string;
  notes: string;
  cues: string[];               // feel cues given, e.g. "let the arms drop"
  fault_focus: string;          // matches a progress area id in progress.json
  drills_recommended: string[]; // drill ids from drills.json
  video_review_notes: string;   // takeaways from chat-based video review
}
```

### `drills.json` — `{ drills: Drill[] }`

```ts
{
  id: string;              // kebab-case slug, stable reference id
  name: string;
  description: string;
  target_faults: string[]; // free-text fault/skill tags, e.g. "sequencing"
  clubs: string[];         // clubs it's typically hit with, or ["any"]
}
```

### `sessions.json` — `{ sessions: Session[] }`

```ts
{
  id: string;               // "s-YYYY-MM-DD"
  date: string;
  focus: string;            // free text, usually a progress area id
  ball_count_planned: number;
  status: "planned" | "completed";
  blocks: {
    name: string;           // "Warm-up" | "Feel work" | "Drill work" |
                             // "Transfer" | "Pressure test" | "Cool-down"
    club: string;
    balls: number;
    drills: string[];       // drill ids
    focus_note: string;
  }[];
  post_session_note: {
    how_it_felt: string;
    miss_pattern: string;
    self_rated_success: number | null; // 1-5
  };
  stats_ids: string[];       // ids into stats.json logged during this session
}
```

### `stats.json` — `{ entries: StatEntry[] }`

```ts
{
  id: string;
  date: string;
  session_id: string | null; // linked session, if any
  club: string;
  ball_speed_mph: number | null;
  carry_yards: number | null;
  total_yards: number | null;
  launch_angle_deg: number | null;
  apex_ft: number | null;
  note?: string;
}
```

### `progress.json` — `{ areas: ProgressArea[] }`

Named focus areas with their own mini-timeline, so patterns are visible
across lessons/sessions/stats (e.g. "this fault has come up in 4 of the
last 6 lessons" — computed at build time from `lessons.fault_focus`).

```ts
{
  id: string;               // kebab-case slug, referenced by fault_focus/focus
  name: string;
  description: string;
  timeline: {
    date: string;
    source: "lesson" | "session" | "stats";
    source_id: string;       // id into the source file
    note: string;
  }[];
}
```

Current areas: `sequencing-over-the-top`, `center-face-contact`,
`distance-ball-speed-consistency`.

## Skills

- **log-session** — turn a plain-language description of a completed range
  session into a structured entry in `sessions.json` (+ any numbers into
  `stats.json`), then commit.
- **log-lesson** — turn lesson notes (cues, fault focus, drills recommended)
  into a structured entry in `lessons.json`, update "Current focus" above,
  then commit.
- **plan-session** — given a focus area and ball count, generate a session
  plan pulling drills from `drills.json`, write it to `sessions.json` as
  `status: "planned"`, then commit.
- **review-progress** — summarize a focus area's timeline of notes/stats,
  highlighting trends or recurring issues.

## Commit policy

Routine data logging (a session, a lesson note, a stats entry) can be
committed and pushed without asking each time. Confirm first for anything
large or ambiguous (schema changes, bulk edits, anything touching app code
rather than `/data`).
