import { create } from 'zustand';
import type { LandingContext, LandingState } from './landing-types';

interface LandingStore extends LandingContext {
  state: LandingState;

  setState: (state: LandingState) => void;
  setTargetData: (planetId: string | null, sectionId: string | null) => void;
  reset: () => void;
}

export const useLandingStore = create<LandingStore>((set) => ({
  state: 'idle',
  targetPlanetId: null,
  targetSectionId: null,
  startTimestamp: null,

  setState: (state) => set({ state }),

  setTargetData: (planetId, sectionId) =>
    set({
      targetPlanetId: planetId,
      targetSectionId: sectionId,
      startTimestamp: Date.now(),
    }),

  reset: () =>
    set({
      state: 'idle',
      targetPlanetId: null,
      targetSectionId: null,
      startTimestamp: null,
    }),
}));
