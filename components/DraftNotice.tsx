export default function DraftNotice() {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      This site is a static export with no backend, so this form can&apos;t
      save to the repo by itself. Fill it in, then either click{" "}
      <span className="font-mono">Submit via GitHub Issue</span> — a GitHub
      Action reads it, updates <span className="font-mono">/data</span>, and
      closes the issue automatically (usually under a minute, then the site
      redeploys) — or use <span className="font-mono">Copy JSON</span> and
      paste the result (or just describe what happened) to Claude in this
      project, and the matching skill will write and commit it instead.
    </div>
  );
}
