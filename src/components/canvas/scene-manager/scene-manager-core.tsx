'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { sceneEventEmitter } from './events/scene-event-emitter';
import { ErrorScene } from './scenes/error-scene';
import { GalaxyScene } from './scenes/galaxy/galaxy-scene';
import { LoadingScene } from './scenes/loading-scene';
import { PlanetScene } from './scenes/planet-scene';
import { SolarSystemScene } from './scenes/solar-system-scene';

export function SceneManagerCore() {
  // Sync manager render switches to the Zustand currentScene store
  const currentScene = useStore((state) => state.currentScene);
  const previousScene = React.useRef(currentScene);

  React.useEffect(() => {
    if (previousScene.current !== currentScene) {
      // 1. Emit transition starting parameters
      sceneEventEmitter.emit('transition:start', {
        from: previousScene.current,
        to: currentScene,
      });

      // 2. Schedule transition ending indicators dispatch
      const timer = setTimeout(() => {
        sceneEventEmitter.emit('transition:end', {
          from: previousScene.current,
          to: currentScene,
        });
        previousScene.current = currentScene;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentScene]);

  // Declarative Scene Router switching component trees
  switch (currentScene) {
    case 'LOADING':
      return <LoadingScene />;
    case 'GALAXY':
      return <GalaxyScene />;
    case 'SYSTEM':
      return <SolarSystemScene />;
    case 'PLANET':
      return <PlanetScene />;
    case 'ERROR':
      return <ErrorScene />;
    default:
      return <GalaxyScene />;
  }
}
export default SceneManagerCore;
