---
name: analyze-swing-video
description: Expert analysis of a golf swing from video frames, photos, or the user's own description shared in chat, grounded in this user's current focus and known fault areas rather than generic swing commentary. Writes a structured entry to /data/reviews.json and updates the matching /data/progress.json timeline. Use when the user shares a swing video, photos, or clip, or describes what they saw in one, e.g. "here's my swing from today" or "I noticed my arms looked really active from the top".
---

# analyze-swing-video

Produces an expert, grounded analysis of a golf swing from video/photos or a
described swing, and records it as a structured review.

## When to use

The user shares swing video frames or photos in chat, or describes what a
video/photo showed without necessarily uploading it. This is for standalone
or ad-hoc video review — it does not require a lesson or session to exist.

## Steps

1. **Look at what's actually there.** If the user shared image file(s), use
   the Read tool to view them directly — Claude Code's Read tool can read
   images. If they only described what they saw, work from that
   description; don't ask them to re-describe something already visible in
   an image you can just look at.
2. **Read `CLAUDE.md`** for the current focus and coaching context, and
   `/data/progress.json` for the known fault areas, so the analysis is
   grounded in what's already being worked on rather than generic swing
   commentary.
3. **Analyze against a short, explicit checklist**, covering both this
   user's known issues and general fundamentals: setup/posture, takeaway,
   transition/sequencing (lower body vs. arms first — this user's known
   issue), swing plane / over-the-top check, impact position, follow-through.
   Only call out what's actually visible or describable — never invent
   detail you can't see or infer, and say so explicitly when an angle
   doesn't show something (e.g. "can't tell face angle at impact from this
   angle").
4. **Produce a structured verdict**: what's good, then the 1-2 things most
   worth working on — prioritized, not a laundry list — and how those
   connect to existing `/data/progress.json` areas.
5. **Suggest 1-3 relevant drills** from `/data/drills.json` whose
   `target_faults` match, and mention explicitly if the fault maps to a cue
   the coach has already given (from recent lessons or `CLAUDE.md`).
6. **Write the result to `/data/reviews.json`** following the schema in
   `CLAUDE.md` (create the file if it's genuinely still missing, seeded with
   just this entry, matching the schema: `id` as `r-YYYY-MM-DD-<letter>`,
   `type: "swing-video"`, `observations` with `fault_area` ids, `verdict`,
   `cues_suggested`, `drills_suggested`). Append a matching timeline entry
   to the relevant area(s) in `/data/progress.json` with `source: "review"`
   and `source_id` set to the new review's id.
7. **Ask whether this should also be logged as an addendum** to a specific
   lesson or session if the user mentions one (set `linked_lesson_id` or
   `linked_session_id` accordingly); otherwise leave both `null`.
8. **Commit and push**, e.g. `Add swing video review: <date>`. Routine
   review logging doesn't need confirmation first, per this repo's commit
   policy.

## Notes

- Never invent swing faults that weren't actually observable. A good
  analysis says "I can't tell X from this angle" rather than guessing —
  this matters more than sounding comprehensive.
- This is distinct from `video_review_notes` on a lesson: that field stays
  for a quick one-line takeaway, while this skill's structured entry in
  `/data/reviews.json` is the full analysis.
