import { create } from "zustand";

interface SessionPlannerState {
  focus: string;
  ballCount: number;
  setFocus: (focus: string) => void;
  setBallCount: (count: number) => void;
}

export const useSessionPlannerStore = create<SessionPlannerState>((set) => ({
  focus: "sequencing-over-the-top",
  ballCount: 100,
  setFocus: (focus) => set({ focus }),
  setBallCount: (ballCount) => set({ ballCount }),
}));

interface CompleteSessionDraft {
  how_it_felt: string;
  miss_pattern: string;
  self_rated_success: number;
}

interface CompleteSessionState {
  draft: CompleteSessionDraft;
  update: (patch: Partial<CompleteSessionDraft>) => void;
}

export const useCompleteSessionStore = create<CompleteSessionState>((set) => ({
  draft: { how_it_felt: "", miss_pattern: "", self_rated_success: 3 },
  update: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
}));
