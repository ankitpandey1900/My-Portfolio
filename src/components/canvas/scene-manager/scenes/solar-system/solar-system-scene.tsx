'use client';

import * as React from 'react';
import { SceneWrapper } from '../scene-wrapper';
import { PlanetGenerator } from './generator/planet-generator';
import { AsteroidBelt } from './environment/asteroid-belt';
import { BlackHole } from './environment/black-hole';
import { CometTrail } from './environment/comet-trail';
import { MeteorShower } from './environment/meteor-shower';
import { SupernovaRemnant } from './environment/supernova-remnant';
import { VoyagerProbe } from './environment/voyager-probe';
import { InteractionProvider } from './interaction/interaction-provider';
import { PlanetRegistryManager } from './planet/planet-registry-manager';
import { SolarSystemManager } from './solar-system-manager';
import { SolarSystemProvider } from './solar-system-provider';
import { Sun } from './sun/sun';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function SolarSystemSceneContent() {
  return (
    <group name="solar-system-contents">
      <SolarSystemManager />
      {/* Registry manager loads initial catalog setups on mount */}
      <PlanetRegistryManager />
      {/* Sun rendering center of solar system */}
      <Sun />
      <BlackHole />
      <SupernovaRemnant />
      <AsteroidBelt />
      <MeteorShower />
      <VoyagerProbe />
      <CometTrail />
      <InteractionProvider>
        <PlanetGenerator />
      </InteractionProvider>

      {/* Cinematic Post-Processing */}
      <EffectComposer multisampling={4}>
        <Bloom 
          luminanceThreshold={0.4} 
          luminanceSmoothing={0.9} 
          intensity={1.5} 
          mipmapBlur 
        />
      </EffectComposer>
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
