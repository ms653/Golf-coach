import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRounds,
  getRoundById,
  getProgressAreaById,
  formatDate,
  staticParamsFor,
} from "@/lib/data";

export function generateStaticParams() {
  return staticParamsFor(getRounds());
}

export default function RoundDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const round = getRoundById(params.id);
  if (!round) notFound();

  return (
    <div className="space-y-6">
      <Link href="/rounds" className="text-sm text-fairway-700 hover:underline">
        ← All rounds
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{round.course}</h1>
          <span className="badge">{round.type}</span>
        </div>
        <p className="mt-1 text-sm text-stone-500">{formatDate(round.date)}</p>

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Score
        </h2>
        <p className="mt-1 text-sm text-stone-700">
          {round.holes} holes · {round.score} strokes
          {round.score_to_par !== null &&
            ` (${round.score_to_par > 0 ? "+" : ""}${round.score_to_par} to par)`}
        </p>

        {round.note && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Notes
            </h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
              {round.note}
            </p>
          </>
        )}

        {round.linked_focus_areas.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Related Focus Areas
            </h2>
            <div className="mt-1 flex flex-wrap gap-1">
              {round.linked_focus_areas.map((id) => {
                const area = getProgressAreaById(id);
                return area ? (
                  <Link key={id} href={`/progress/${id}`} className="badge">
                    {area.name}
                  </Link>
                ) : (
                  <span key={id} className="badge">
                    {id}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
