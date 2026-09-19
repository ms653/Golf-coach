import { getDrills, getAllTargetFaults } from "@/lib/data";
import DrillsBrowser from "@/components/DrillsBrowser";

export default function DrillsPage() {
  const drills = getDrills();
  const faults = getAllTargetFaults();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Drill Library</h1>
      <DrillsBrowser drills={drills} faults={faults} />
    </div>
  );
}
