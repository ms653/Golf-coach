import Link from "next/link";
import { getSessions, formatDate } from "@/lib/data";

export default function SessionsPage() {
  const sessions = getSessions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Sessions</h1>
        <Link href="/sessions/plan" className="btn-primary">
          + Plan Session
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-stone-500">
          No sessions yet.{" "}
          <Link href="/sessions/plan" className="text-fairway-700 hover:underline">
            Plan your first one
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="card block hover:border-fairway-400"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{session.focus}</p>
                <span
                  className={`badge ${
                    session.status === "completed"
                      ? ""
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-500">
                {formatDate(session.date)} · {session.ball_count_planned} balls ·{" "}
                {session.blocks.length} blocks
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
