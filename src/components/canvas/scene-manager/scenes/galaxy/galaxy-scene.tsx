'use client';

import * as React from 'react';
import { SceneWrapper } from '../scene-wrapper';
import { useGalaxySceneLifecycle } from './galaxy-scene-lifecycle';
import { GalaxySceneProvider } from './galaxy-scene-provider';

function GalaxySceneContent() {
  // Bind dynamic scene lifecycle stages
  useGalaxySceneLifecycle();

  return (
    <group name="galaxy-scene-contents">
      {/* 3D Galaxy background particles placeholder */}
      <group name="galaxy-particles-placeholder" />
    </group>
  );
}

/**
 * GalaxyScene coordinates the overall scene integration:
 * Provider context wraps the SceneWrapper to inject configs,
 * and SceneContent handles active mount/unmount triggers.
 */
export function GalaxyScene() {
  return (
    <GalaxySceneProvider>
      <SceneWrapper name="GALAXY">
        <GalaxySceneContent />
      </SceneWrapper>
    </GalaxySceneProvider>
  );
}
export default GalaxyScene;
