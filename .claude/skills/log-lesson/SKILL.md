---
name: log-lesson
description: Turn notes from a golf lesson (cues given, fault being corrected, drills recommended) into a structured entry in /data/lessons.json, update the "Current focus" line in CLAUDE.md, then commit. Use when the user shares what happened in a lesson with their coach, e.g. "had a lesson today, Adrian says I'm still coming over the top, gave me the pump drill" or shares takeaways from a chat-based swing video review that came out of a lesson.
---

# log-lesson

Converts lesson notes into a structured entry in `/data/lessons.json`, keeps
`CLAUDE.md`'s current-focus line accurate, and commits.

## When to use

The user describes a lesson — cues their coach gave, what fault was being
worked on, drills recommended — or shares takeaways from a video/screenshot
review done directly in chat (which should be logged as `video_review_notes`
on the relevant lesson, not as a new page or file).

## Steps

1. **Read `CLAUDE.md`** for the current focus, coach name, and schema, and
   read `/data/lessons.json`, `/data/drills.json`, `/data/progress.json` for
   existing ids.
2. **Determine if this is a new lesson or an addendum**: if the user is
   adding video review takeaways to a lesson that already happened (same
   day, or they reference "today's lesson" / "the lesson video"), append to
   that lesson's `video_review_notes` instead of creating a duplicate entry.
   Otherwise create a new lesson entry with id `l-YYYY-MM-DD` (use today's
   date unless the user states otherwise). If a lesson with that exact id
   already exists and this is genuinely a second, distinct lesson the same
   day, suffix the id (`l-YYYY-MM-DD-b`, `-c`, ...) rather than overwriting
   the earlier one.
3. **Fill the lesson fields**:
   - `coach`: default to the coach name already in `CLAUDE.md` unless the
     user names someone else.
   - `notes`: a concise synthesis of what was worked on and why.
   - `cues`: verbatim feel cues the coach gave (e.g. "let the arms drop"),
     not your own paraphrase.
   - `fault_focus`: match an existing id in `/data/progress.json` if the
     fault matches one already tracked; only create a new progress area
     (with a new kebab-case id, name, description, empty timeline) if this
     is genuinely a new area, not a rewording of an existing one. Concrete
     test: does this fault target a different body part, mechanic, or
     phase of the swing than any existing area's `description` actually
     says? If yes, it's new even if it sounds similar in passing (e.g.
     "grip pressure" is not "sequencing" just because both get mentioned in
     the same lesson). If you're genuinely unsure which bucket it belongs
     in, ask the user rather than guessing — silently folding a new fault
     into an existing area corrupts that area's recurrence tracking in
     `review-progress` (it'll look like the old fault recurred when it
     didn't) and is not a call to make on a coin flip.
   - `drills_recommended`: map named drills to ids in `/data/drills.json`
     where they match (fuzzy match on name, e.g. "step drill" →
     `step-change-of-direction`); if the coach recommended something not in
     the library, add it there first with a short description and
     reasonable `target_faults`/`clubs`, then reference its id.
4. **Structured video review vs. quick takeaway**: if the user describes
   what a video review actually showed (specific positions, faults spotted)
   rather than a quick one-line takeaway, that should go through
   `analyze-swing-video` instead of being crammed into `video_review_notes`
   directly — `video_review_notes` stays for quick takeaways, while
   `/data/reviews.json` (via `analyze-swing-video`) is for structured
   analysis.
5. **Update `/data/progress.json`**: append a timeline entry for the
   matched/created `fault_focus` area (`source: "lesson"`, `source_id` =
   lesson id, a one-line note capturing the cue/fault/drill takeaway).
6. **Update `CLAUDE.md`**: if this lesson's `fault_focus` differs from the
   current "Current focus" line, rewrite that section to reflect the new
   focus (name, one or two sentences of context, the cue if one was given).
   If it's the same focus continuing, leave the line as-is rather than
   restating it. Before treating a changed focus as a fresh pivot, check
   whether it's actually a *return* to a fault this user has worked on
   before (search `/data/progress.json` for an existing area with this id)
   — if so, say that explicitly ("back to sequencing after two lessons on
   center-face-contact") rather than presenting it as new; a bare overwrite
   erases that context and makes normal back-and-forth coaching look like
   directionless flip-flopping.
7. **Check for a conflicting active training plan**: if the focus actually
   changed (per step 6), also read `/data/training_plans.json`. If a plan
   with `status: "active"` has a `primary_focus`/`secondary_focus` that
   doesn't match the new `fault_focus`, don't silently leave it running —
   tell the user in this same turn, e.g. "your lesson just introduced a new
   focus, but the active N-week plan on <old focus> is still running — mark
   it completed/abandoned, or keep both going?" and act on their answer
   (update the plan's `status` and `review_note` if they say to end it).
   This is the one place two independently-written pieces of memory
   (CLAUDE.md's current focus and an active plan's stated focus) can drift
   out of sync with nothing else noticing — don't let it happen silently.
8. **Validate** all touched JSON files are well-formed before writing.
9. **Commit and push** to the current branch, e.g.
   `Log lesson: <fault_focus>, <date>`. Routine lesson logs don't need to be
   confirmed first, per this repo's commit policy — ask only if you're
   unsure whether this is a new lesson vs. an addendum to an existing one
   and guessing wrong would create a duplicate.
