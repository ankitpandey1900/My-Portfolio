import { create } from 'zustand';
import type { TravelRequest, TravelState } from './camera-travel-types';

interface CameraTravelStore {
  state: TravelState;
  currentRequest: TravelRequest | null;
  travelQueue: TravelRequest[];
  progress: number;

  // Actions
  queueTravel: (request: TravelRequest) => void;
  startTravel: (request: TravelRequest) => void;
  cancelTravel: () => void;
  resetCamera: () => void;
  setProgress: (progress: number) => void;
  setState: (state: TravelState) => void;
}

export const useCameraTravelStore = create<CameraTravelStore>((set) => ({
  state: 'idle',
  currentRequest: null,
  travelQueue: [],
  progress: 0,

  queueTravel: (request) =>
    set((store) => {
      // Always interrupt in-flight travel so planet clicks are never dropped.
      store.currentRequest?.onInterrupt?.();
      return {
        currentRequest: request,
        state: 'preparing',
        progress: 0,
        travelQueue: [],
      };
    }),

  startTravel: (request) => set({ currentRequest: request, state: 'preparing', progress: 0 }),

  cancelTravel: () =>
    set((store) => {
      store.currentRequest?.onInterrupt?.();
      return { state: 'cancelled', currentRequest: null, travelQueue: [], progress: 0 };
    }),

  resetCamera: () => set({ state: 'idle', currentRequest: null, travelQueue: [], progress: 0 }),

  setProgress: (progress) => set({ progress }),

  setState: (state) =>
    set((store) => {
      // Process next item in queue when dropping back to idle
      if (state === 'idle' && store.travelQueue.length > 0) {
        const [nextRequest, ...rest] = store.travelQueue;
        return {
          state: 'preparing',
          currentRequest: nextRequest || null,
          travelQueue: rest,
          progress: 0,
        };
      }
      return { state };
    }),
}));
