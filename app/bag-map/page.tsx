import { getClubs, getDispersionDates, getGoals } from "@/lib/data";
import BagMap from "@/components/BagMap";

export default function BagMapPage() {
  const clubs = getClubs();
  const dates = getDispersionDates();
  const goals = getGoals();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Bag Map</h1>
      <p className="text-sm text-stone-600">
        Where each club&apos;s shots actually land, scaled by distance and
        left/right spread. The dashed tick on the centerline marks a
        club&apos;s locked-in target distance, where one is set. Drag the
        slider to see the pattern as of an earlier practice date.
      </p>

      {clubs.length === 0 ? (
        <p className="text-sm text-stone-500">No stats logged yet.</p>
      ) : (
        <div className="card">
          <BagMap clubs={clubs} dates={dates} goals={goals} />
        </div>
      )}
    </div>
  );
}
