import Link from "next/link";
import {
  getCurrentFocus,
  getLatestCompletedSession,
  getProgressAreas,
  getStats,
  formatDate,
  faultFrequencyInRecentLessons,
  getActiveTrainingPlan,
  getCurrentPlanWeek,
} from "@/lib/data";

export default function DashboardPage() {
  const currentFocus = getCurrentFocus();
  const lastSession = getLatestCompletedSession();
  const stats = getStats();
  const recentStats = stats.slice(0, 5);
  const areas = getProgressAreas();
  const activePlan = getActiveTrainingPlan();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>

      <section className="card">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Current Focus
        </h2>
        {currentFocus ? (
          <div>
            <p className="text-lg font-medium">{currentFocus.fault_focus}</p>
            <p className="mt-1 text-sm text-stone-600">
              From lesson on {formatDate(currentFocus.date)} with{" "}
              {currentFocus.coach}
            </p>
            {currentFocus.cues.length > 0 && (
              <p className="mt-2 text-sm">
                Cue:{" "}
                {currentFocus.cues.map((c) => (
                  <span key={c} className="badge mr-1">
                    {c}
                  </span>
                ))}
              </p>
            )}
            <Link
              href={`/lessons/${currentFocus.id}`}
              className="mt-3 inline-block text-sm font-medium text-fairway-700 hover:underline"
            >
              View lesson →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-stone-500">No lessons logged yet.</p>
        )}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
            Last Session
          </h2>
          {lastSession ? (
            <div>
              <p className="font-medium">{lastSession.focus}</p>
              <p className="text-sm text-stone-600">
                {formatDate(lastSession.date)} ·{" "}
                {lastSession.ball_count_planned} balls
              </p>
              {lastSession.post_session_note.how_it_felt && (
                <p className="mt-2 text-sm italic text-stone-600">
                  &ldquo;{lastSession.post_session_note.how_it_felt}&rdquo;
                </p>
              )}
              <Link
                href={`/sessions/${lastSession.id}`}
                className="mt-3 inline-block text-sm font-medium text-fairway-700 hover:underline"
              >
                View session →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              No completed sessions yet.{" "}
              <Link href="/sessions/plan" className="text-fairway-700 hover:underline">
                Plan one
              </Link>
              .
            </p>
          )}
        </section>

        <section className="card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
            Quick Stat Trend
          </h2>
          {recentStats.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {recentStats.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span className="text-stone-600">
                    {formatDate(s.date)} · {s.club}
                  </span>
                  <span className="font-medium">
                    {s.carry_yards ?? "–"}yd carry
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-stone-500">No stats logged yet.</p>
          )}
          <Link
            href="/stats"
            className="mt-3 inline-block text-sm font-medium text-fairway-700 hover:underline"
          >
            View all stats →
          </Link>
        </section>
      </div>

      <section className="card">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Active Training Plan
        </h2>
        {activePlan ? (
          <div>
            <p className="text-lg font-medium">{activePlan.primary_focus}</p>
            <p className="mt-1 text-sm text-stone-600">
              {activePlan.rationale.length > 160
                ? `${activePlan.rationale.slice(0, 160)}…`
                : activePlan.rationale}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Week {getCurrentPlanWeek(activePlan)} of {activePlan.weeks}
            </p>
            <Link
              href={`/training-plans/${activePlan.id}`}
              className="mt-3 inline-block text-sm font-medium text-fairway-700 hover:underline"
            >
              View plan →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-stone-500">
            No active training plan.{" "}
            <Link href="/training-plans" className="text-fairway-700 hover:underline">
              View plans
            </Link>
            .
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Progress By Area
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {areas.map((area) => {
            const freq = faultFrequencyInRecentLessons(area.id, 6);
            return (
              <Link
                key={area.id}
                href={`/progress/${area.id}`}
                className="rounded-lg border border-stone-200 p-3 transition-colors hover:border-fairway-400 hover:bg-fairway-50"
              >
                <p className="font-medium">{area.name}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {area.timeline.length} note
                  {area.timeline.length === 1 ? "" : "s"}
                  {freq.total > 0 &&
                    ` · in ${freq.count} of last ${freq.total} lessons`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
