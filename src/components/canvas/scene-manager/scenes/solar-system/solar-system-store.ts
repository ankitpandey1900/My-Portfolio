import { create } from 'zustand';

interface SolarSystemSimulationState {
  timeScale: number;
  orbitSpeedMultiplier: number;
  isPaused: boolean;
  accumulatedTime: number;

  // Actions
  setTimeScale: (scale: number) => void;
  setOrbitSpeedMultiplier: (multiplier: number) => void;
  setPaused: (paused: boolean) => void;
  advanceTime: (delta: number) => void;
  resetSimulation: () => void;
}

export const useSolarSystemSimulation = create<SolarSystemSimulationState>((set) => ({
  timeScale: 1.15,
  orbitSpeedMultiplier: 1.65,
  isPaused: false,
  accumulatedTime: 0,

  setTimeScale: (scale) => set({ timeScale: scale }),
  setOrbitSpeedMultiplier: (multiplier) => set({ orbitSpeedMultiplier: multiplier }),
  setPaused: (paused) => set({ isPaused: paused }),
  advanceTime: (delta) =>
    set((state) => ({
      accumulatedTime: state.accumulatedTime + (state.isPaused ? 0 : delta * state.timeScale),
    })),
  resetSimulation: () =>
    set({
      timeScale: 1.15,
      orbitSpeedMultiplier: 1.65,
      isPaused: false,
      accumulatedTime: 0,
    }),
}));

