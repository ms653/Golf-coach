import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProgressAreas,
  getProgressAreaById,
  faultFrequencyInRecentLessons,
  formatDate,
  staticParamsFor,
} from "@/lib/data";

export function generateStaticParams() {
  return staticParamsFor(getProgressAreas());
}

export default function ProgressAreaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const area = getProgressAreaById(params.id);
  if (!area) notFound();

  const freq = faultFrequencyInRecentLessons(area.id, 6);
  const sortedTimeline = [...area.timeline].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="space-y-6">
      <Link href="/progress" className="text-sm text-fairway-700 hover:underline">
        ← All areas
      </Link>

      <div className="card">
        <h1 className="text-xl font-bold">{area.name}</h1>
        <p className="mt-1 text-sm text-stone-600">{area.description}</p>
        {freq.total > 0 && (
          <p className="mt-3 text-sm">
            This fault has come up in{" "}
            <span className="font-semibold">
              {freq.count} of the last {freq.total}
            </span>{" "}
            lessons.
          </p>
        )}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-fairway-700">
        Timeline
      </h2>
      {sortedTimeline.length === 0 ? (
        <p className="text-sm text-stone-500">No notes logged for this area yet.</p>
      ) : (
        <ol className="space-y-4 border-l-2 border-fairway-200 pl-4">
          {sortedTimeline.map((entry, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-fairway-500" />
              <div className="card">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">{formatDate(entry.date)}</p>
                  <span className="badge">{entry.source}</span>
                </div>
                <p className="mt-2 text-sm text-stone-700">{entry.note}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
