"use client";

import Link from "next/link";
import { useLessonDraftStore } from "@/store/lessonDraft";
import DraftNotice from "@/components/DraftNotice";
import CopyJsonButton from "@/components/CopyJsonButton";

export default function AddLessonPage() {
  const { draft, update, reset } = useLessonDraftStore();

  const payload = {
    id: `l-${draft.date}`,
    date: draft.date,
    coach: draft.coach,
    notes: draft.notes,
    cues: draft.cues
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    fault_focus: draft.fault_focus,
    drills_recommended: draft.drills_recommended
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    video_review_notes: draft.video_review_notes,
  };

  return (
    <div className="space-y-6">
      <Link href="/lessons" className="text-sm text-fairway-700 hover:underline">
        ← All lessons
      </Link>
      <h1 className="text-2xl font-bold text-stone-900">Add Lesson</h1>
      <DraftNotice />

      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={draft.date}
              onChange={(e) => update({ date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Coach</label>
            <input
              type="text"
              className="input"
              value={draft.coach}
              onChange={(e) => update({ coach: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Fault Focus (matches a progress area id, e.g. sequencing-over-the-top)</label>
          <input
            type="text"
            className="input"
            value={draft.fault_focus}
            onChange={(e) => update({ fault_focus: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input min-h-[100px]"
            value={draft.notes}
            onChange={(e) => update({ notes: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Key cue(s), comma-separated</label>
          <input
            type="text"
            className="input"
            value={draft.cues}
            onChange={(e) => update({ cues: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Drills recommended, comma-separated drill ids</label>
          <input
            type="text"
            className="input"
            value={draft.drills_recommended}
            onChange={(e) => update({ drills_recommended: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Video review notes (from chat-based review)</label>
          <textarea
            className="input min-h-[80px]"
            value={draft.video_review_notes}
            onChange={(e) => update({ video_review_notes: e.target.value })}
          />
        </div>

        <div className="rounded-lg bg-stone-100 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Preview
          </p>
          <pre className="overflow-x-auto text-xs text-stone-700">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <div className="flex gap-2">
          <CopyJsonButton value={payload} />
          <button type="button" onClick={reset} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
