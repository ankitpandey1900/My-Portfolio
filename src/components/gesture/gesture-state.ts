import { create } from 'zustand';
import type { GestureContext, GestureState, GestureType } from './gesture-types';

export interface GestureHistoryItem {
  type: GestureType;
  timestamp: number;
  context: Partial<GestureContext>;
}

interface GestureStore {
  state: GestureState;
  disabled: boolean;
  history: GestureHistoryItem[];
  activeTouchPoints: number;

  setState: (state: GestureState) => void;
  setDisabled: (disabled: boolean) => void;
  setActiveTouchPoints: (count: number) => void;
  logGesture: (type: GestureType, context: Partial<GestureContext>) => void;
}

export const useGestureStore = create<GestureStore>((set) => ({
  state: 'idle',
  disabled: false,
  history: [],
  activeTouchPoints: 0,

  setState: (state) => set({ state }),

  setDisabled: (disabled) => set({ disabled, state: disabled ? 'disabled' : 'idle' }),

  setActiveTouchPoints: (count) => set({ activeTouchPoints: count }),

  logGesture: (type, context) =>
    set((store) => {
      const newHistory = [{ type, context, timestamp: Date.now() }, ...store.history].slice(0, 10);
      return { history: newHistory };
    }),
}));
