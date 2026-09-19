"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { StatEntry } from "@/lib/types";
import { formatDate } from "@/lib/data";

export default function StatsCharts({ entries }: { entries: StatEntry[] }) {
  const chartData = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      date: formatDate(e.date),
      ball_speed: e.ball_speed_mph,
      carry: e.carry_yards,
      total: e.total_yards,
    }));

  if (chartData.length === 0) {
    return <p className="text-sm text-stone-500">No stats to chart yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="card">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Ball Speed (mph)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="ball_speed"
              stroke="#356e3c"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Carry vs Total (yards)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="carry"
              name="Carry"
              stroke="#356e3c"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="#93c398"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
