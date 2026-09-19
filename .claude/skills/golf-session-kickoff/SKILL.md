---
name: golf-session-kickoff
description: Conversational front-end for planning today's range session — reads recent context (current focus, last lesson, last completed session, any active training plan) and asks a couple of quick questions before generating a plan, instead of requiring the user to fill out the /sessions/plan page. Use when the user says something like "heading to the range", "about to practice", "got an hour to hit balls", or "let's plan today's session".
---

# golf-session-kickoff

A conversational starting point for a range session, for when the user
mentions they're about to practice rather than using the `/sessions/plan`
app page directly.

## When to use

The user says something conversational that signals they're about to
practice — "heading to the range", "about to go hit balls", "got an hour
today", "let's plan today's session" — without necessarily naming a focus
area or ball count up front.

## Steps

1. **Gather context before asking anything**: read `CLAUDE.md` for the
   current focus, the most recent entry in `/data/lessons.json`, the most
   recent `status: "completed"` entry in `/data/sessions.json` (and its
   `post_session_note`), and check `/data/training_plans.json` for a plan
   with `status: "active"`. That file may not exist yet — treat a missing
   file or no active plan as a normal case, not an error, and just proceed
   without it.
2. **Ask 1-2 quick clarifying questions**, no more: how much time/how many
   balls they have today, and whether anything specific the coach said
   recently (or how the last session felt) should shape today's session.
   Don't re-ask anything you can already infer from the context you just
   read.
3. **Generate the plan** using the same six-block approach as `plan-session`
   (warm-up / feel work / drill work / transfer / pressure test / cool-down,
   roughly 15/15/35/20/10/5% of the ball count), pulling drills from
   `/data/drills.json` relevant to the resolved focus. If there's an active
   training plan, let its current week's `theme` inform the focus and drill
   choice rather than ignoring it.
4. **Persist the plan**: then follow the persist steps in the
   `plan-session` skill (write a new `planned` entry to
   `/data/sessions.json` with a fresh `s-YYYY-MM-DD` id, commit and push) —
   don't duplicate that logic here.
5. **Tell the user** the block-by-block plan in plain text, and let them
   know you'll be ready to log the results with `log-session` once they're
   done hitting balls.

## Notes

- This skill only plans the session — it doesn't log results. Hand off to
  `log-session` when the user reports back.
- Keep the clarifying questions short; this is meant to feel like a quick
  chat before heading out, not a form.
