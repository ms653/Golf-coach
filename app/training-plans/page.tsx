import Link from "next/link";
import { getTrainingPlans } from "@/lib/data";

export default function TrainingPlansPage() {
  const plans = getTrainingPlans();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Training Plans</h1>

      {plans.length === 0 ? (
        <p className="text-sm text-stone-500">No training plans yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/training-plans/${plan.id}`}
              className="card block hover:border-fairway-400"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{plan.primary_focus}</p>
                <span className={plan.status === "active" ? "badge-marker" : "badge"}>
                  {plan.status}
                </span>
              </div>
              {plan.secondary_focus && (
                <p className="mt-1 text-sm text-stone-500">
                  + {plan.secondary_focus}
                </p>
              )}
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                {plan.rationale}
              </p>
              <p className="mt-3 text-xs text-stone-500">
                {plan.weeks} week{plan.weeks === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
