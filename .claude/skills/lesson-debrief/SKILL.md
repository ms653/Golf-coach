---
name: lesson-debrief
description: Read-only — surfaces sharp, specific questions worth asking the coach before a lesson wraps up (or right after, if reflecting back), grounded in what was actually just covered plus outstanding history. Distinct from lesson-prep (before the lesson) and log-lesson (recording what happened after). Use when the user says something like "what should I ask Adrian before I go", "anything I'm missing before I leave", "end of lesson, what should I check", or "lesson debrief".
---

# lesson-debrief

Produces a short list of specific, worth-asking questions for the end of a
lesson — while the coach is still there, or immediately after while it's
fresh. Read-only — does not write to any files.

## When to use

The user is at the end of a lesson (or just finished one) and wants to know
what's worth clarifying before they walk away, or wants a quick reflective
check on whether anything important got left unaddressed. This is distinct
from the other two lesson-related skills:
- `lesson-prep` runs *before* a lesson (what to bring up).
- `lesson-debrief` (this one) runs *at the end of* or right after a lesson
  (what to clarify before it's too late to ask).
- `log-lesson` runs *after*, to record what actually happened.

## Steps

1. **Use what's already in this conversation first.** If the user has been
   describing today's lesson in this same chat (cues given, what was
   worked on), that's the primary source — don't ask them to repeat it.
   If nothing's been shared yet, ask what the coach covered today before
   generating questions; generic questions with no lesson content behind
   them aren't useful.
2. **Read `CLAUDE.md`** for the current focus and history, and
   `/data/progress.json` for the fuller timeline of this fault (and any
   others) — questions should connect today's lesson to what's come before,
   not treat it as an isolated event.
3. **Generate 3-5 sharp, specific questions**, not generic ones — each
   should be answerable only by the coach, and should sound like something
   worth ten more seconds of their time before they leave. Draw from these
   angles, using only the ones that actually fit what was covered today:
   - **Clarify the cue's exact feel vs. the mechanic**: if a feel-based cue
     was given (like "let the arms drop"), ask what it should feel like
     when it's working vs. when it's overdone — feel cues are easy to
     misapply between lessons with no one to correct it in the moment.
   - **Ask for a concrete checkpoint**: what should the user notice on
     their own between now and the next lesson that tells them it's
     working (or that they've drifted back to the old pattern)?
   - **Ask how this connects to (or supersedes) the previous focus**: if
     `progress.json` shows a different recent focus, ask whether that's
     considered resolved, still a factor, or was never actually the root
     cause.
   - **Ask about drill cadence**: how many reps, how often, at what point
     to add speed/pressure — vague "just practice it" advice is a common
     gap worth closing before leaving.
   - **Ask what a regression looks like**: a specific miss or feeling that
     would mean the fix isn't holding, so the user can self-diagnose
     between lessons instead of waiting to find out at the next one.
4. **Do not modify any files.** This is a live, in-the-moment prompt, not a
   record — if the user wants to log the lesson (including the coach's
   answers to these questions), hand off to `log-lesson`.

## Notes

- Quality over coverage — three sharp, specific questions beat five
  generic ones. If today's lesson genuinely doesn't leave much unclear,
  say that rather than manufacturing padding questions.
- This skill works from what's in the conversation, not from
  `lessons.json` — the lesson likely hasn't been logged yet when this runs
  (it's meant to run while the coach is still there or right after).
