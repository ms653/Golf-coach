# Roadmap

## Phase 1 — done

- Base tracker: 6 app pages (dashboard, lessons, sessions, stats, drills, progress)
- 4 data files: `lessons.json`, `drills.json`, `sessions.json`, `stats.json`, `progress.json`
- 4 skills: `log-session`, `log-lesson`, `plan-session`, `review-progress`
- Static export via Next.js 14, deployed to GitHub Pages on push to `main`
- Copy-JSON-to-Claude pattern for writes, since the static app can't write `/data` itself

## Phase 2 — this batch

- `data/reviews.json` — structured swing-video/screenshot analysis, separate from lesson notes
- `analyze-swing-video` and `analyze-range-screenshot` skills for expert, grounded review of media shared in chat
- `training-plan` skill + `data/training_plans.json` for multi-week plans above the single-session level
- `golf-session-kickoff` skill as a conversational front-end to `plan-session`
- Cross-references wired between all 8 skills (active plan informs sessions, reviews feed progress, etc.)
- "How to handle golf conversations" router section in `CLAUDE.md` for trigger-phrase → skill mapping
- "Submit via GitHub Issue" path on all 3 draft forms: `.github/workflows/ingest-data-issue.yml` parses the submitted payload and writes/commits it automatically, no chat required (Copy-JSON-to-Claude remains as a manual fallback)
- Hardening pass (code-review + simplify + adversarial design critique): fixed same-day id collisions silently overwriting data, a session-plan rounding bug that drifted from the requested ball count, a fragile JSON-extraction regex, a `$GITHUB_OUTPUT` corruption edge case, a `0`-vs-`null` rating bug, and an issue-URL length risk; removed 3 single-consumer Zustand stores (and the dependency) in favor of local state; centralized the duplicated `generateStaticParams` placeholder workaround and the ingest workflow's branch name. Open design questions the critique raised but weren't acted on unilaterally: whether `reviews.json` should fold into `lessons.json`, whether the GitHub Issue write-path is worth its complexity vs. a small real backend, and whether `golf-session-kickoff` should just be a section of `plan-session`.
- Coaching-quality hardening pass (3 agents: simulated the skills against real data, stress-tested the video/screenshot analysis claims, audited the memory read/write policy): gated `analyze-swing-video`'s sequencing/over-the-top checks on actually having ≥2 frames bracketing the transition (a single photo can't show motion) and rewrote the seeded review that had modeled overclaiming from one frame; fixed `analyze-range-screenshot` risking a calculated smash-factor number being presented as read off-screen; made `training-plan` state honestly when a "pattern" is really just one data point (and fixed the seeded plan's rationale, which had claimed a recurrence that didn't exist); pushed `review-progress` toward naming what a repeated drill/cue without resolution actually implies, not just counting it; gave `log-lesson` a concrete test for "genuinely new fault" vs. relabeling, and a step that checks an active training plan's stated focus against a newly-changed current focus and surfaces the conflict instead of letting them silently drift (this was already happening live in the repo's own data); documented the 15/15/35/20/10% session-block split's rationale and flagged very-low-ball-count sessions as needing a simpler structure; added `lesson-prep` (read-only, cross-area, pre-lesson digest). Not built: a goal-setting mechanism (see Phase 3) — flagged as a real gap by two independent agents but out of scope for a hardening pass since it needs new schema, not just skill-instruction fixes.

## Phase 3 — ideas, not committed

- **Goal-setting mechanism** — nothing in the schema or skills lets the user state a target (handicap, distance, a date), so `training-plan` has no external target to measure against, only recurring faults. Would need a small `data/goals.json` (target, target_date, linked focus area) and a skill/step to check progress against it, not just against what's recurring.
- Correlate stat trends against specific drills to see what's actually moving the needle
- Calendar/reminder integration for session cadence
- Multi-angle video comparison over time (same swing fault, different dates) — `analyze-swing-video` now requires ≥2 frames for any sequencing claim; this would formalize storing/comparing frame sets over time rather than one-off pairs
- Dispersion/consistency charting beyond single best-shot numbers
- Voice-memo-to-lesson-note capture right after a lesson ends
