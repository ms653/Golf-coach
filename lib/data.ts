import lessonsData from "@/data/lessons.json";
import drillsData from "@/data/drills.json";
import sessionsData from "@/data/sessions.json";
import statsData from "@/data/stats.json";
import progressData from "@/data/progress.json";
import reviewsData from "@/data/reviews.json";
import trainingPlansData from "@/data/training_plans.json";
import goalsData from "@/data/goals.json";
import roundsData from "@/data/rounds.json";
import type {
  Lesson,
  Drill,
  Session,
  SessionBlock,
  StatEntry,
  ProgressArea,
  Review,
  TrainingPlan,
  Goal,
  Round,
} from "@/lib/types";

/**
 * `output: export` requires generateStaticParams() to return at least one
 * param per dynamic route, so every [id] page falls back to a placeholder
 * when its underlying list is empty. Centralized here so the workaround
 * (and the eventual Next.js quirk it's for) lives in exactly one place.
 */
export function staticParamsFor<T extends { id: string }>(
  items: T[]
): { id: string }[] {
  if (items.length === 0) return [{ id: "_none" }];
  return items.map((item) => ({ id: item.id }));
}

export function getLessons(): Lesson[] {
  return [...(lessonsData.lessons as Lesson[])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return (lessonsData.lessons as Lesson[]).find((l) => l.id === id);
}

export function getDrills(): Drill[] {
  return drillsData.drills as Drill[];
}

export function getDrillById(id: string): Drill | undefined {
  return (drillsData.drills as Drill[]).find((d) => d.id === id);
}

export function getAllTargetFaults(): string[] {
  const faults = new Set<string>();
  (drillsData.drills as Drill[]).forEach((d) =>
    d.target_faults.forEach((f) => faults.add(f))
  );
  return Array.from(faults).sort();
}

export function getSessions(): Session[] {
  return [...(sessionsData.sessions as Session[])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getSessionById(id: string): Session | undefined {
  return (sessionsData.sessions as Session[]).find((s) => s.id === id);
}

export function getLatestCompletedSession(): Session | undefined {
  return getSessions().find((s) => s.status === "completed");
}

export function getStats(): StatEntry[] {
  return [...(statsData.entries as StatEntry[])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getStatsByClub(club: string): StatEntry[] {
  return getStats().filter((s) => s.club === club);
}

export function getClubs(): string[] {
  const clubs = new Set<string>();
  (statsData.entries as StatEntry[]).forEach((s) => clubs.add(s.club));
  return Array.from(clubs).sort();
}

export function getClubAverages() {
  const clubs = getClubs();
  return clubs.map((club) => {
    const entries = getStatsByClub(club);
    const avg = (key: keyof StatEntry) => {
      const vals = entries
        .map((e) => e[key])
        .filter((v): v is number => typeof v === "number");
      if (vals.length === 0) return null;
      return Math.round(
        (vals.reduce((a, b) => a + b, 0) / vals.length) * 10
      ) / 10;
    };
    return {
      club,
      count: entries.length,
      avg_ball_speed: avg("ball_speed_mph"),
      avg_carry: avg("carry_yards"),
      avg_total: avg("total_yards"),
      avg_launch: avg("launch_angle_deg"),
    };
  });
}

export function getProgressAreas(): ProgressArea[] {
  return progressData.areas as ProgressArea[];
}

export function getProgressAreaById(id: string): ProgressArea | undefined {
  return (progressData.areas as ProgressArea[]).find((a) => a.id === id);
}

export function getCurrentFocus(): Lesson | undefined {
  return getLessons()[0];
}

/** How many of the last N lessons touched a given fault_focus. */
export function faultFrequencyInRecentLessons(
  faultFocus: string,
  n = 6
): { count: number; total: number } {
  const recent = getLessons().slice(0, n);
  const count = recent.filter((l) => l.fault_focus === faultFocus).length;
  return { count, total: recent.length };
}

function roundToFive(n: number): number {
  return Math.max(5, Math.round(n / 5) * 5);
}

/**
 * Generates a session plan (warm-up -> feel work -> drill work -> transfer
 * -> pressure test -> cool-down) pulling relevant drills from the library
 * for the given focus (matched against drill target_faults).
 *
 * The 15/15/35/20/10% split (+ cool-down absorbing the remainder) follows a
 * blocked-practice -> transfer -> pressure-test progression: most reps go to
 * isolating the feel and drilling it (feel + drill = 50%), then a smaller
 * transfer block moves it into full swings, then a short pressure test
 * checks whether it holds up under a scoring/target constraint. It's a
 * reasonable default for this user's typical 80-150 ball sessions, not a
 * universal law — below roughly 40 balls the blocks get short enough (the
 * 5-ball floor in roundToFive) that some structure is better collapsed;
 * `plan-session`/`golf-session-kickoff` should flag that to the user rather
 * than presenting six tiny blocks as if they were a normal-sized session.
 */
export function generateSessionPlan(
  focus: string,
  ballCount: number
): SessionBlock[] {
  const relevantDrills = getDrills().filter((d) =>
    d.target_faults.some(
      (f) =>
        f.toLowerCase().includes(focus.toLowerCase()) ||
        focus.toLowerCase().includes(f.toLowerCase())
    )
  );
  const drillNames =
    relevantDrills.length > 0
      ? relevantDrills.map((d) => d.id)
      : getDrills().slice(0, 2).map((d) => d.id);

  const split = {
    warmup: 0.15,
    feel: 0.15,
    drill: 0.35,
    transfer: 0.2,
    pressure: 0.1,
  };

  const warmup = roundToFive(ballCount * split.warmup);
  const feel = roundToFive(ballCount * split.feel);
  const drill = roundToFive(ballCount * split.drill);
  const transfer = roundToFive(ballCount * split.transfer);
  const pressure = roundToFive(ballCount * split.pressure);
  // Cool-down absorbs whatever's left so the blocks always sum to exactly
  // ballCount, instead of each block's independent rounding drifting the
  // total away from what the user actually asked for.
  const cooldown = Math.max(
    5,
    ballCount - (warmup + feel + drill + transfer + pressure)
  );

  return [
    {
      name: "Warm-up",
      club: "wedge",
      balls: warmup,
      drills: [],
      focus_note: "Loosen up, half-speed swings, no target focus yet.",
    },
    {
      name: "Feel work",
      club: "7i",
      balls: feel,
      drills: drillNames.slice(0, 1),
      focus_note: `Slow, exaggerated reps building the feel for: ${focus}.`,
    },
    {
      name: "Drill work",
      club: "7i",
      balls: drill,
      drills: drillNames,
      focus_note: `Full-speed reps of the drill(s) targeting: ${focus}.`,
    },
    {
      name: "Transfer",
      club: "7i",
      balls: transfer,
      drills: [],
      focus_note: "Normal full swings, carrying the drill feel into a real swing.",
    },
    {
      name: "Pressure test",
      club: "7i",
      balls: pressure,
      drills: [],
      focus_note: "Pick a target, score makes/misses, simulate on-course pressure.",
    },
    {
      name: "Cool-down",
      club: "wedge",
      balls: cooldown,
      drills: [],
      focus_note: "Easy short-game shots to finish, no swing thoughts.",
    },
  ];
}

export function getReviews(): Review[] {
  return [...(reviewsData.reviews as Review[])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getReviewById(id: string): Review | undefined {
  return (reviewsData.reviews as Review[]).find((r) => r.id === id);
}

export function getReviewsByFaultArea(areaId: string): Review[] {
  return getReviews().filter((r) =>
    r.observations.some((o) => o.fault_area === areaId)
  );
}

export function getTrainingPlans(): TrainingPlan[] {
  return [...(trainingPlansData.plans as TrainingPlan[])].sort((a, b) =>
    b.created_date.localeCompare(a.created_date)
  );
}

export function getTrainingPlanById(id: string): TrainingPlan | undefined {
  return (trainingPlansData.plans as TrainingPlan[]).find((p) => p.id === id);
}

export function getActiveTrainingPlan(): TrainingPlan | undefined {
  return getTrainingPlans().find((p) => p.status === "active");
}

export function getCurrentPlanWeek(plan: TrainingPlan): number {
  const created = new Date(plan.created_date + "T00:00:00");
  const now = new Date();
  const daysSince = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  const week = Math.ceil((daysSince + 1) / 7);
  return Math.min(plan.weeks, Math.max(1, week));
}

export function getGoals(): Goal[] {
  return goalsData.goals as Goal[];
}

export function getGoalById(id: string): Goal | undefined {
  return (goalsData.goals as Goal[]).find((g) => g.id === id);
}

export function getActiveGoalForClub(club: string): Goal | undefined {
  return (goalsData.goals as Goal[]).find(
    (g) => g.club === club && g.status === "active"
  );
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number | null {
  if (values.length < 2) return null;
  const m = mean(values)!;
  const variance =
    values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export interface GoalProgress {
  goal: Goal;
  shotCount: number;
  avgCarry: number | null;
  carryStdDev: number | null;
  avgOffline: number | null;
  offlineStdDev: number | null;
  withinTargetCount: number;
  shots: { date: string; carry: number; offline: number; withinTarget: boolean }[];
}

/**
 * Computes objective stats for a goal against real stats.json shots for
 * that club — raw numbers only (counts, averages, standard deviations).
 * Any qualitative "on track" / "needs work" judgment is a coaching call
 * left to a skill reading these numbers, not baked in here.
 */
export function getGoalProgress(goal: Goal): GoalProgress {
  const entries = getStatsByClub(goal.club).filter(
    (e) => e.carry_yards !== null && e.offline_yards !== null
  );
  const carries = entries.map((e) => e.carry_yards as number);
  const offlines = entries.map((e) => e.offline_yards as number);

  const shots = entries.map((e) => {
    const carry = e.carry_yards as number;
    const offline = e.offline_yards as number;
    const withinTarget =
      Math.abs(carry - goal.target_carry_yards) <= goal.carry_tolerance_yards &&
      Math.abs(offline) <= goal.target_dispersion_yards;
    return { date: e.date, carry, offline, withinTarget };
  });

  return {
    goal,
    shotCount: entries.length,
    avgCarry: mean(carries),
    carryStdDev: stdDev(carries),
    avgOffline: mean(offlines),
    offlineStdDev: stdDev(offlines),
    withinTargetCount: shots.filter((s) => s.withinTarget).length,
    shots,
  };
}

export function getRounds(): Round[] {
  return [...(roundsData.rounds as Round[])].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function getRoundById(id: string): Round | undefined {
  return (roundsData.rounds as Round[]).find((r) => r.id === id);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
