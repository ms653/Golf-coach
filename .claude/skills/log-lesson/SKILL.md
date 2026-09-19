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
   date unless the user states otherwise).
3. **Fill the lesson fields**:
   - `coach`: default to the coach name already in `CLAUDE.md` unless the
     user names someone else.
   - `notes`: a concise synthesis of what was worked on and why.
   - `cues`: verbatim feel cues the coach gave (e.g. "let the arms drop"),
     not your own paraphrase.
   - `fault_focus`: match an existing id in `/data/progress.json` if the
     fault matches one already tracked; only create a new progress area
     (with a new kebab-case id, name, description, empty timeline) if this
     is genuinely a new area, not a rewording of an existing one.
   - `drills_recommended`: map named drills to ids in `/data/drills.json`
     where they match (fuzzy match on name, e.g. "step drill" →
     `step-change-of-direction`); if the coach recommended something not in
     the library, add it there first with a short description and
     reasonable `target_faults`/`clubs`, then reference its id.
4. **Update `/data/progress.json`**: append a timeline entry for the
   matched/created `fault_focus` area (`source: "lesson"`, `source_id` =
   lesson id, a one-line note capturing the cue/fault/drill takeaway).
5. **Update `CLAUDE.md`**: if this lesson's `fault_focus` differs from the
   current "Current focus" line, rewrite that section to reflect the new
   focus (name, one or two sentences of context, the cue if one was given).
   If it's the same focus continuing, leave the line as-is rather than
   restating it.
6. **Validate** all touched JSON files are well-formed before writing.
7. **Commit and push** to the current branch, e.g.
   `Log lesson: <fault_focus>, <date>`. Routine lesson logs don't need to be
   confirmed first, per this repo's commit policy — ask only if you're
   unsure whether this is a new lesson vs. an addendum to an existing one
   and guessing wrong would create a duplicate.
