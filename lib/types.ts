export interface Lesson {
  id: string;
  date: string;
  coach: string;
  notes: string;
  cues: string[];
  fault_focus: string;
  drills_recommended: string[];
  video_review_notes: string;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  target_faults: string[];
  clubs: string[];
}

export interface SessionBlock {
  name: string;
  club: string;
  balls: number;
  drills: string[];
  focus_note: string;
}

export interface PostSessionNote {
  how_it_felt: string;
  miss_pattern: string;
  self_rated_success: number | null;
}

export interface Session {
  id: string;
  date: string;
  focus: string;
  ball_count_planned: number;
  status: "planned" | "completed";
  blocks: SessionBlock[];
  post_session_note: PostSessionNote;
  stats_ids: string[];
}

export interface StatEntry {
  id: string;
  date: string;
  session_id: string | null;
  club: string;
  ball_speed_mph: number | null;
  carry_yards: number | null;
  total_yards: number | null;
  launch_angle_deg: number | null;
  apex_ft: number | null;
  // Lateral miss from the target line, in yards. Negative = left,
  // positive = right. Toptracer calls this "offline"; null if not shown.
  offline_yards: number | null;
  note?: string;
}

export interface ProgressTimelineEntry {
  date: string;
  source: "lesson" | "session" | "stats" | "review" | "round";
  source_id: string;
  note: string;
}

export interface ProgressArea {
  id: string;
  name: string;
  description: string;
  timeline: ProgressTimelineEntry[];
}

export interface Review {
  id: string;
  date: string;
  type: "swing-video" | "range-screenshot";
  context: string;
  linked_lesson_id: string | null;
  linked_session_id: string | null;
  observations: { note: string; fault_area: string }[];
  verdict: string;
  cues_suggested: string[];
  drills_suggested: string[];
}

export interface ReviewsData {
  reviews: Review[];
}

export interface TrainingPlanWeek {
  week: number;
  sessions_planned: number;
  theme: string;
  session_ids: string[];
}

export interface TrainingPlan {
  id: string;
  created_date: string;
  weeks: number;
  primary_focus: string;
  secondary_focus: string | null;
  rationale: string;
  weekly_structure: TrainingPlanWeek[];
  status: "active" | "completed" | "abandoned";
  review_note: string;
}

export interface TrainingPlansData {
  plans: TrainingPlan[];
}

export interface Goal {
  id: string; // "goal-<club>", e.g. "goal-7i"
  club: string; // matches StatEntry.club
  target_carry_yards: number;
  carry_tolerance_yards: number; // e.g. 5 means "within 5 of target"
  target_dispersion_yards: number; // acceptable |offline_yards| spread
  created_date: string;
  note: string;
  status: "active" | "achieved" | "abandoned";
}

export interface GoalsData {
  goals: Goal[];
}

export interface Round {
  id: string; // "round-YYYY-MM-DD"
  date: string;
  type: "real" | "virtual";
  course: string;
  holes: 9 | 18;
  score: number; // gross strokes
  score_to_par: number | null;
  note: string;
  linked_focus_areas: string[]; // progress area ids
}

export interface RoundsData {
  rounds: Round[];
}

export interface LessonsData {
  lessons: Lesson[];
}
export interface DrillsData {
  drills: Drill[];
}
export interface SessionsData {
  sessions: Session[];
}
export interface StatsData {
  entries: StatEntry[];
}
export interface ProgressData {
  areas: ProgressArea[];
}
