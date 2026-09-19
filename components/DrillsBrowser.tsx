"use client";

import type { Drill } from "@/lib/types";
import { useDrillFilterStore } from "@/store/filters";

export default function DrillsBrowser({
  drills,
  faults,
}: {
  drills: Drill[];
  faults: string[];
}) {
  const { faultFilter, setFaultFilter } = useDrillFilterStore();

  const filtered = faultFilter
    ? drills.filter((d) => d.target_faults.includes(faultFilter))
    : drills;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFaultFilter(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            faultFilter === null
              ? "bg-fairway-600 text-white"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All
        </button>
        {faults.map((fault) => (
          <button
            key={fault}
            onClick={() => setFaultFilter(fault)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              faultFilter === fault
                ? "bg-fairway-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {fault}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((drill) => (
          <div key={drill.id} className="card">
            <p className="font-medium">{drill.name}</p>
            <p className="mt-1 text-sm text-stone-600">{drill.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {drill.target_faults.map((f) => (
                <span key={f} className="badge">
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Clubs: {drill.clubs.join(", ")}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-stone-500">No drills match that filter.</p>
        )}
      </div>
    </div>
  );
}
