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
  note?: string;
}

export interface ProgressTimelineEntry {
  date: string;
  source: "lesson" | "session" | "stats" | "review";
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
