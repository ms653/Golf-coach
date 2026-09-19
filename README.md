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

Data entry happens by talking to Claude Code in this project — see the
`.claude/skills/` folder:

- `log-session` — log a completed range session
- `log-lesson` — log a lesson and update the current focus
- `plan-session` — generate a session plan from the drill library
- `review-progress` — summarize progress on a focus area

The app's `/lessons/add`, `/sessions/plan`, and "mark complete" pages are
convenience forms that produce a JSON payload to copy into chat — the
static site itself has no backend to write files.
