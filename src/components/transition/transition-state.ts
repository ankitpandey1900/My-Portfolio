import { create } from 'zustand';
import type { TransitionContext, TransitionState } from './transition-types';

export interface TransitionQueueItem extends TransitionContext {
  queuedAt: number;
  uid: string; // Unique identifier for the specific queued instance
}

interface TransitionStore {
  state: TransitionState;
  currentTransition: TransitionQueueItem | null;
  queue: TransitionQueueItem[];

  setState: (state: TransitionState) => void;
  setCurrent: (transition: TransitionQueueItem | null) => void;
  enqueue: (item: TransitionQueueItem) => void;
  dequeue: () => TransitionQueueItem | undefined;
  clearQueue: () => void;
  reset: () => void;
}

export const useTransitionStore = create<TransitionStore>((set, get) => ({
  state: 'idle',
  currentTransition: null,
  queue: [],

  setState: (state) => set({ state }),

  setCurrent: (transition) => set({ currentTransition: transition }),

  enqueue: (item) =>
    set((store) => {
      // Prevent exactly duplicate queued items (same id, same target) from being spammed
      const isDuplicate = store.queue.some((q) => q.id === item.id && q.targetId === item.targetId);
      if (isDuplicate) return store;

      // Sort highest priority first. If equal priority, oldest first.
      const newQueue = [...store.queue, item].sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return a.queuedAt - b.queuedAt;
      });

      return { queue: newQueue };
    }),

  dequeue: () => {
    const { queue } = get();
    if (queue.length === 0) return undefined;

    const [next, ...rest] = queue;
    set({ queue: rest });
    return next;
  },

  clearQueue: () => set({ queue: [] }),

  reset: () =>
    set({
      state: 'idle',
      currentTransition: null,
      queue: [],
    }),
}));
