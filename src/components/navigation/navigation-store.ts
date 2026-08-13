import { create } from 'zustand';
import type { NavigationState } from './navigation-types';

interface NavigationStore {
  state: NavigationState;
  currentPlanetId: string | null;
  currentSectionId: string | null;
  previousSectionId: string | null;

  // Actions
  setState: (state: NavigationState) => void;
  setPlanet: (planetId: string | null) => void;
  setSection: (sectionId: string | null) => void;
  resetNavigation: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  state: 'idle',
  currentPlanetId: null,
  currentSectionId: null,
  previousSectionId: null,

  setState: (state) => set({ state }),

  setPlanet: (planetId) => set({ currentPlanetId: planetId }),

  setSection: (sectionId) =>
    set((store) => ({
      previousSectionId: store.currentSectionId,
      currentSectionId: sectionId,
    })),

  resetNavigation: () =>
    set({
      state: 'idle',
      currentPlanetId: null,
      currentSectionId: null,
      previousSectionId: null,
    }),
}));

