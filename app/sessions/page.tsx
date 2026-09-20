import Link from "next/link";
import {
  getSessions,
  getActiveTrainingPlan,
  getCurrentPlanWeek,
  formatDate,
} from "@/lib/data";

export default function SessionsPage() {
  const sessions = getSessions();
  const activePlan = getActiveTrainingPlan();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Sessions</h1>
        <p className="text-sm text-stone-500">
          Tell Claude you&apos;re heading to the range to plan one.
        </p>
      </div>

      {activePlan && (
        <Link
          href={`/training-plans/${activePlan.id}`}
          className="card block hover:border-fairway-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-fairway-700">
            Active Training Plan · Week {getCurrentPlanWeek(activePlan)} of{" "}
            {activePlan.weeks}
          </p>
          <p className="mt-1 text-sm font-medium">{activePlan.primary_focus}</p>
        </Link>
      )}

      {sessions.length === 0 ? (
        <p className="text-sm text-stone-500">
          No sessions yet. Tell Claude &ldquo;let&apos;s plan today&rdquo; or
          similar and it&apos;ll build one from your recent focus and drills.
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

      <Link
        href="/training-plans"
        className="inline-block text-sm text-fairway-700 hover:underline"
      >
        View all training plans →
      </Link>
    </div>
  );
}
