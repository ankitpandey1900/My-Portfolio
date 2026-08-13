'use client';

import * as React from 'react';
import { SceneWrapper } from '../scene-wrapper';
import { BlackHole } from '../solar-system/environment/black-hole';
import { HeroEngineScene } from './hero-engine-scene';
import { useGalaxySceneLifecycle } from './galaxy-scene-lifecycle';
import { GalaxySceneProvider } from './galaxy-scene-provider';

function GalaxySceneContent() {
  useGalaxySceneLifecycle();

  return (
    <group name="galaxy-scene-contents">
      <group scale={0.55} position={[-48, 6, -42]}>
        <BlackHole />
      </group>
      <HeroEngineScene />
    </group>
  );
}

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

