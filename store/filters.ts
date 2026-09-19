import { create } from "zustand";

interface DrillFilterState {
  faultFilter: string | null;
  setFaultFilter: (fault: string | null) => void;
}

export const useDrillFilterStore = create<DrillFilterState>((set) => ({
  faultFilter: null,
  setFaultFilter: (fault) => set({ faultFilter: fault }),
}));

interface StatsFilterState {
  clubFilter: string | null;
  setClubFilter: (club: string | null) => void;
}

export const useStatsFilterStore = create<StatsFilterState>((set) => ({
  clubFilter: null,
  setClubFilter: (club) => set({ clubFilter: club }),
}));
