// ─────────────────────────────────────────────────────────────────────────────
// Home Planet State
// Zustand store for the Home Planet phase state machine.
// Use .getState() in event listeners to avoid re-render subscriptions.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { HomePlanetPhase, HomePlanetStore } from './home-planet-types';

export const useHomePlanetStore = create<HomePlanetStore>((set) => ({
  phase: 'idle',
  isVisible: false,
  hasInteracted: false,

  setPhase: (phase: HomePlanetPhase) => set({ phase }),

  setVisible: (isVisible: boolean) => set({ isVisible }),

  setInteracted: () => set({ hasInteracted: true }),

  reset: () =>
    set({
      phase: 'idle',
      isVisible: false,
      hasInteracted: false,
    }),
}));
