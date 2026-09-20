# Golf Progress Tracker

A personal app that connects lessons → practice → results over time.
Next.js 14 (App Router, static export), Tailwind CSS. Data lives
in `/data/*.json`, edited by Claude Code and committed to this repo — no
external database, no login.

See `CLAUDE.md` for the full context, data schema, and current focus.

## Local development

```bash
npm install
npm run dev
```

## Build (static export)

```bash
npm run build
```

Outputs to `/out`. For a GitHub Pages build with the correct base path:

```bash
GITHUB_PAGES=true npm run build
```

## Hosting

`.github/workflows/deploy.yml` builds and deploys `/out` to GitHub Pages on
every push to `main`. In the repo's Settings → Pages, set the source to
"GitHub Actions".

## Logging data

The app is a read-only dashboard — there are no forms. All writes to
`/data/*.json` happen by chatting with Claude (this project, or Claude Code
with this repo open): describe a lesson, a session, or a round, or share a
video/screenshot, and the matching skill in `.claude/skills/` writes and
commits it:

- `log-session` — log a completed range session
- `log-lesson` — log a lesson and update the current focus
- `plan-session` / `golf-session-kickoff` — generate a session plan from the
  drill library
- `review-progress` — summarize progress on a focus area
- `analyze-swing-video`, `analyze-range-screenshot`, `training-plan`,
  `log-round`, `suggest-goals`, `lesson-prep`, `lesson-debrief` — see
  `CLAUDE.md` for the full skill set and the conversational trigger-phrase
  table.
