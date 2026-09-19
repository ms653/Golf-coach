---
name: suggest-goals
description: Proposes locked-in per-club distance and dispersion targets from this user's own real stats.json history — the user shouldn't have to invent numbers — and re-evaluates existing goals over time, tightening them when performance has moved past the current target and flagging (never silently loosening) when a target isn't being hit. Writes to /data/goals.json, then commits. Use when the user asks to set/suggest a goal for a club, when a club crosses the minimum-shot threshold for a first-time suggestion, or periodically alongside review-progress/lesson-prep when an active goal exists.
---

# suggest-goals

Computes and proposes per-club distance/dispersion targets from real shot
data, and revisits existing goals as more shots accumulate. The user
states a club (or asks generally); this skill supplies the numbers — it
does not ask the user to state a target distance or tolerance themselves.

## When to use

- The user asks to set a goal for a club without giving specific numbers
  ("suggest a goal for my 7-iron", "what should I lock in with driver").
- A club just crossed the minimum-shot threshold (5) for its first
  suggestion — proactively offer this after logging stats via
  `log-session` or `analyze-range-screenshot` rather than waiting to be
  asked.
- `review-progress` or `lesson-prep` is running and an active goal exists
  for a relevant club — check whether it's due for re-evaluation (see
  Step 3) and mention it if so.

## Steps

1. **Read `CLAUDE.md`** for schema and the club-naming convention, and
   `/data/goals.json` and `/data/stats.json` for existing goals and shot
   history.
2. **No active goal exists for this club — propose a new one.** Require at
   least 5 shots with both `carry_yards` and `offline_yards` present; if
   fewer exist, say so plainly and don't guess a target from too little
   data — offer to suggest one once there's enough.
   - Take the trailing window: the most recent 15 such shots, or all of
     them if fewer than 15.
   - `target_carry_yards` = mean carry over the window, rounded to the
     nearest 5.
   - `carry_tolerance_yards` = 80% of the carry standard deviation over
     the window, rounded to the nearest 5, floored at 5.
   - `target_dispersion_yards` = 80% of the offline standard deviation
     over the window, rounded to the nearest 5, floored at 5.
   - This is "lock in what you're already doing, tightened as a stretch"
     — not an arbitrary or aspirational-only number. State the actual
     mean/stddev behind the suggestion when presenting it, and the shot
     count it's based on.
   - Write to `/data/goals.json` with `id: "goal-<club>"`, `status: "active"`,
     `created_date` = today, and a `note` recording the derivation (window
     size, mean, stddev) so it's traceable later, not a black box.
3. **An active goal already exists — check whether it's due for
   re-evaluation**, using the *trailing* window (most recent shots as of
   today), not all-time history:
   - **Tightening** (good problem to have): if the last 10 shots (need at
     least 10) have 8 or more landing inside the current target box
     (within `carry_tolerance_yards` of `target_carry_yards` AND
     `|offline_yards|` within `target_dispersion_yards`), propose
     tightening: new tolerance and dispersion = 75% of the current values
     (rounded to nearest 5, floored at 5). If the trailing-10 average
     carry has drifted more than 5 yards from `target_carry_yards`,
     propose moving the target to the new average (rounded to nearest 5)
     as well. This can proceed without asking first — tightening a target
     you're beating is not a change the user needs to approve line by
     line, though say what changed and why.
   - **Flag, don't loosen** (a real problem, needs a decision): if the
     last 15 shots (need at least 15) have 3 or fewer landing inside the
     target box, tell the user directly — name the club, the target, and
     the actual hit rate — and ask whether to relax the target, keep it as
     a stretch goal, or whether something else explains it (an active
     fault being worked on, an equipment change). **Never loosen a target
     without an explicit answer** — the entire point of locking one in is
     that it doesn't quietly get easier when it's missed.
   - **Neither threshold met**: don't change anything; if asked, just
     report current status via `getGoalProgress`-equivalent numbers.
   - Update the *existing* goal entry in place (same `id`) rather than
     creating a duplicate; append to its `note` describing what changed
     and when, don't overwrite the original derivation.
4. **Validate** the JSON is well-formed before writing.
5. **Commit and push** only when something was actually created or
   changed, e.g. `Suggest goal: <club> <target>yd` or
   `Tighten goal: <club>`. A pure status report with no change writes
   nothing and needs no commit.
6. **Point to `/bag-map` and `/goals`** to see it visualized once there's
   shot data behind it.

## Notes

- This skill supplies the numbers; it doesn't ask the user to invent a
  target distance or tolerance themselves — the whole point is removing
  that guesswork by grounding it in their own real shot history.
- A dispersion target needs `offline_yards` logged, not just `carry_yards`
  — if the user's been logging stats without it, say so, since the goal
  can't measure the direction half of "locked in" without that field.
- Do not run this unprompted on every single stats entry — check at
  natural checkpoints (first time crossing 5 shots, then roughly every 10
  shots after, or when `review-progress`/`lesson-prep` already has reason
  to look at this club) rather than after every logged shot.
