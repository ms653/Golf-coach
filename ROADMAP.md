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

## Phase 3 — ideas, not committed

- Correlate stat trends against specific drills to see what's actually moving the needle
- "What changed since last lesson" auto-summary surfaced by `golf-session-kickoff`
- Calendar/reminder integration for session cadence
- Multi-angle video comparison over time (same swing fault, different dates)
- Auto-generated lesson-prep sheet before seeing the coach
- Dispersion/consistency charting beyond single best-shot numbers
- Voice-memo-to-lesson-note capture right after a lesson ends
