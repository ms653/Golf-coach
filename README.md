# Golf Progress Tracker

A personal app that connects lessons → practice → results over time.
Next.js 14 (App Router, static export), Tailwind CSS, Zustand. Data lives
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

The app's `/lessons/add`, `/sessions/plan`, and "mark complete" forms each
produce a JSON payload with two ways to actually persist it, since the
static site itself has no backend to write files:

- **Submit via GitHub Issue** — opens a pre-filled issue;
  `.github/workflows/ingest-data-issue.yml` parses it, writes the matching
  `/data/*.json` file, commits, pushes, and closes the issue automatically.
  Requires Settings → Actions → General → Workflow permissions set to "Read
  and write permissions" (one-time).
- **Copy JSON → Claude** — paste the payload (or just describe what
  happened) to Claude Code in this project; see `.claude/skills/`:
  - `log-session` — log a completed range session
  - `log-lesson` — log a lesson and update the current focus
  - `plan-session` — generate a session plan from the drill library
  - `review-progress` — summarize progress on a focus area
  - `golf-session-kickoff`, `analyze-swing-video`, `analyze-range-screenshot`,
    `training-plan` — see `CLAUDE.md` for the full skill set and the
    conversational trigger-phrase table.
