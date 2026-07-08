import { TRANSITION_CONFIG } from './transition-config';
import { TransitionEvents, type TransitionPayload } from './transition-events';
import { TransitionQueue } from './transition-queue';
import { useTransitionStore } from './transition-state';
import type { TransitionId } from './transition-types';

let timeoutHandle: NodeJS.Timeout | null = null;
let pollHandle: NodeJS.Timeout | null = null;

const checkQueue = () => {
  const store = useTransitionStore.getState();

  // Only pop from queue if currently idle (or effectively idle)
  if (
    store.state !== 'idle' &&
    store.state !== 'completed' &&
    store.state !== 'cancelled' &&
    store.state !== 'failed'
  ) {
    return;
  }

  const nextTransition = TransitionQueue.dequeue();
  if (nextTransition) {
    TransitionController.startTransition(
      nextTransition.id,
      nextTransition.targetId,
      nextTransition.uid
    );
  }
};

const finishTransition = (
  uid: string | undefined,
  finalState: 'completed' | 'cancelled' | 'failed',
  eventName: 'TransitionCompleted' | 'TransitionCancelled' | 'TransitionFailed',
  reason?: string
) => {
  const store = useTransitionStore.getState();
  const current = store.currentTransition;

  if (!current) return;
  if (uid && current.uid !== uid) return;

  if (timeoutHandle) clearTimeout(timeoutHandle);

  store.setState(finalState);
  TransitionEvents.emit(eventName, {
    transitionId: current.id,
    targetId: current.targetId,
    uid: current.uid,
    timestamp: Date.now(),
    ...(reason ? { reason } : {}),
  } as TransitionPayload);

  store.setCurrent(null);
  store.setState('idle');

  if (pollHandle) clearTimeout(pollHandle);
  pollHandle = setTimeout(checkQueue, TRANSITION_CONFIG.QUEUE_POLL_DELAY_MS);
};

export const TransitionController = {
  queueTransition: (id: TransitionId, targetId?: string, priorityOverride?: number) => {
    TransitionQueue.enqueue(id, targetId, priorityOverride);

    // Attempt to process queue on next tick
    if (pollHandle) clearTimeout(pollHandle);
    pollHandle = setTimeout(checkQueue, TRANSITION_CONFIG.QUEUE_POLL_DELAY_MS);
  },

  startTransition: (id: TransitionId, targetId?: string, forceUid?: string) => {
    const store = useTransitionStore.getState();
    const uid = forceUid || crypto.randomUUID();

    store.setCurrent({ id, targetId, priority: 0, queuedAt: Date.now(), uid });
    store.setState('preparing');

    TransitionEvents.emit('TransitionStarted', {
      transitionId: id,
      targetId,
      uid,
      timestamp: Date.now(),
    });

    store.setState('running');

    if (timeoutHandle) clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(() => {
      TransitionController.failTransition(uid, 'TransitionTimeout');
    }, TRANSITION_CONFIG.MAX_TRANSITION_TIMEOUT_MS);
  },

  completeTransition: (uid?: string) => {
    finishTransition(uid, 'completed', 'TransitionCompleted');
  },

  cancelTransition: (uid?: string) => {
    finishTransition(uid, 'cancelled', 'TransitionCancelled', 'Programmatic Cancellation');
  },

  failTransition: (uid: string, reason: string) => {
    finishTransition(uid, 'failed', 'TransitionFailed', reason);
  },

  clearQueue: () => {
    TransitionQueue.clear();
  },

  getCurrentTransition: () => {
    return useTransitionStore.getState().currentTransition;
  },
};
