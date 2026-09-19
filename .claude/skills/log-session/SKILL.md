---
name: log-session
description: Turn a plain-language description of a completed range session into a structured entry in /data/sessions.json (and /data/stats.json for any numbers mentioned), then commit. Use when the user describes a range session they just finished, e.g. "hit 100 balls today, focus was sequencing, felt good but I still came over the top on the pressure test" or shares launch monitor numbers from the session.
---

# log-session

Converts a plain-language recap of a completed range session into structured
JSON in this repo, and commits it.

## When to use

The user describes a session they already did — in the moment or after the
fact — in plain language. This includes cases where they pasted a "Session
JSON" preview from the `/sessions/plan` page (a planned session) and are now
reporting it as done, or a `Mark Complete` JSON payload copied from a
session detail page.

## Steps

1. **Read `CLAUDE.md`** for the current focus and data schema, and read
   `/data/sessions.json` and `/data/drills.json` for existing ids and drill
   references.
2. **Determine whether this session already exists** as a `planned` entry in
   `sessions.json` (matching date/focus, or an explicit session id the user
   gives you — e.g. from a copied JSON payload). If so, update that entry in
   place: set `status: "completed"` and fill `post_session_note`. If not,
   create a new entry from scratch with sensible blocks (warm-up → feel work
   → drill work → transfer → pressure test → cool-down) inferred from what
   the user describes, using drill ids from `drills.json` where a
   recognizable drill is mentioned.
3. **Extract the post-session note** from the user's description:
   - `how_it_felt`: a short synthesis of how the session felt, in the user's
     own words where possible.
   - `miss_pattern`: the dominant miss they mention (e.g. "still coming over
     the top on the pressure test", "occasional heel strike"). Empty string
     if not mentioned.
   - `self_rated_success`: a 1-5 integer if the user gives or implies a
     rating; otherwise `null` — do not invent one.
4. **Extract any launch monitor numbers** the user mentions (ball speed,
   carry, total, launch angle, apex, per club) into new entries appended to
   `/data/stats.json`, each with `session_id` set to this session's id and
   an id following the `st-YYYY-MM-DD-<club>-<letter>` pattern (increment
   the letter if multiple entries share a date+club). Add each new stat
   entry's id to the session's `stats_ids` array.
5. **Update `/data/progress.json`**: if the session's focus matches an
   existing progress area, append a timeline entry
   (`source: "session"`, `source_id` = session id, a one-line `note`
   summarizing what happened for that area). Only touch the description if
   the user shares something that changes the standing understanding of the
   fault, not just routine practice notes.
6. **Check for an active training plan**: if `/data/training_plans.json`
   exists and has a plan with `status: "active"`, append this session's id
   into that plan's most recent `weekly_structure` entry's `session_ids`
   array (matching on week timing loosely — just use whichever week entry
   is most recent — no need to be precise about exact week boundaries).
   Don't silently ignore an active plan; a missing file just means there's
   no plan to update.
7. **Validate** all touched JSON files are well-formed (matching the shapes
   in `CLAUDE.md`) before writing.
8. **Commit and push** to the current branch with a concise message, e.g.
   `Log range session: <focus>, <date>`. No need to ask first for a routine
   session log — this matches this repo's commit policy in `CLAUDE.md`.
   Ask first only if the description is ambiguous enough that you're
   guessing at material details (e.g. you can't tell which planned session
   this completes, or numbers don't parse).

## Notes

- Never delete or overwrite past sessions/stats entries when logging a new
  one — always append or update the one matching entry.
- Keep `focus_note` and `how_it_felt` text terse; this is a personal log,
  not prose for someone else to read.
