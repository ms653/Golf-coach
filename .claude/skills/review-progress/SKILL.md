---
name: review-progress
description: Summarize progress for a given focus area by reading its timeline of notes and stats in /data/progress.json, /data/lessons.json, /data/sessions.json and /data/stats.json, and highlighting trends or recurring issues. Use when the user asks how a specific fault/area is trending, e.g. "how's my sequencing coming along" or "am I still coming over the top as much".
---

# review-progress

Reads a focus area's timeline and related data and produces a plain-language
progress summary. Read-only — does not write to any files.

## When to use

The user asks about progress on a specific named area (or something that
maps to one), or asks a general "how am I doing" question that should be
answered per-area rather than as a flat stats dump.

## Steps

1. **Read `/data/progress.json`** and find the matching area (fuzzy match
   on name/id/description if the user's wording doesn't match exactly — if
   truly ambiguous or no area exists, say so and list the current areas
   rather than guessing).
2. **Read the area's `timeline`**, sorted chronologically, and cross-reference
   `source_id`s against `/data/lessons.json` and `/data/sessions.json` for
   fuller context where the timeline note is terse.
3. **Read `/data/stats.json`** for any entries relevant to this area (e.g.
   via linked sessions in `stats_ids`, or entries whose `note`/date lines up
   with the area's timeline) to ground qualitative notes in numbers where
   possible.
4. **Read `/data/reviews.json`** for entries whose `observations` include a
   matching `fault_area`, and fold their `verdict`/`cues_suggested` into the
   summary alongside lessons/sessions/stats. If `/data/training_plans.json`
   has a plan with `status: "active"`, mention its stated goal
   (`primary_focus`/`rationale`) for context when summarizing, if relevant.
5. **Compute recurrence**: how many of the last 6 lessons had this as
   `fault_focus` (same logic as the dashboard/progress pages), and whether
   that frequency is rising, flat, or falling over the full lesson history,
   not just the last 6.
6. **Summarize**, covering:
   - How long this has been a tracked focus (first timeline entry to most
     recent).
   - What's been tried (drills, cues) and what recurs across entries.
   - Any measurable change reflected in stats (e.g. consistency of a
     miss, or numbers trending in the right direction).
   - A clear verdict: improving, plateaued, or worsening — don't hedge past
     what the data actually shows, and say plainly when there isn't enough
     data yet to call a trend.
7. **Do not modify any files.** If the user then asks to log something new
   based on this review, hand off to `log-lesson` or `log-session` rather
   than writing directly.
