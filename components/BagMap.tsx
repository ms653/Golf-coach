"use client";

import { useMemo, useState } from "react";
import { getClubDispersionAsOf, formatDate } from "@/lib/data";
import type { Goal } from "@/lib/types";

const COLORS = [
  "#356e3c", // fairway green
  "#c2410c", // burnt orange
  "#1d4ed8", // blue
  "#a21caf", // magenta
  "#b45309", // amber
  "#0f766e", // teal
  "#be123c", // rose
  "#4d7c0f", // olive
];

const WIDTH = 520;
const HEIGHT = 600;
const PAD_TOP = 20;
const PAD_BOTTOM = 60;
const PAD_LEFT = 60;
const PAD_RIGHT = 20;
const PLOT_W = WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

export default function BagMap({
  clubs,
  dates,
  goals,
}: {
  clubs: string[];
  dates: string[];
  goals: Goal[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(clubs));
  const [dateIndex, setDateIndex] = useState(Math.max(0, dates.length - 1));

  const asOfDate = dates[dateIndex] ?? null;

  const dispersions = useMemo(() => {
    if (!asOfDate) return [];
    return clubs
      .filter((c) => selected.has(c))
      .map((club) => ({
        color: COLORS[clubs.indexOf(club) % COLORS.length],
        goal: goals.find((g) => g.club === club && g.status === "active"),
        ...getClubDispersionAsOf(club, asOfDate),
      }));
  }, [clubs, selected, asOfDate, goals]);

  if (dates.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        No shots with both carry and offline distance logged yet — the bag
        map needs that to plot dispersion per club.
      </p>
    );
  }

  const maxCarryObserved = Math.max(
    100,
    ...dispersions
      .filter((d) => d.avgCarry !== null)
      .map((d) => (d.avgCarry ?? 0) + (d.carryStdDev ?? 0) + 20),
    ...goals.map((g) => g.target_carry_yards + g.carry_tolerance_yards + 20)
  );
  const maxCarry = Math.ceil(maxCarryObserved / 25) * 25;

  const maxOfflineObserved = Math.max(
    20,
    ...dispersions
      .filter((d) => d.avgOffline !== null)
      .map((d) => Math.abs(d.avgOffline ?? 0) + (d.offlineStdDev ?? 0) + 5)
  );
  const maxOffline = Math.ceil(maxOfflineObserved / 10) * 10;

  const yFor = (carry: number) =>
    PAD_TOP + PLOT_H - (carry / maxCarry) * PLOT_H;
  const xFor = (offline: number) =>
    PAD_LEFT + PLOT_W / 2 + (offline / maxOffline) * (PLOT_W / 2);

  const carryGridlines: number[] = [];
  for (let c = 0; c <= maxCarry; c += 25) carryGridlines.push(c);

  function toggleClub(club: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(club)) next.delete(club);
      else next.add(club);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {clubs.map((club) => (
          <button
            key={club}
            onClick={() => toggleClub(club)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              selected.has(club)
                ? "border-transparent text-white"
                : "border-stone-300 bg-white text-stone-500"
            }`}
            style={
              selected.has(club)
                ? { backgroundColor: COLORS[clubs.indexOf(club) % COLORS.length] }
                : undefined
            }
          >
            {club}
          </button>
        ))}
      </div>

      <div>
        <label className="label">
          As of {asOfDate ? formatDate(asOfDate) : "–"} (last {dates.length}{" "}
          practice date{dates.length === 1 ? "" : "s"} with dispersion data)
        </label>
        <input
          type="range"
          min={0}
          max={Math.max(0, dates.length - 1)}
          value={dateIndex}
          onChange={(e) => setDateIndex(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-lg rounded-lg border border-stone-200 bg-fairway-50"
      >
        {carryGridlines.map((c) => (
          <g key={c}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={yFor(c)}
              y2={yFor(c)}
              stroke="#d6d3d1"
              strokeWidth={1}
            />
            <text x={PAD_LEFT - 8} y={yFor(c) + 4} textAnchor="end" fontSize={10} fill="#78716c">
              {c}
            </text>
          </g>
        ))}

        <line
          x1={xFor(0)}
          x2={xFor(0)}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="#a8a29e"
          strokeDasharray="4 4"
        />

        <polygon
          points={`${xFor(0) - 8},${HEIGHT - PAD_BOTTOM + 12} ${xFor(0) + 8},${HEIGHT - PAD_BOTTOM + 12} ${xFor(0)},${HEIGHT - PAD_BOTTOM}`}
          fill="#57534e"
        />
        <text
          x={xFor(0)}
          y={HEIGHT - PAD_BOTTOM + 28}
          textAnchor="middle"
          fontSize={11}
          fill="#57534e"
        >
          Tee
        </text>

        {dispersions.map((d) => {
          if (d.goal) {
            const ty = yFor(d.goal.target_carry_yards);
            return (
              <line
                key={`${d.club}-target`}
                x1={xFor(0) - 14}
                x2={xFor(0) + 14}
                y1={ty}
                y2={ty}
                stroke={d.color}
                strokeWidth={2}
                strokeDasharray="2 2"
              />
            );
          }
          return null;
        })}

        {dispersions.map((d) => {
          if (d.shotCount === 0 || d.avgCarry === null || d.avgOffline === null) {
            return null;
          }
          const cx = xFor(d.avgOffline);
          const cy = yFor(d.avgCarry);
          if (d.shotCount === 1 || d.carryStdDev === null || d.offlineStdDev === null) {
            return (
              <g key={d.club}>
                <circle cx={cx} cy={cy} r={5} fill={d.color} />
                <text x={cx + 8} y={cy - 8} fontSize={11} fill={d.color} fontWeight={600}>
                  {d.club}
                </text>
              </g>
            );
          }
          const rx = Math.max(4, (d.offlineStdDev / maxOffline) * (PLOT_W / 2));
          const ry = Math.max(4, (d.carryStdDev / maxCarry) * PLOT_H);
          return (
            <g key={d.club}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={d.color}
                fillOpacity={0.22}
                stroke={d.color}
                strokeWidth={1.5}
              />
              <circle cx={cx} cy={cy} r={3} fill={d.color} />
              <text
                x={cx}
                y={cy - ry - 6}
                textAnchor="middle"
                fontSize={11}
                fill={d.color}
                fontWeight={600}
              >
                {d.club}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="grid gap-2 sm:grid-cols-2">
        {dispersions.map((d) => (
          <div key={d.club} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="font-medium">{d.club}</span>
            <span className="text-stone-500">
              {d.shotCount === 0
                ? "no data yet"
                : `${d.avgCarry?.toFixed(0)}yd avg · ${d.shotCount} shot${
                    d.shotCount === 1 ? "" : "s"
                  }`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
