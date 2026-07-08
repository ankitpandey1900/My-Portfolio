'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Manager
// Headless component: mounts, starts sequence, handles external events.
// Does NOT render any UI.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { CinematicDirectorController } from '@/components/director/cinematic-director-controller';
import { preloadTextures } from '@/hooks/use-async-textures';
import { MOON_TEXTURE, PLANET_TEXTURES } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-texture-config';
import { HomePlanetController } from './home-planet-controller';
import { HomePlanetEvents } from './home-planet-events';

function getPreloadUrls(): string[] {
  const planetUrls = Object.values(PLANET_TEXTURES).flatMap((set) =>
    [set.map, set.normalMap, set.specularMap, set.emissiveMap, set.clouds].filter(
      (url): url is string => Boolean(url)
    )
  );
  return [...planetUrls, MOON_TEXTURE];
}

export function HomePlanetManager() {
  React.useEffect(() => {
    preloadTextures(getPreloadUrls());
    HomePlanetEvents.emit('home:heroMounted');
    CinematicDirectorController.playSequence('IntroSequence');

    const cleanup = HomePlanetController.startSequence();

    return () => {
      cleanup();
      HomePlanetController.reset();
    };
  }, []);

  return null;
}
