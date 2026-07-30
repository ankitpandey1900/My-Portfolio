'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { DebugHudLayer } from '@/components/debug/debug-hud-layer';
import { CinematicDirectorProvider } from '@/components/director/cinematic-director-provider';
import { GestureProvider } from '@/components/gesture/gesture-provider';
import { HomePlanetProvider } from '@/components/home/home-planet-provider';
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

const ExperienceCanvas = dynamic(
  () => import('@/components/canvas/experience-canvas').then((mod) => mod.ExperienceCanvas),
  { ssr: false }
);

export function SceneRoot() {
  return (
    <NavigationProvider>
      <LandingProvider>
        <TransitionProvider>
          <GestureProvider>
            <SectionLoaderProvider>
              <CinematicDirectorProvider />
              <HomePlanetProvider>
                <ExperienceCanvas />
                <TravelVignette />
                <SystemNavigation />
                <SimulationControls />
                <PhysicsScanner />
                <PlanetLabel />
                <SectionRenderer />
                <DebugHudLayer />
              </HomePlanetProvider>
            </SectionLoaderProvider>
          </GestureProvider>
        </TransitionProvider>
      </LandingProvider>
    </NavigationProvider>
  );
}
export default SceneRoot;
