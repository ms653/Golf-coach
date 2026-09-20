import Link from "next/link";
import {
  getCurrentFocus,
  getSessions,
  getLatestCompletedSession,
  getProgressAreas,
  getGoals,
  getGoalProgress,
  formatDate,
  faultFrequencyInRecentLessons,
  getActiveTrainingPlan,
  getCurrentPlanWeek,
} from "@/lib/data";

export default function DashboardPage() {
  const currentFocus = getCurrentFocus();
  const activePlan = getActiveTrainingPlan();
  const nextSession = getSessions().find((s) => s.status === "planned");
  const lastSession = getLatestCompletedSession();
  const areas = getProgressAreas();
  const activeGoals = getGoals().filter((g) => g.status !== "abandoned");

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

            {activePlan && (
              <div className="mt-4 border-t border-stone-200 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Active Training Plan · Week {getCurrentPlanWeek(activePlan)}{" "}
                  of {activePlan.weeks}
                </p>
                <p className="mt-1 text-sm text-stone-700">
                  {activePlan.rationale.length > 160
                    ? `${activePlan.rationale.slice(0, 160)}…`
                    : activePlan.rationale}
                </p>
                <Link
                  href={`/training-plans/${activePlan.id}`}
                  className="mt-2 inline-block text-sm font-medium text-fairway-700 hover:underline"
                >
                  View plan →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-stone-500">No lessons logged yet.</p>
        )}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="card">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-fairway-700">
            Next Session
          </h2>
          {nextSession ? (
            <div>
              <p className="font-medium">{nextSession.focus}</p>
              <p className="text-sm text-stone-600">
                {formatDate(nextSession.date)} ·{" "}
                {nextSession.ball_count_planned} balls ·{" "}
                {nextSession.blocks.length} blocks
              </p>
              <Link
                href={`/sessions/${nextSession.id}`}
                className="mt-3 inline-block text-sm font-medium text-fairway-700 hover:underline"
              >
                View plan →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              No session planned yet. Tell Claude you&apos;re heading to the
              range to plan one.
            </p>
          )}
        </section>

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
              No completed sessions yet.
            </p>
          )}
        </section>
      </div>

      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Goal Progress
        </h2>
        {activeGoals.length === 0 ? (
          <p className="text-sm text-stone-500">
            No goals set yet.{" "}
            <Link href="/goals" className="text-fairway-700 hover:underline">
              See how goals get suggested
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {activeGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              const pct =
                progress.shotCount > 0
                  ? Math.round(
                      (progress.withinTargetCount / progress.shotCount) * 100
                    )
                  : null;
              return (
                <Link
                  key={goal.id}
                  href="/goals"
                  className="rounded-lg border border-stone-200 p-3 transition-colors hover:border-fairway-400 hover:bg-fairway-50"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{goal.club}</p>
                    {goal.status === "achieved" && (
                      <span className="badge">achieved</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    {pct !== null
                      ? `${pct}% of ${progress.shotCount} shots on target`
                      : "No shots logged yet"}
                  </p>
                </Link>
              );
            })}
          </div>
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
