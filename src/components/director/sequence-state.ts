// ─────────────────────────────────────────────────────────────────────────────
// Sequence State
// Zustand store for the global cinematic orchestration state.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand';
import type { SequenceId, SequenceState, SequenceStatus } from './sequence-types';

export const useSequenceStore = create<SequenceState>((set, get) => ({
  currentSequenceId: null,
  status: 'Idle',
  queue: [],
  isGlobalMuted: false,

  setStatus: (status: SequenceStatus) => {
    set({ status });
  },

  setCurrentSequence: (id: SequenceId | null) => {
    set({ currentSequenceId: id });
  },

  enqueue: (id: SequenceId) => {
    set((state) => ({ queue: [...state.queue, id] }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  dequeue: () => {
    const { queue } = get();
    if (queue.length === 0) return undefined;

    const [next, ...rest] = queue;
    set({ queue: rest });
    return next;
  },
}));
