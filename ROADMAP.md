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
- Coaching-quality hardening pass (3 agents: simulated the skills against real data, stress-tested the video/screenshot analysis claims, audited the memory read/write policy): gated `analyze-swing-video`'s sequencing/over-the-top checks on actually having ≥2 frames bracketing the transition (a single photo can't show motion) and rewrote the seeded review that had modeled overclaiming from one frame; fixed `analyze-range-screenshot` risking a calculated smash-factor number being presented as read off-screen; made `training-plan` state honestly when a "pattern" is really just one data point (and fixed the seeded plan's rationale, which had claimed a recurrence that didn't exist); pushed `review-progress` toward naming what a repeated drill/cue without resolution actually implies, not just counting it; gave `log-lesson` a concrete test for "genuinely new fault" vs. relabeling, and a step that checks an active training plan's stated focus against a newly-changed current focus and surfaces the conflict instead of letting them silently drift (this was already happening live in the repo's own data); documented the 15/15/35/20/10% session-block split's rationale and flagged very-low-ball-count sessions as needing a simpler structure; added `lesson-prep` (read-only, cross-area, pre-lesson digest). Not built at the time: a goal-setting mechanism, flagged as a real gap by two independent agents but out of scope for a hardening pass since it needs new schema, not just skill-instruction fixes — see Phase 4.

## Phase 4 — this batch

- `data/goals.json` + `set-goal` skill: locked-in per-club distance/dispersion targets (target carry ± tolerance, target left-right spread), measured against real `stats.json` shots via `getGoalProgress`
- `offline_yards` added to `StatEntry` (lateral miss, negative = left / positive = right) — required for dispersion tracking; `analyze-range-screenshot` and `log-session` now capture it when available
- `/goals` page: per-club dispersion scatter chart (carry vs. offline) with the target zone overlaid, and objective stats (shot count, avg carry, carry/offline standard deviation, % of shots within target) — code computes raw numbers only, no baked-in qualitative judgment
- `data/rounds.json` + `log-round` skill + `/rounds` pages (list/detail/add): real or virtual/simulator round summaries (score, course, linked focus areas), distinct from `sessions.json`'s range practice — lets on-course evidence of a fault feed back into `review-progress`/`lesson-prep`
- `lesson-debrief` skill: sharp, specific questions worth asking the coach before a lesson wraps up, distinct from `lesson-prep` (before) and `log-lesson` (recording after)
- Filled a pre-existing documentation gap: `reviews.json` and `training_plans.json` never had formal schema blocks in `CLAUDE.md`'s Data Schema section, just narrative skill descriptions — added

## Phase 5 — ideas, not committed

- Correlate stat trends against specific drills to see what's actually moving the needle
- Calendar/reminder integration for session cadence
- Multi-angle video comparison over time (same swing fault, different dates) — `analyze-swing-video` now requires ≥2 frames for any sequencing claim; this would formalize storing/comparing frame sets over time rather than one-off pairs
- Voice-memo-to-lesson-note capture right after a lesson ends
- Per-hole round detail (fairways hit, GIR, putts) if summary-level rounds turn out not to be enough signal
- A target completion date on goals, and a dashboard nudge when a goal has gone untouched (no matching stats logged) for a while
