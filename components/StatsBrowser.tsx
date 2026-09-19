"use client";

import type { StatEntry } from "@/lib/types";
import { useStatsFilterStore } from "@/store/filters";
import { formatDate } from "@/lib/data";
import StatsCharts from "@/components/StatsCharts";

interface ClubAverage {
  club: string;
  count: number;
  avg_ball_speed: number | null;
  avg_carry: number | null;
  avg_total: number | null;
  avg_launch: number | null;
}

export default function StatsBrowser({
  entries,
  clubs,
  clubAverages,
}: {
  entries: StatEntry[];
  clubs: string[];
  clubAverages: ClubAverage[];
}) {
  const { clubFilter, setClubFilter } = useStatsFilterStore();

  const filtered = clubFilter
    ? entries.filter((e) => e.club === clubFilter)
    : entries;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {clubAverages.map((c) => (
          <button
            key={c.club}
            onClick={() => setClubFilter(clubFilter === c.club ? null : c.club)}
            className={`card text-left transition-colors ${
              clubFilter === c.club ? "border-fairway-500 ring-1 ring-fairway-500" : ""
            }`}
          >
            <p className="font-medium">{c.club}</p>
            <p className="mt-1 text-xs text-stone-500">{c.count} entries</p>
            <div className="mt-2 space-y-0.5 text-sm text-stone-700">
              <p>Avg ball speed: {c.avg_ball_speed ?? "–"} mph</p>
              <p>Avg carry: {c.avg_carry ?? "–"} yd</p>
              <p>Avg total: {c.avg_total ?? "–"} yd</p>
            </div>
          </button>
        ))}
      </div>

      <StatsCharts entries={filtered} />

      <div className="card overflow-x-auto">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-wide text-fairway-700">
            Raw Entries
          </p>
          {clubFilter && (
            <button
              onClick={() => setClubFilter(null)}
              className="text-xs text-fairway-700 hover:underline"
            >
              Clear filter ({clubFilter})
            </button>
          )}
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase text-stone-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Club</th>
              <th className="py-2 pr-4">Ball Speed</th>
              <th className="py-2 pr-4">Carry</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">Launch</th>
              <th className="py-2 pr-4">Apex</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-stone-100">
                <td className="py-2 pr-4">{formatDate(e.date)}</td>
                <td className="py-2 pr-4">{e.club}</td>
                <td className="py-2 pr-4">{e.ball_speed_mph ?? "–"}</td>
                <td className="py-2 pr-4">{e.carry_yards ?? "–"}</td>
                <td className="py-2 pr-4">{e.total_yards ?? "–"}</td>
                <td className="py-2 pr-4">{e.launch_angle_deg ?? "–"}</td>
                <td className="py-2 pr-4">{e.apex_ft ?? "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-4 text-sm text-stone-500">No entries match that filter.</p>
        )}
      </div>
    </div>
  );
}
