'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Sequence Manager
// Headless React component that monitors the queue and instantiates Timelines.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { SEQUENCE_REGISTRY } from './sequence-registry';
import { useSequenceStore } from './sequence-state';
import { SequenceTimeline } from './sequence-timeline';

export function SequenceManager() {
  const queue = useSequenceStore((state) => state.queue);
  const status = useSequenceStore((state) => state.status);
  const dequeue = useSequenceStore((state) => state.dequeue);

  const activeTimelineRef = React.useRef<SequenceTimeline | null>(null);

  React.useEffect(() => {
    // If we have items in the queue and we are currently Idle or Completed, run the next one
    if (
      queue.length > 0 &&
      (status === 'Idle' || status === 'Completed' || status === 'Cancelled' || status === 'Failed')
    ) {
      const nextId = dequeue();
      if (!nextId) return;

      const definition = SEQUENCE_REGISTRY[nextId];
      if (!definition) {
        console.warn(`[Director] Sequence ${nextId} not found in registry.`);
        return;
      }

      const timeline = new SequenceTimeline(definition);
      activeTimelineRef.current = timeline;

      // Execute fire-and-forget
      timeline.play().finally(() => {
        activeTimelineRef.current = null;
      });
    }
  }, [queue.length, status, dequeue]);

  // Listen for global force commands from the Controller
  React.useEffect(() => {
    const handleCancel = () => activeTimelineRef.current?.cancel();
    const handlePause = () => activeTimelineRef.current?.pause();
    const handleResume = () => activeTimelineRef.current?.resume();
    const handleSkip = () => activeTimelineRef.current?.skip();

    window.addEventListener('director:forceCancel', handleCancel);
    window.addEventListener('director:forcePause', handlePause);
    window.addEventListener('director:forceResume', handleResume);
    window.addEventListener('director:forceSkip', handleSkip);

    return () => {
      window.removeEventListener('director:forceCancel', handleCancel);
      window.removeEventListener('director:forcePause', handlePause);
      window.removeEventListener('director:forceResume', handleResume);
      window.removeEventListener('director:forceSkip', handleSkip);
    };
  }, []);

  return null;
}

