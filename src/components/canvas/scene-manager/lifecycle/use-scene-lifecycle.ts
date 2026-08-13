'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { sceneEventEmitter } from '../events/scene-event-emitter';

export interface SceneLifecycleOptions {
  name: string;
  onInitialize?: () => void;
  onMount?: () => void;
  onSuspend?: () => void;
  onResume?: () => void;
  onDestroy?: () => void;
}

/**
 * Manages scene lifecycle stages (Initialize, Mount, Resume, Suspend, Destroy).
 *
 * Callbacks are stored in refs so that useEffect dependency arrays only contain
 * stable values (`name`, `isActive`). This prevents continuous re-execution
 * when consumers pass inline arrow functions.
 */
export function useSceneLifecycle({
  name,
  onInitialize,
  onMount,
  onSuspend,
  onResume,
  onDestroy,
}: SceneLifecycleOptions) {
  const currentScene = useStore((state) => state.currentScene);
  const isActive = currentScene === name;

  // Store callbacks in refs to keep effect deps stable
  const onInitializeRef = React.useRef(onInitialize);
  const onMountRef = React.useRef(onMount);
  const onSuspendRef = React.useRef(onSuspend);
  const onResumeRef = React.useRef(onResume);
  const onDestroyRef = React.useRef(onDestroy);

  // Sync refs in an effect to comply with React 19 strict rules
  // (refs must not be written during render)
  React.useEffect(() => {
    onInitializeRef.current = onInitialize;
    onMountRef.current = onMount;
    onSuspendRef.current = onSuspend;
    onResumeRef.current = onResume;
    onDestroyRef.current = onDestroy;
  });

  // Initialize on first mount, destroy on unmount
  React.useEffect(() => {
    onInitializeRef.current?.();
    sceneEventEmitter.emit(`${name}:initialize`);

    return () => {
      onDestroyRef.current?.();
      sceneEventEmitter.emit(`${name}:destroy`);
    };
  }, [name]);

  // Mount/Resume when active, Suspend when inactive
  React.useEffect(() => {
    if (isActive) {
      onMountRef.current?.();
      sceneEventEmitter.emit(`${name}:mount`);
      onResumeRef.current?.();
      sceneEventEmitter.emit(`${name}:resume`);
    } else {
      onSuspendRef.current?.();
      sceneEventEmitter.emit(`${name}:suspend`);
    }
  }, [isActive, name]);
}
export default useSceneLifecycle;

