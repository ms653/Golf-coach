"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSessionPlannerStore } from "@/store/sessionPlanner";
import { generateSessionPlan, getDrillById } from "@/lib/data";
import DraftNotice from "@/components/DraftNotice";
import CopyJsonButton from "@/components/CopyJsonButton";

export default function PlanSessionPage() {
  const { focus, ballCount, setFocus, setBallCount } = useSessionPlannerStore();

  const blocks = useMemo(
    () => generateSessionPlan(focus, ballCount),
    [focus, ballCount]
  );

  const today = new Date().toISOString().slice(0, 10);
  const payload = {
    id: `s-${today}`,
    date: today,
    focus,
    ball_count_planned: ballCount,
    status: "planned",
    blocks,
    post_session_note: {
      how_it_felt: "",
      miss_pattern: "",
      self_rated_success: null,
    },
    stats_ids: [],
  };

  return (
    <div className="space-y-6">
      <Link href="/sessions" className="text-sm text-fairway-700 hover:underline">
        ← All sessions
      </Link>
      <h1 className="text-2xl font-bold text-stone-900">Plan a Session</h1>
      <DraftNotice />

      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Focus (e.g. sequencing-over-the-top)</label>
            <input
              type="text"
              className="input"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Ball count</label>
            <input
              type="number"
              step={5}
              className="input"
              value={ballCount}
              onChange={(e) => setBallCount(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {blocks.map((block) => (
          <div key={block.name} className="card">
            <div className="flex items-center justify-between">
              <p className="font-medium">{block.name}</p>
              <span className="badge">{block.balls} balls</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">Club: {block.club}</p>
            {block.drills.length > 0 && (
              <p className="mt-1 text-sm text-stone-600">
                Drills:{" "}
                {block.drills
                  .map((id) => getDrillById(id)?.name ?? id)
                  .join(", ")}
              </p>
            )}
            <p className="mt-2 text-sm text-stone-700">{block.focus_note}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
          Session JSON
        </p>
        <pre className="mb-3 max-h-64 overflow-auto text-xs text-stone-700">
          {JSON.stringify(payload, null, 2)}
        </pre>
        <CopyJsonButton value={payload} />
      </div>
    </div>
  );
}
