---
name: analyze-range-screenshot
description: Expert analysis of Toptracer-style range screenshots or manually reported launch monitor numbers, cross-referenced against this user's baseline and stats history rather than just reporting raw numbers. Writes new /data/stats.json entries and a matching /data/reviews.json entry. Use when the user shares a range screenshot, or types out launch monitor numbers, e.g. "here's my Toptracer screen from today" or "hit 7-iron 145 carry, 128 ball speed".
---

# analyze-range-screenshot

Extracts and interprets launch monitor numbers from a screenshot or typed
report, in context of this user's known baseline and history.

## When to use

The user shares a Toptracer-style screenshot in chat, or types out numbers
from a launch monitor/range session, and wants them logged and/or
interpreted rather than just filed away raw.

## Steps

1. **View the image** with the Read tool if one was provided, or work from
   the numbers the user typed directly.
2. **Extract per-shot or per-club numbers** as available: ball speed,
   carry, total, launch angle, apex, club, and **offline distance**
   (lateral miss left/right of the target line — Toptracer typically shows
   this directly, e.g. "6 yds R"). Record it as `offline_yards`: negative
   for left, positive for right, matching the schema in `CLAUDE.md`. Never
   fabricate a number that isn't visible or stated — leave a field `null`
   rather than guessing, and note explicitly if offline distance wasn't
   shown at all (it's required for `/data/goals.json` dispersion tracking
   to work, so its absence is worth flagging, not silently skipping).
3. **Cross-reference against the baseline in `CLAUDE.md`** (~150yd average
   7-iron carry, ~170yd on a clean strike, up to 183yd carry / 213yd total
   on a flush hit) and against `/data/stats.json` history for that club, to
   say whether this is consistent with, better than, or worse than the
   recent pattern — don't just restate the raw numbers back. If
   `/data/goals.json` has an active goal for this club, also say plainly
   whether this shot (or these shots) landed inside the target box
   (carry within tolerance AND offline within the dispersion target) —
   locked-in goals are exactly what this cross-reference is for.
4. **Flag any pattern worth a note**: high dispersion across multiple
   visible shots, or a launch angle/apex combination that looks off versus
   their usual numbers. If — and only if — both ball speed AND club speed
   are actually shown on screen, you may compute smash factor
   (ball speed ÷ club speed) as a flag; label it explicitly as calculated
   ("smash factor works out to X, calculated from the numbers shown"), not
   as something read off the screen, and never estimate club speed to back
   into this — Toptracer screens frequently don't show club speed at all,
   in which case skip this flag entirely rather than guessing at it.
5. **Write new entries to `/data/stats.json`** in the existing shape (new
   `id` following the `st-YYYY-MM-DD-<club>-<letter>` pattern). If this ties
   to a specific session, ask which one and set `session_id` accordingly;
   otherwise leave it `null`.
6. **Write a matching `/data/reviews.json` entry** with
   `type: "range-screenshot"`, `observations` referencing the relevant
   progress area(s) (e.g. `distance-ball-speed-consistency`), and a
   `verdict` summarizing the interpretation from step 3-4. Append a
   timeline entry to the matching `/data/progress.json` area with
   `source: "review"`.
7. **Check whether this club just crossed a goal-suggestion checkpoint**:
   if it now has 5+ logged shots with both `carry_yards` and
   `offline_yards` and no active goal in `/data/goals.json`, mention that
   a data-driven goal could be suggested (`suggest-goals`) rather than
   running it unprompted.
8. **Commit and push**, e.g. `Add range screenshot review: <date>`. Routine
   logging doesn't need confirmation first, per this repo's commit policy.

## Notes

- Interpretation is the point — a flat table of numbers with no comparison
  to baseline/history isn't a finished analysis.
- Never invent a shot or number that isn't actually shown/stated.
