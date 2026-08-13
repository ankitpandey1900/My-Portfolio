'use client';

import * as React from 'react';
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import { useOrbit } from './orbit-provider';

/**
 * OrbitManager handles notifications and lifecycles:
 * 1. Emits start, pause, and resume events to the global pipeline.
 * 2. Syncs local state indicators based on config changes.
 */
export function OrbitManager() {
  const { config, state, setState, setLifecycle } = useOrbit();

  // 1. Mount & Unmount triggers
  React.useEffect(() => {
    setLifecycle('start');
    setState('running');
    sceneEventEmitter.emit('orbit:started', { id: config.id, parentId: config.parentId });

    return () => {
      setLifecycle('cleanup');
      setState('disposed');
      sceneEventEmitter.emit('orbit:disposed', { id: config.id });
    };
  }, [config.id, config.parentId, setLifecycle, setState]);

  // 2. Sync dynamic play/pause indicators
  React.useEffect(() => {
    if (config.paused) {
      if (state === 'running') {
        setState('paused');
        setLifecycle('pause');
        sceneEventEmitter.emit('orbit:paused', { id: config.id });
      }
    } else {
      if (state === 'paused' || state === 'initializing') {
        setState('running');
        setLifecycle('resume');
        sceneEventEmitter.emit('orbit:resumed', { id: config.id });
      }
    }
  }, [config.paused, config.id, state, setState, setLifecycle]);

  return null;
}
export default OrbitManager;

