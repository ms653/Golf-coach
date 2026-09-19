---
name: log-round
description: Turn a plain-language description of a real or virtual/simulator round into a structured entry in /data/rounds.json, then commit. Use when the user describes a round of golf they played, e.g. "played 18 at the club today, shot 88" or "did a simulator round on GSPro, shot +9, over-the-top showed up on a few tee shots".
---

# log-round

Converts a round recap (real or virtual) into a structured entry in
`/data/rounds.json`, distinct from `log-session`'s range-practice sessions.

## When to use

The user describes a round of golf they actually played — on a real course
or a simulator/virtual round — as opposed to a range practice session.
Score is the main signal; this is round-summary level, not per-hole detail.

## Steps

1. **Read `CLAUDE.md`** for schema and current focus, and read
   `/data/rounds.json` and `/data/progress.json` for existing ids and focus
   areas.
2. **Determine `type`**: `"real"` for an actual course, `"virtual"` for a
   simulator (GSPro, Trackman, Toptracer simulator bay, etc.) — ask if
   genuinely ambiguous from what the user said.
3. **Fill the round fields**:
   - `id`: `round-YYYY-MM-DD` (today's date unless stated otherwise); if a
     round with that id already exists and this is a genuinely distinct
     second round the same day, suffix it (`-b`, `-c`, ...) rather than
     overwriting.
   - `course`: the course or simulator name as given; don't invent one if
     not mentioned — use a short description instead (e.g. "local course").
   - `holes`: 9 or 18.
   - `score`: gross strokes.
   - `score_to_par`: only if the user states or clearly implies it (e.g.
     "shot 88 on a par 72" → +16); leave `null` rather than calculating
     from an assumed par you weren't told.
   - `note`: how it played — standout holes, misses, anything relevant to
     the current focus. This is where the real coaching value lives; don't
     leave it as just a restated score.
   - `linked_focus_areas`: if the user mentions a known fault showing up
     on-course (e.g. "still came over the top off a few tees"), match it to
     an existing `/data/progress.json` area id — this is valuable signal
     that a range fault is or isn't transferring to real play. Leave empty
     if nothing specific was mentioned.
4. **If a focus area is linked**, append a timeline entry to that area in
   `/data/progress.json` with `source: "round"`, `source_id` = the round
   id, and a one-line note — on-course evidence of a fault (or its absence)
   is exactly the kind of signal `review-progress` should be able to see
   alongside range data.
5. **Validate** the JSON is well-formed before writing.
6. **Commit and push**, e.g. `Log round: <course>, <date>`. Routine round
   logging doesn't need confirmation first, per this repo's commit policy.

## Notes

- This is round-summary level by design (score, not per-hole detail) — if
  the user wants to log something at the shot level from a round (a
  specific miss with numbers), that's still just a note here, not a
  `stats.json` entry, since `stats.json` is range/launch-monitor data.
- The real value of round data is checking whether range progress is
  transferring to the course — `review-progress` and `lesson-prep` should
  read this alongside session/stats data, not treat it as a separate silo.
