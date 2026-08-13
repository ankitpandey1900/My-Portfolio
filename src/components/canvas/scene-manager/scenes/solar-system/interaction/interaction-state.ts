import { create } from 'zustand';

interface InteractionState {
  hoveredPlanetId: string | null;
  selectedPlanetId: string | null;
  disabledPlanets: string[];
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
  setDisabled: (ids: string[]) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  hoveredPlanetId: null,
  selectedPlanetId: null,
  disabledPlanets: [],
  setHovered: (id) => set({ hoveredPlanetId: id }),
  setSelected: (id) => set({ selectedPlanetId: id }),
  setDisabled: (ids) => set({ disabledPlanets: ids }),
}));

