'use client';

import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { SceneWrapper } from '../scene-wrapper';
import { AsteroidBelt } from './environment/asteroid-belt';

import { CometTrail } from './environment/comet-trail';
import { MeteorShower } from './environment/meteor-shower';
import { SupernovaRemnant } from './environment/supernova-remnant';
import { VoyagerProbe } from './environment/voyager-probe';
import { PlanetGenerator } from './generator/planet-generator';
import { InteractionProvider } from './interaction/interaction-provider';
import { PlanetRegistryManager } from './planet/planet-registry-manager';
import { SolarSystemManager } from './solar-system-manager';
import { SolarSystemProvider } from './solar-system-provider';
import { useSolarSystemSimulation } from './solar-system-store';
import { Sun } from './sun/sun';

function TimeManager() {
  const advanceTime = useSolarSystemSimulation((s) => s.advanceTime);
  useFrame((_, delta) => {
    // Limit delta to prevent huge jumps if tab was inactive
    const safeDelta = Math.min(delta, 0.1);
    advanceTime(safeDelta);
  });
  return null;
}

function SolarSystemSceneContent() {
  return (
    <group name="solar-system-contents">
      <TimeManager />
      <SolarSystemManager />
      {/* Registry manager loads initial catalog setups on mount */}
      <PlanetRegistryManager />
      {/* Sun rendering center of solar system */}
      <Sun />
      {/* Stars Removed for Stability */}
      <SupernovaRemnant />
      <AsteroidBelt />
      <MeteorShower />
      <VoyagerProbe />
      <CometTrail />
      <InteractionProvider>
        <PlanetGenerator />
      </InteractionProvider>

    </group>
  );
}

/**
 * SolarSystemScene entry integration.
 * Wraps SceneWrapper within SolarSystemProvider context container.
 */
export function SolarSystemScene() {
  return (
    <SolarSystemProvider>
      <SceneWrapper name="SYSTEM">
        <SolarSystemSceneContent />
      </SceneWrapper>
    </SolarSystemProvider>
  );
}
export default SolarSystemScene;

