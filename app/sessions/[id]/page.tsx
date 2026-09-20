import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSessions,
  getSessionById,
  formatDate,
  staticParamsFor,
} from "@/lib/data";

export function generateStaticParams() {
  return staticParamsFor(getSessions());
}

export default function SessionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = getSessionById(params.id);
  if (!session) notFound();

  return (
    <div className="space-y-6">
      <Link href="/sessions" className="text-sm text-fairway-700 hover:underline">
        ← All sessions
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{session.focus}</h1>
          <span
            className={`badge ${
              session.status === "completed" ? "" : "bg-amber-100 text-amber-800"
            }`}
          >
            {session.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {formatDate(session.date)} · {session.ball_count_planned} balls planned
        </p>
      </div>

      <div className="space-y-3">
        {session.blocks.map((block) => (
          <div key={block.name} className="card">
            <div className="flex items-center justify-between">
              <p className="font-medium">{block.name}</p>
              <span className="badge">{block.balls} balls</span>
            </div>
            <p className="mt-1 text-sm text-stone-500">Club: {block.club}</p>
            <p className="mt-2 text-sm text-stone-700">{block.focus_note}</p>
          </div>
        ))}
      </div>

      {session.status === "completed" ? (
        <div className="card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
            Post-Session Note
          </h2>
          <p className="text-sm text-stone-700">
            {session.post_session_note.how_it_felt}
          </p>
          {session.post_session_note.miss_pattern && (
            <p className="mt-2 text-sm text-stone-600">
              Miss pattern: {session.post_session_note.miss_pattern}
            </p>
          )}
          {session.post_session_note.self_rated_success !== null && (
            <p className="mt-2 text-sm text-stone-600">
              Self-rated success: {session.post_session_note.self_rated_success}/5
            </p>
          )}
        </div>
      ) : (
        <div className="card">
          <p className="text-sm text-stone-500">
            Once you&apos;ve hit balls, tell Claude how it went (how it felt,
            the miss pattern, any numbers) and it&apos;ll mark this session
            complete.
          </p>
        </div>
      )}
    </div>
  );
}
