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

1. **Look at what's actually there, and count it.** If the user shared image
   file(s), use the Read tool to view them directly — Claude Code's Read
   tool can read images, but it cannot play a video file; a "swing video"
   in practice means either a handful of still frames/screenshots the user
   extracted, or their own verbal description. Note explicitly how many
   distinct moments in the swing you actually have (e.g. "one frame, top of
   backswing" vs. "two frames: top of backswing and early downswing" vs. "a
   verbal description of the whole swing"). This count determines what you
   can honestly assess in step 3 — don't skip it.
2. **Read `CLAUDE.md`** for the current focus and coaching context, and
   `/data/progress.json` for the known fault areas, so the analysis is
   grounded in what's already being worked on rather than generic swing
   commentary.
3. **Analyze against two separate categories — do not blur them:**
   - **Position checks (assessable from a single still frame):** setup/
     posture, top-of-backswing position, impact position, follow-through
     position. These are fair game from even one photo, as long as that
     photo actually shows the relevant moment.
   - **Motion/sequencing checks (require comparing ≥2 frames at different
     instants, real video, or a description that itself narrates relative
     timing):** transition/sequencing (lower body vs. arms first — this
     user's known issue), tempo, swing plane/path across the swing,
     over-the-top. These are claims about what moved *before* what, or
     *how fast* — a single static frame cannot show that, no matter how
     clear the image is. If you only have one frame and no description of
     relative timing, **do not attempt these checks** — say plainly that
     assessing sequencing/tempo needs a second frame at the transition (or
     real video) and ask for one, rather than inferring motion from a
     single position.
   Within whichever checks are actually in scope, only call out what's
   genuinely visible or describable — never invent detail, and say so
   explicitly when something doesn't show (e.g. "can't tell face angle at
   impact from this angle").
4. **If nothing in scope produced a genuine observation** (e.g. one blurry
   photo that doesn't clearly show even a position), say so directly in
   chat, explain what would let you actually assess it (a clearer photo, a
   second frame at the transition, etc.), and **stop here — do not write a
   reviews.json entry for a non-observation.** A skipped review is honest;
   a forced one is a false record you'll compare future progress against.
5. **Produce a structured verdict from whatever checks were actually in
   scope**: what's good, then the 1-2 things most worth working on —
   prioritized, not a laundry list — and how those connect to existing
   `/data/progress.json` areas. If sequencing/tempo was out of scope per
   step 3, the verdict should only speak to positions, and should say
   explicitly that sequencing wasn't assessed rather than staying silent
   about the gap.
6. **Suggest 1-3 relevant drills** from `/data/drills.json` whose
   `target_faults` match, and mention explicitly if the fault maps to a cue
   the coach has already given (from recent lessons or `CLAUDE.md`).
7. **Write the result to `/data/reviews.json`** following the schema in
   `CLAUDE.md` (create the file if it's genuinely still missing, seeded with
   just this entry, matching the schema: `id` as `r-YYYY-MM-DD-<letter>`,
   `type: "swing-video"`, `observations` with `fault_area` ids, `verdict`,
   `cues_suggested`, `drills_suggested`). Only include observations you
   actually made per steps 3-5 — do not add a placeholder observation for
   a check you skipped. Append a matching timeline entry to the relevant
   area(s) in `/data/progress.json` with `source: "review"` and
   `source_id` set to the new review's id.
8. **Ask whether this should also be logged as an addendum** to a specific
   lesson or session if the user mentions one (set `linked_lesson_id` or
   `linked_session_id` accordingly); otherwise leave both `null`.
9. **Commit and push**, e.g. `Add swing video review: <date>`. Routine
   review logging doesn't need confirmation first, per this repo's commit
   policy.

## Notes

- Never invent swing faults that weren't actually observable, and never
  infer motion (sequencing, tempo, "before/after") from a single static
  frame — that is the single most common way this skill could quietly
  produce false data. A good analysis says "I can't tell X from this
  angle" or "I'd need a second frame to assess that" rather than guessing
  — this matters more than sounding comprehensive.
- This is distinct from `video_review_notes` on a lesson: that field stays
  for a quick one-line takeaway, while this skill's structured entry in
  `/data/reviews.json` is the full analysis.
