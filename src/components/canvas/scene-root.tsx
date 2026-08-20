'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { DebugHudLayer } from '@/components/debug/debug-hud-layer';
import { CinematicDirectorProvider } from '@/components/director/cinematic-director-provider';
import { GestureProvider } from '@/components/gesture/gesture-provider';
import { PhysicsScanner } from '@/components/hud/physics-scanner';
import { PlanetLabel } from '@/components/hud/planet-label';
import { SimulationControls } from '@/components/hud/simulation-controls';
import { SystemNavigation } from '@/components/hud/system-navigation';
import { TravelVignette } from '@/components/hud/travel-vignette';
import { LandingProvider } from '@/components/landing/landing-provider';
import { NavigationProvider } from '@/components/navigation/navigation-provider';
import { SectionLoaderProvider } from '@/components/section-loader/section-loader-provider';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { TransitionProvider } from '@/components/transition/transition-provider';
import { useStore } from '@/lib/store';
import { useHomePlanetStore } from '@/components/home/home-planet-state';

const ExperienceCanvas = dynamic(
  () => import('@/components/canvas/experience-canvas').then((mod) => mod.ExperienceCanvas),
  { ssr: false }
);

function SolarSystemInitializer() {
  const setCurrentScene = useStore((s) => s.setCurrentScene);
  const setCameraPreset = useStore((s) => s.setCameraPreset);
  const setCameraMode = useStore((s) => s.setCameraMode);
  const setPhase = useHomePlanetStore((s) => s.setPhase);

  React.useEffect(() => {
    // Skip the old homepage cinematic intro and go straight to the interactive system
    setCurrentScene('SYSTEM');
    setCameraPreset('system');
    setCameraMode('orbit');
    setPhase('dismissed'); // Ensure HUD components mount
  }, [setCurrentScene, setCameraPreset, setCameraMode, setPhase]);

  return null;
}

export function SceneRoot() {
  return (
    <NavigationProvider>
      <LandingProvider>
        <TransitionProvider>
          <GestureProvider>
            <SectionLoaderProvider>
              <CinematicDirectorProvider />
              <SolarSystemInitializer />
              <ExperienceCanvas />
              <TravelVignette />
              <SystemNavigation />
              <SimulationControls />
              <PhysicsScanner />
              <PlanetLabel />
              <SectionRenderer />
              <DebugHudLayer />
            </SectionLoaderProvider>
          </GestureProvider>
        </TransitionProvider>
      </LandingProvider>
    </NavigationProvider>
  );
}
export default SceneRoot;

