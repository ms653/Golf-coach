"use client";

import { useCompleteSessionStore } from "@/store/sessionPlanner";
import DraftNotice from "@/components/DraftNotice";
import CopyJsonButton from "@/components/CopyJsonButton";
import SubmitIssueButton from "@/components/SubmitIssueButton";

export default function MarkCompleteForm({ sessionId }: { sessionId: string }) {
  const { draft, update } = useCompleteSessionStore();

  const payload = {
    session_id: sessionId,
    status: "completed",
    post_session_note: draft,
  };

  return (
    <div className="card space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-fairway-700">
        Mark Complete
      </h2>
      <DraftNotice />

      <div>
        <label className="label">How it felt</label>
        <textarea
          className="input min-h-[80px]"
          value={draft.how_it_felt}
          onChange={(e) => update({ how_it_felt: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Miss pattern that showed up</label>
        <input
          type="text"
          className="input"
          value={draft.miss_pattern}
          onChange={(e) => update({ miss_pattern: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Self-rated success (1-5)</label>
        <input
          type="number"
          min={1}
          max={5}
          className="input"
          value={draft.self_rated_success}
          onChange={(e) =>
            update({ self_rated_success: Number(e.target.value) })
          }
        />
      </div>

      <pre className="max-h-48 overflow-auto rounded-lg bg-stone-100 p-3 text-xs text-stone-700">
        {JSON.stringify(payload, null, 2)}
      </pre>

      <div className="flex flex-wrap gap-2">
        <SubmitIssueButton
          target="sessions"
          operation="update"
          id={sessionId}
          data={{ status: payload.status, post_session_note: payload.post_session_note }}
          titleLabel={`mark complete ${sessionId}`}
        />
        <CopyJsonButton value={payload} />
      </div>
    </div>
  );
}
