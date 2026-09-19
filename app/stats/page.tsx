import { getStats, getClubs, getClubAverages } from "@/lib/data";
import StatsBrowser from "@/components/StatsBrowser";

export default function StatsPage() {
  const entries = getStats();
  const clubs = getClubs();
  const clubAverages = getClubAverages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Stats</h1>
      <StatsBrowser entries={entries} clubs={clubs} clubAverages={clubAverages} />
    </div>
  );
}
