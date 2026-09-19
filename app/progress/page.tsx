import Link from "next/link";
import { getProgressAreas, faultFrequencyInRecentLessons } from "@/lib/data";

export default function ProgressPage() {
  const areas = getProgressAreas();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Progress By Area</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {areas.map((area) => {
          const freq = faultFrequencyInRecentLessons(area.id, 6);
          const recurring = freq.total > 0 && freq.count / freq.total >= 0.5;
          return (
            <Link key={area.id} href={`/progress/${area.id}`} className="card block hover:border-fairway-400">
              <p className="font-medium">{area.name}</p>
              <p className="mt-1 text-sm text-stone-600">{area.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="badge">
                  {area.timeline.length} note{area.timeline.length === 1 ? "" : "s"}
                </span>
                {recurring && (
                  <span className="badge bg-amber-100 text-amber-800">
                    Recurring: {freq.count}/{freq.total} recent lessons
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
