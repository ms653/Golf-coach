import { getGoals, getGoalProgress, formatDate } from "@/lib/data";
import DispersionChart from "@/components/DispersionChart";

function round1(n: number | null): string {
  if (n === null) return "–";
  return (Math.round(n * 10) / 10).toString();
}

export default function GoalsPage() {
  const goals = getGoals();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Distance &amp; Dispersion Goals</h1>

      {goals.length === 0 ? (
        <p className="text-sm text-stone-500">
          No goals set yet. Ask Claude to suggest one for a club (e.g.
          &ldquo;suggest a goal for my 7-iron&rdquo;) — the{" "}
          <span className="font-mono">suggest-goals</span> skill proposes
          the target from your own shot history rather than asking you to
          invent a number. Needs at least 5 logged shots with both carry
          and offline distance for that club.
        </p>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const pct =
              progress.shotCount > 0
                ? Math.round((progress.withinTargetCount / progress.shotCount) * 100)
                : null;
            return (
              <section key={goal.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">{goal.club}</h2>
                  <span
                    className={`badge ${
                      goal.status === "active" ? "" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  Target: {goal.target_carry_yards}yd carry (±
                  {goal.carry_tolerance_yards}yd), within ±
                  {goal.target_dispersion_yards}yd left/right
                </p>
                {goal.note && (
                  <p className="mt-1 text-sm text-stone-500">{goal.note}</p>
                )}
                <p className="mt-1 text-xs text-stone-400">
                  Set {formatDate(goal.created_date)}
                </p>

                {progress.shotCount === 0 ? (
                  <p className="mt-4 text-sm text-stone-500">
                    No shots logged for {goal.club} with both carry and
                    offline distance yet.
                  </p>
                ) : (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-xs uppercase text-stone-500">Shots</p>
                        <p className="font-medium">{progress.shotCount}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-stone-500">Avg carry</p>
                        <p className="font-medium">{round1(progress.avgCarry)}yd</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-stone-500">Carry spread (σ)</p>
                        <p className="font-medium">{round1(progress.carryStdDev)}yd</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase text-stone-500">Offline spread (σ)</p>
                        <p className="font-medium">{round1(progress.offlineStdDev)}yd</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-stone-700">
                      <span className="font-medium">
                        {progress.withinTargetCount}/{progress.shotCount}
                      </span>{" "}
                      shots ({pct}%) landed inside the target box below.
                    </p>
                    <div className="mt-4">
                      <DispersionChart progress={progress} />
                    </div>
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
