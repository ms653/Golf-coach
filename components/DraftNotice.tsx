export default function DraftNotice() {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      This site is a static export with no backend, so this form can&apos;t
      save to the repo by itself. Fill it in, then use the{" "}
      <span className="font-mono">Copy JSON</span> button and paste the
      result (or just describe what happened) to Claude in this project —
      the matching skill will write it into <span className="font-mono">/data</span> and commit it.
    </div>
  );
}
