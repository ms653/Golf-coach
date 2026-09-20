# Golf Progress Tracker

A personal web app connecting "what the coach said" → "what I practiced" →
"what changed" over time. Built with Next.js 14 (App Router, static export),
Tailwind CSS, and plain React state. Data lives in `/data/*.json` in this repo — no
external database, no auth, single user.

Hosted on GitHub Pages via `.github/workflows/deploy.yml` (builds on push to
`main`). The site itself is a **read-only dashboard** — a place to look at
progress and review a plan, not to enter data into. There are no forms in
the app. The only way to write to `/data` is by chatting with Claude here
(in this project, or Claude Code with this repo open): describe a lesson,
a session, a round, or share a video/screenshot, and the matching skill
below writes the structured entry and commits/pushes it. This is
deliberate, not a limitation worked around — planning a session or logging
one is meant to happen in the same conversation as the coaching judgment
behind it (what does this fault mean, what should today's session actually
work on), not as a separate data-entry step. See `ROADMAP.md` for the
earlier GitHub-Issue-based write path this replaced, and why.

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
| "what should I ask before I go" / end-of-lesson, wrapping up | `lesson-debrief` |
| Describes a round of golf played (real or simulator) | `log-round` |
| "suggest a goal for my Y" / "what should I lock in with driver" | `suggest-goals` |
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
  offline_yards: number | null; // lateral miss: negative = left, positive = right
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
    source: "lesson" | "session" | "stats" | "review" | "round";
    source_id: string;       // id into the source file
    note: string;
  }[];
}
```

Current areas: `sequencing-over-the-top`, `center-face-contact`,
`distance-ball-speed-consistency`.

### `reviews.json` — `{ reviews: Review[] }`

Structured expert analysis of swing videos/photos and range screenshots,
kept separate from lesson notes since a review can happen standalone.

```ts
{
  id: string;                // "r-YYYY-MM-DD-<letter>"
  date: string;
  type: "swing-video" | "range-screenshot";
  context: string;           // what was actually available (frame count, etc.)
  linked_lesson_id: string | null;
  linked_session_id: string | null;
  observations: { note: string; fault_area: string }[]; // fault_area = progress.json id
  verdict: string;
  cues_suggested: string[];
  drills_suggested: string[]; // drill ids
}
```

### `training_plans.json` — `{ plans: TrainingPlan[] }`

Multi-week plans above the single-session level.

```ts
{
  id: string;                // "tp-YYYY-MM-DD"
  created_date: string;
  weeks: number;
  primary_focus: string;     // progress.json area id
  secondary_focus: string | null;
  rationale: string;         // must be honest about actual evidence, see training-plan skill
  weekly_structure: {
    week: number;
    sessions_planned: number;
    theme: string;
    session_ids: string[];   // linked sessions.json ids, filled in as they happen
  }[];
  status: "active" | "completed" | "abandoned";
  review_note: string;
}
```

### `goals.json` — `{ goals: Goal[] }`

Locked-in per-club distance/dispersion targets. **Suggested by the
`suggest-goals` skill from real shot history, not manually specified** —
the user shouldn't have to invent a target number themselves. Measured
against real `stats.json` shots (both `carry_yards` and `offline_yards`
must be present on a shot for it to count toward a goal).

```ts
{
  id: string;                        // "goal-<club>", e.g. "goal-7i"
  club: string;                      // matches StatEntry.club
  target_carry_yards: number;
  carry_tolerance_yards: number;     // "on target" if |carry - target| <= this
  target_dispersion_yards: number;   // "on target" if |offline_yards| <= this
  created_date: string;
  note: string;
  status: "active" | "achieved" | "abandoned";
}
```

### `rounds.json` — `{ rounds: Round[] }`

Real or virtual/simulator rounds played, at summary level (not per-hole) —
distinct from `sessions.json`'s range practice.

```ts
{
  id: string;                 // "round-YYYY-MM-DD"
  date: string;
  type: "real" | "virtual";
  course: string;
  holes: 9 | 18;
  score: number;               // gross strokes
  score_to_par: number | null;
  note: string;
  linked_focus_areas: string[]; // progress.json ids, e.g. a range fault seen on-course
}
```

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
  last lesson (sessions, stats, reviews, rounds, goal progress, quiet
  areas) to bring to the next one; distinct from `review-progress`'s
  single-area, backward-looking summary.
- **lesson-debrief** — read-only, generates sharp questions worth asking
  the coach before a lesson wraps up (or right after), grounded in what
  was just covered; distinct from `lesson-prep` (before) and `log-lesson`
  (recording after).
- **log-round** — turn a real or virtual/simulator round recap into a
  structured entry in `rounds.json`, linking to a progress area if a range
  fault showed up (or didn't) on-course.
- **suggest-goals** — proposes a per-club distance/dispersion target from
  real `stats.json` history (never asks the user to invent a number), and
  re-evaluates existing goals as more shots accumulate — tightens
  automatically when a target is being beaten, flags (never silently
  loosens) when one isn't being hit. Tracked on `/goals` and `/bag-map`.

## Commit policy

Routine data logging (a session, a lesson note, a stats entry) can be
committed and pushed without asking each time. Confirm first for anything
large or ambiguous (schema changes, bulk edits, anything touching app code
rather than `/data`).
