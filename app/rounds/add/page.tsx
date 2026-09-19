"use client";

import Link from "next/link";
import { useState } from "react";
import DraftNotice from "@/components/DraftNotice";
import CopyJsonButton from "@/components/CopyJsonButton";
import SubmitIssueButton from "@/components/SubmitIssueButton";

interface RoundDraft {
  date: string;
  type: "real" | "virtual";
  course: string;
  holes: "9" | "18";
  score: string;
  score_to_par: string;
  note: string;
  linked_focus_areas: string;
}

const emptyDraft: RoundDraft = {
  date: new Date().toISOString().slice(0, 10),
  type: "real",
  course: "",
  holes: "18",
  score: "",
  score_to_par: "",
  note: "",
  linked_focus_areas: "",
};

export default function AddRoundPage() {
  const [draft, setDraft] = useState<RoundDraft>(emptyDraft);
  const update = (patch: Partial<RoundDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));
  const reset = () => setDraft(emptyDraft);

  const payload = {
    id: `round-${draft.date}`,
    date: draft.date,
    type: draft.type,
    course: draft.course,
    holes: Number(draft.holes),
    score: Number(draft.score) || 0,
    score_to_par:
      draft.score_to_par.trim() === "" ? null : Number(draft.score_to_par),
    note: draft.note,
    linked_focus_areas: draft.linked_focus_areas
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  };

  return (
    <div className="space-y-6">
      <Link href="/rounds" className="text-sm text-fairway-700 hover:underline">
        ← All rounds
      </Link>
      <h1 className="text-2xl font-bold text-stone-900">Add Round</h1>
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
            <label className="label">Type</label>
            <select
              className="input"
              value={draft.type}
              onChange={(e) => update({ type: e.target.value as "real" | "virtual" })}
            >
              <option value="real">Real (on-course)</option>
              <option value="virtual">Virtual (simulator)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Course / simulator</label>
          <input
            type="text"
            className="input"
            value={draft.course}
            onChange={(e) => update({ course: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Holes</label>
            <select
              className="input"
              value={draft.holes}
              onChange={(e) => update({ holes: e.target.value as "9" | "18" })}
            >
              <option value="18">18</option>
              <option value="9">9</option>
            </select>
          </div>
          <div>
            <label className="label">Score (strokes)</label>
            <input
              type="number"
              className="input"
              value={draft.score}
              onChange={(e) => update({ score: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Score to par (optional)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 6 or -2"
              value={draft.score_to_par}
              onChange={(e) => update({ score_to_par: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Notes (how it played, standout holes, faults that showed up)</label>
          <textarea
            className="input min-h-[100px]"
            value={draft.note}
            onChange={(e) => update({ note: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Related focus areas, comma-separated progress area ids (optional)</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. sequencing-over-the-top"
            value={draft.linked_focus_areas}
            onChange={(e) => update({ linked_focus_areas: e.target.value })}
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

        <div className="flex flex-wrap gap-2">
          <SubmitIssueButton
            target="rounds"
            operation="append"
            data={payload}
            titleLabel={`${draft.course || "round"} ${draft.date}`}
          />
          <CopyJsonButton value={payload} />
          <button type="button" onClick={reset} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
