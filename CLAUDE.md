# Golf Progress Tracker

A personal web app connecting "what the coach said" → "what I practiced" →
"what changed" over time. Built with Next.js 14 (App Router, static export),
Tailwind CSS, and plain React state. Data lives in `/data/*.json` in this repo — no
external database, no auth, single user.

Hosted on GitHub Pages via `.github/workflows/deploy.yml` (builds on push to
`main`). Because it's a static export, the app itself has no server to write
back to `/data` directly — the "add" forms (add lesson, plan session, mark
session complete) each have two ways to actually persist:

1. **Submit via GitHub Issue** (automatic) — the button opens a pre-filled
   GitHub issue containing the same JSON payload; `.github/workflows/ingest-data-issue.yml`
   parses it, updates the right `/data/*.json` file, commits, pushes, and
   closes the issue, usually within a minute. No chat needed. Requires the
   repo's Settings → Actions → General → Workflow permissions be set to
   "Read and write permissions" (one-time setup). **The repo is public**
   (required for free GitHub Pages), so the workflow only processes issues
   opened by the actual owner account (`ms653`) — anyone else's submission is
   silently ignored rather than committed. Update that login in the workflow
   if the owner account ever changes.
2. **Copy JSON → paste to Claude** (manual) — the same payload, handed to
   Claude in this project instead, where the matching skill below writes and
   commits it. Useful when you'd rather Claude sanity-check the entry first,
   or when you're already mid-conversation.

## How to handle golf conversations

This file loads automatically whenever a Claude Code session opens in this
repo. Treat any golf-related message in this project as a reason to check
this file's "Current focus" and skim the relevant `/data` files before
responding — even if the user doesn't name a skill explicitly.

| What the user says | What to do |
|---|---|
| "heading to the range" / "let's plan today" / "got an hour to hit balls" | `golf-session-kickoff` |
| "just finished" / "hit balls today" / shares how a session went | `log-session` |
| "had a lesson" / "coach said" / "Adrian gave me..." | `log-lesson` |
| Shares a swing video/photo/clip, or describes one | `analyze-swing-video` |
| Shares a Toptracer/launch monitor screenshot or numbers | `analyze-range-screenshot` |
| "how am I doing on X" / "am I still coming over the top" | `review-progress` |
| "what should I work on for the next few weeks" / "give me a plan until my next lesson" | `training-plan` |
| "prep me for my lesson" / "what should I tell Adrian" / "getting ready to see my coach" | `lesson-prep` |
| Anything else golf-related | No skill needed necessarily, but still check current focus + recent lesson/progress before answering, so the answer is grounded in this user's actual data, not generic golf advice |

This routing only fires automatically in a Claude Code session that has
this repo open — a plain claude.ai chat with no repo context can't see
these files unless the repo/data is otherwise provided to it.

## Current focus

**Downswing sequencing / over-the-top.** Starting the downswing with the
lower body instead of the arms/shoulders. Over-the-top is treated as a
symptom of poor sequencing rather than a separate fault to fix on its own.
Coach's cue: "let the arms drop" — a feel cue for passive arms, not a
literal instruction to skip the lower body.

*(Update this line whenever a new lesson note shifts the focus — the
`log-lesson` skill does this automatically.)*

## Context

- **Repo/site visibility:** the repo is public (required for free GitHub
  Pages), so everything in `/data` — lesson notes, coach's name, swing
  faults, stats — is world-readable via the repo and the deployed site, not
  just visible to the owner. Accepted tradeoff for this content; worth
  knowing before adding anything more sensitive.
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
    source: "lesson" | "session" | "stats" | "review";
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
- **golf-session-kickoff** — conversational front-end to `plan-session`:
  reads recent context (focus, last lesson, last session, active training
  plan), asks a couple of quick questions, then generates and persists a
  session plan.
- **analyze-swing-video** — expert analysis of a swing video/photo (or
  description) shared in chat, grounded in current focus and known fault
  areas, written to `reviews.json` and `progress.json`.
- **analyze-range-screenshot** — expert analysis of a Toptracer-style
  screenshot or reported numbers against baseline/history, written to
  `stats.json` and `reviews.json`.
- **training-plan** — generate and maintain a multi-week training plan
  grounded in recurring lesson/progress patterns, written to
  `training_plans.json`.
- **lesson-prep** — read-only, cross-area digest of everything since the
  last lesson (sessions, stats, reviews, quiet areas) to bring to the next
  one; distinct from `review-progress`'s single-area, backward-looking
  summary.

## Commit policy

Routine data logging (a session, a lesson note, a stats entry) can be
committed and pushed without asking each time. Confirm first for anything
large or ambiguous (schema changes, bulk edits, anything touching app code
rather than `/data`).
