---
name: training-plan
description: Generate and maintain a multi-week training plan grounded in recurring patterns across lessons/progress rather than just the user's stated focus, writing to /data/training_plans.json. Use when the user asks for a plan spanning multiple sessions, e.g. "give me a plan for the next few weeks" or "what should I work on until my next lesson".
---

# training-plan

Generates and maintains a multi-week training plan — distinct from a single
`plan-session` session plan.

## When to use

The user asks for something that spans multiple sessions/weeks rather than
a single range trip: "give me a plan for the next few weeks", "what should
I work on until my next lesson", "build me a training plan".

## Steps

1. **Read `CLAUDE.md`, `/data/lessons.json`, `/data/progress.json`, and
   `/data/sessions.json`** to find what's actually recurring — e.g.
   "sequencing has come up in 4 of the last 6 lessons" — rather than just
   taking the user's word for the focus.
2. **Default to 2-4 weeks** unless the user specifies a length. Pick a
   `primary_focus` (and optional `secondary_focus`) grounded in that
   recurrence data, and write a short `rationale` explaining the choice —
   **but only claim a pattern you can actually count.** If the fault has
   genuinely come up in multiple lessons, say so with the real count ("has
   come up in 3 of the last 4 lessons"). If it's the only lesson on record
   so far, say that honestly instead ("this is the current coaching focus
   from the most recent lesson; not enough lesson history yet to call it a
   recurring pattern — the plan front-loads foundational work on it because
   it's what's live right now, not because it's proven persistent"). A
   confident-sounding rationale that overstates thin evidence is worse than
   a plain one that's accurate — `review-progress` and future you will read
   this `rationale` field as if it were a factual claim about the data.
3. **Build `weekly_structure`** with a `theme` per week that progresses
   logically — e.g. week 1: isolate the feel with slow drill reps; week 2:
   add speed/transfer; week 3: pressure-test on the course or in a
   simulated format; week 4: consolidate + reassess. Themes should
   reference actual drills from `/data/drills.json` by name, not just
   restate the focus area.
4. **Check for an existing active plan first**: if `/data/training_plans.json`
   already has a plan with `status: "active"` when a new one is requested,
   ask the user whether to mark the old one `completed` or `abandoned`
   (with a `review_note`) before starting the new one — don't silently end
   up with two active plans, and don't abandon an existing active plan
   without the user having said to.
5. **Write to `/data/training_plans.json`** (create it if missing, seeded
   with just this plan) with a new `id` (`tp-YYYY-MM-DD`), `status: "active"`,
   and `review_note: ""`. Commit and push, e.g.
   `Add training plan: <primary_focus>, <weeks>w`. Routine plan creation
   doesn't need confirmation first — only ask before abandoning an existing
   active plan the user didn't explicitly ask to end.
6. **Reply** with the week-by-week plan and rationale in plain text.

## Notes

- This skill doesn't log session results itself — `log-session` is
  responsible for appending a completed/updated session's id into the
  active plan's current week's `session_ids` array when one exists. This
  cross-reference is what keeps an active plan's progress up to date
  without this skill needing to run again.
- Reassessing or closing out a plan (marking it `completed`/`abandoned`
  with a `review_note`) happens here, typically triggered by the user
  starting a new plan or asking to wrap up the current one.
