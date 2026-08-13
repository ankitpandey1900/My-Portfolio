import { TransitionEvents } from './transition-events';
import { TRANSITION_REGISTRY } from './transition-registry';

import { useTransitionStore } from './transition-state';
import type { TransitionId } from './transition-types';

export const TransitionQueue = {
  /**
   * Pushes a new transition request into the state queue.
   */
  enqueue: (id: TransitionId, targetId?: string, priorityOverride?: number) => {
    const metadata = TRANSITION_REGISTRY[id];

    useTransitionStore.getState().enqueue({
      id,
      targetId,
      priority: priorityOverride ?? metadata.defaultPriority,
      queuedAt: Date.now(),
      uid: crypto.randomUUID(),
    });

    const queueLength = useTransitionStore.getState().queue.length;
    TransitionEvents.emit('QueueUpdated', { queueLength, timestamp: Date.now() });
  },

  /**
   * Pops the highest priority item from the state queue.
   */
  dequeue: () => {
    const item = useTransitionStore.getState().dequeue();

    const queueLength = useTransitionStore.getState().queue.length;
    TransitionEvents.emit('QueueUpdated', { queueLength, timestamp: Date.now() });

    return item;
  },

  /**
   * Clears all pending items from the queue.
   */
  clear: () => {
    useTransitionStore.getState().clearQueue();
    TransitionEvents.emit('QueueUpdated', { queueLength: 0, timestamp: Date.now() });
  },
};

