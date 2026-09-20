import Link from "next/link";
import { getRounds, formatDate } from "@/lib/data";

export default function RoundsPage() {
  const rounds = getRounds();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Rounds</h1>
        <p className="text-sm text-stone-500">
          Tell Claude about a round to log it.
        </p>
      </div>

      {rounds.length === 0 ? (
        <p className="text-sm text-stone-500">
          No rounds logged yet. Tell Claude about a real or simulator round
          you played and it&apos;ll show up here.
        </p>
      ) : (
        <ol className="space-y-4 border-l-2 border-fairway-200 pl-4">
          {rounds.map((round) => (
            <li key={round.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-fairway-500" />
              <Link
                href={`/rounds/${round.id}`}
                className="card block hover:border-fairway-400"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">
                    {formatDate(round.date)} · {round.course}
                  </p>
                  <span className="badge">{round.type}</span>
                </div>
                <p className="mt-2 text-sm text-stone-700">
                  {round.holes} holes · {round.score} strokes
                  {round.score_to_par !== null &&
                    ` (${round.score_to_par > 0 ? "+" : ""}${round.score_to_par})`}
                </p>
                {round.note && (
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                    {round.note}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
