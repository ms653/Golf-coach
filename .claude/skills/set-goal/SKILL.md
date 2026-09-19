---
name: set-goal
description: Set or update a locked-in per-club distance and dispersion target (target carry, acceptable tolerance, acceptable left/right spread) in /data/goals.json, then commit. Use when the user wants to lock in a specific number for a club, e.g. "lock in 165 with the 7-iron, within 5 yards either way" or "set a goal for my driver: 250 carry, 10 yard dispersion".
---

# set-goal

Creates or updates a per-club distance/dispersion goal in `/data/goals.json`
— the target that `/goals` and `getGoalProgress` measure real shots against.

## When to use

The user wants to lock in a specific, numeric target for a club: a carry
distance (with how much variance is acceptable) and how far left/right a
shot can miss and still count as "on target." This is a deliberate,
infrequent action — not something to fire on every mention of a number.

## Steps

1. **Read `CLAUDE.md`** for schema, and `/data/goals.json` and
   `/data/stats.json` for existing goals and the club-naming convention
   already in use (e.g. `7i`, not "7 iron" — match the existing style so
   `getGoalProgress` can actually find the matching shots).
2. **Extract the three numbers** from what the user says:
   - `target_carry_yards`: the distance to lock in.
   - `carry_tolerance_yards`: how much variance in distance still counts
     ("within 5 yards" of the target carry).
   - `target_dispersion_yards`: how far left/right still counts as on
     target. If the user gives one number for "either way" or "left or
     right" without separating distance vs. direction tolerance, ask
     which they meant rather than assuming both use the same number —
     getting this wrong quietly changes what "on target" means for every
     future shot logged.
3. **Check for an existing goal on this club**: if `/data/goals.json` has
   one with `status: "active"` for the same club, don't silently overwrite
   it — tell the user what the current goal is and ask whether this
   replaces it (mark the old one `abandoned` with a one-line `note` saying
   why) or whether they actually meant a different club.
4. **Write to `/data/goals.json`** (create the file if genuinely missing,
   though it should already exist seeded empty): `id: "goal-<club>"`,
   `created_date` = today, `status: "active"`, and a short `note` capturing
   any context the user gave (why this number, what prompted it).
5. **Validate** the JSON is well-formed before writing.
6. **Commit and push**, e.g. `Set goal: <club> <target_carry_yards>yd`.
   Setting a goal is a deliberate act, not routine logging — a quick
   confirmation of the numbers before committing is reasonable even though
   this repo's commit policy doesn't strictly require it.
7. **Point the user to `/goals`** to see it tracked against real shots once
   they've logged some — a goal with zero matching stats.json entries
   (carry AND offline_yards both present) won't show any progress yet, so
   say that plainly if it applies rather than implying it's already being
   measured.

## Notes

- This skill only sets the target — it does not itself compute progress.
  `getGoalProgress` in `lib/data.ts` and the `/goals` page do that from
  real `stats.json` entries. `review-progress` and `lesson-prep` also
  surface goal progress where relevant.
- A goal needs shots with both `carry_yards` and `offline_yards` logged to
  produce any dispersion picture — if the user has been logging stats
  without offline distance, mention that a goal with a dispersion target
  needs that field going forward (via `analyze-range-screenshot` or manual
  stats entries) to actually track it.
