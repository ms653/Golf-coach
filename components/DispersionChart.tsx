"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { GoalProgress } from "@/lib/data";
import { formatDate } from "@/lib/data";

export default function DispersionChart({
  progress,
}: {
  progress: GoalProgress;
}) {
  const { goal, shots } = progress;

  if (shots.length === 0) {
    return (
      <p className="text-sm text-stone-500">
        No shots with both carry and offline distance logged for {goal.club}{" "}
        yet — dispersion needs both numbers per shot.
      </p>
    );
  }

  const withinShots = shots
    .filter((s) => s.withinTarget)
    .map((s) => ({ x: s.offline, y: s.carry, date: s.date }));
  const outsideShots = shots
    .filter((s) => !s.withinTarget)
    .map((s) => ({ x: s.offline, y: s.carry, date: s.date }));

  const maxOffline = Math.max(
    goal.target_dispersion_yards,
    ...shots.map((s) => Math.abs(s.offline))
  );
  const xDomain: [number, number] = [-maxOffline * 1.2 - 1, maxOffline * 1.2 + 1];
  const yMin = Math.min(
    goal.target_carry_yards - goal.carry_tolerance_yards,
    ...shots.map((s) => s.carry)
  );
  const yMax = Math.max(
    goal.target_carry_yards + goal.carry_tolerance_yards,
    ...shots.map((s) => s.carry)
  );
  const yPad = Math.max(5, (yMax - yMin) * 0.15);
  const yDomain: [number, number] = [yMin - yPad, yMax + yPad];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis
          type="number"
          dataKey="x"
          name="Offline"
          unit="yd"
          domain={xDomain}
          tick={{ fontSize: 11 }}
          label={{ value: "Left  ←  Offline (yd)  →  Right", position: "bottom", fontSize: 11 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Carry"
          unit="yd"
          domain={yDomain}
          tick={{ fontSize: 11 }}
          label={{ value: "Carry (yd)", angle: -90, position: "insideLeft", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value: number, name: string) => [`${value}yd`, name]}
          labelFormatter={() => ""}
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const p = payload[0].payload as { x: number; y: number; date: string };
            return (
              <div className="rounded border border-stone-200 bg-white px-2 py-1 text-xs shadow">
                <p className="font-medium">{formatDate(p.date)}</p>
                <p>Carry: {p.y}yd</p>
                <p>Offline: {p.x}yd</p>
              </div>
            );
          }}
        />
        <ReferenceArea
          x1={-goal.target_dispersion_yards}
          x2={goal.target_dispersion_yards}
          y1={goal.target_carry_yards - goal.carry_tolerance_yards}
          y2={goal.target_carry_yards + goal.carry_tolerance_yards}
          fill="#478a4f"
          fillOpacity={0.12}
          stroke="#478a4f"
          strokeOpacity={0.4}
        />
        <ReferenceLine x={0} stroke="#a8a29e" strokeDasharray="4 4" />
        <ReferenceLine
          y={goal.target_carry_yards}
          stroke="#a8a29e"
          strokeDasharray="4 4"
        />
        <Scatter data={withinShots} fill="#356e3c" />
        <Scatter data={outsideShots} fill="#c2410c" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
