---
name: lesson-prep
description: Produces a condensed, cross-area summary of everything since the last lesson — what was practiced, what changed, what's still recurring, and specific things worth raising with the coach — so the user can walk into their next lesson prepared instead of starting from scratch. Read-only, does not write to any files. Use when the user says something like "prep me for my lesson", "what should I tell Adrian", "getting ready to see my coach", or "what's changed since last time".
---

# lesson-prep

Reads everything logged since the last lesson and produces a one-page-style
digest to bring into the next one. Read-only — does not write to any files.

## When to use

The user is about to see their coach and wants a condensed "here's what's
happened" summary, or asks what's worth raising. This is cross-area and
forward-looking (prepping for the *next* lesson), unlike `review-progress`
which is per-area and backward-looking (how has *this one thing* trended).

## Steps

1. **Read `CLAUDE.md`** for the current focus and coach name, then
   `/data/lessons.json` to find the most recent lesson — everything from
   here on covers the window since that date.
2. **Read `/data/sessions.json`** for completed sessions since the last
   lesson: ball counts, `post_session_note` (how it felt, miss pattern,
   self-rated success). Look for a consistent miss pattern across sessions,
   not just the most recent one.
3. **Read `/data/stats.json`** for numbers logged in that window, and
   compare against the user's baseline in `CLAUDE.md` and their prior
   history — has anything measurably moved (carry consistency, ball speed),
   or is it too little data to say?
4. **Read `/data/reviews.json`** for any video/screenshot reviews in that
   window, including their `verdict` and whether the issue found matches
   or differs from what the coach originally flagged.
5. **Read `/data/progress.json`** for every area (not just the current
   focus) — note anything that's gone quiet (no timeline entries since the
   last lesson, meaning it wasn't practiced) as well as what was actively
   worked on.
6. **Read `/data/training_plans.json`** for the active plan, if any — is it
   on schedule (sessions_planned vs. actual session_ids per week), and did
   it survive the whole window, or was something abandoned/changed?
7. **Read `/data/rounds.json`** for any real/virtual rounds since the last
   lesson — a fault showing up (or not) on-course is exactly the kind of
   thing worth telling the coach, since it's evidence of whether range work
   is transferring.
8. **Read `/data/goals.json`** — if there's an active per-club distance/
   dispersion goal, briefly note progress against it (use `getGoalProgress`
   logic: shots within target vs. total) so locked-in goals stay visible at
   lesson time, not just on the `/goals` page.
9. **Produce the digest**, structured as:
   - What's been practiced since the last lesson (session count, ball
     counts, main drills used).
   - What changed — genuine signal only (a real stat trend, a resolved or
     persistent miss pattern), not a restatement of the plan.
   - What's still unresolved or recurring, named plainly, not softened.
   - 2-4 specific, concrete things worth raising with the coach — a
     specific miss, a specific drill that didn't feel like it worked, a
     specific number — not generic "let's see how it's going."
   - If an area logged in `progress.json` has gone quiet since the last
     lesson, say so — the coach should know it wasn't practiced, not
     assume it improved because nothing was reported.
10. **Do not modify any files.** If the user asks to act on something this
   surfaces (e.g. abandon a stale plan, log something missed), hand off to
   the relevant skill (`training-plan`, `log-session`) rather than writing
   directly.

## Notes

- The value of this skill is what it does NOT restate — a lesson-prep
  summary that's just a longer version of `review-progress` for every area
  in sequence isn't useful; the coach doesn't need a data dump, they need
  the 3-4 things worth ten minutes of their time.
- If nothing meaningful has happened since the last lesson (no sessions
  logged, no reviews, no stats), say that plainly rather than padding out a
  summary — "nothing's been logged since your last lesson" is itself useful
  information for the coach to have.
