import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getTrainingPlans,
  getTrainingPlanById,
  getCurrentPlanWeek,
  getSessionById,
  formatDate,
  staticParamsFor,
} from "@/lib/data";

export function generateStaticParams() {
  return staticParamsFor(getTrainingPlans());
}

export default function TrainingPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const plan = getTrainingPlanById(params.id);
  if (!plan) notFound();

  const currentWeek = getCurrentPlanWeek(plan);

  return (
    <div className="space-y-6">
      <Link href="/training-plans" className="text-sm text-fairway-700 hover:underline">
        ← All plans
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{plan.primary_focus}</h1>
          <span className={plan.status === "active" ? "badge-marker" : "badge"}>
            {plan.status}
          </span>
        </div>
        {plan.secondary_focus && (
          <p className="mt-1 text-sm text-stone-500">+ {plan.secondary_focus}</p>
        )}
        <p className="mt-1 text-sm text-stone-500">
          Created {formatDate(plan.created_date)}
        </p>
        <p className="mt-3 text-sm text-stone-700">{plan.rationale}</p>
        {plan.status === "active" && (
          <p className="mt-3 text-sm">
            <span className="font-semibold">
              Week {currentWeek} of {plan.weeks}
            </span>
          </p>
        )}
        {plan.status !== "active" && plan.review_note && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Review Note
            </h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
              {plan.review_note}
            </p>
          </>
        )}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-fairway-700">
        Weekly Structure
      </h2>
      <div className="space-y-3">
        {plan.weekly_structure.map((week) => (
          <div key={week.week} className="card">
            <div className="flex items-center justify-between">
              <p className="font-medium">Week {week.week}</p>
              <span className="badge">
                {week.sessions_planned} session
                {week.sessions_planned === 1 ? "" : "s"}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-700">{week.theme}</p>
            {week.session_ids.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                {week.session_ids.map((sid) => {
                  const session = getSessionById(sid);
                  return session ? (
                    <Link
                      key={sid}
                      href={`/sessions/${session.id}`}
                      className="text-fairway-700 hover:underline"
                    >
                      {formatDate(session.date)} session →
                    </Link>
                  ) : (
                    <span key={sid} className="text-stone-500">
                      {sid}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
