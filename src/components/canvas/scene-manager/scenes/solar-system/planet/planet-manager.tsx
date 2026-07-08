'use client';

import * as React from 'react';
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import { usePlanet } from './planet-provider';

/**
 * PlanetManager handles lifecycle mapping:
 * Interaction mapping is now handled globally via PlanetInteraction engine.
 */
export function PlanetManager() {
  const { config, setLifecycle } = usePlanet();

  // 1. Lifecycle: Mount & Unmount triggers
  React.useEffect(() => {
    setLifecycle('mount');
    sceneEventEmitter.emit('planet:loaded', { id: config.id, name: config.name });

    return () => {
      setLifecycle('destroy');
      sceneEventEmitter.emit('planet:disposed', { id: config.id });
    };
  }, [config.id, config.name, setLifecycle]);

  return null;
}
export default PlanetManager;
