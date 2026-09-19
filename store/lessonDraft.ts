import { create } from "zustand";

export interface LessonDraft {
  date: string;
  coach: string;
  notes: string;
  cues: string;
  fault_focus: string;
  drills_recommended: string;
  video_review_notes: string;
}

interface LessonDraftState {
  draft: LessonDraft;
  update: (patch: Partial<LessonDraft>) => void;
  reset: () => void;
}

const emptyDraft: LessonDraft = {
  date: new Date().toISOString().slice(0, 10),
  coach: "Adrian Saxton",
  notes: "",
  cues: "",
  fault_focus: "",
  drills_recommended: "",
  video_review_notes: "",
};

export const useLessonDraftStore = create<LessonDraftState>((set) => ({
  draft: { ...emptyDraft },
  update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
  reset: () => set({ draft: { ...emptyDraft } }),
}));
