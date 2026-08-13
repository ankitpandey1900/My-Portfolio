'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { InteractionEvents } from '../canvas/scene-manager/scenes/solar-system/interaction/interaction-events';
import { NavigationController } from './navigation-controller';
import { useNavigationStore } from './navigation-store';

/**
 * NavigationManager
 * Headless event listener. Connects 3D interactions to the Navigation Controller.
 */
export function NavigationManager() {
  const setActivePlanet = useStore((state) => state.setActivePlanet);
  const currentPlanetId = useNavigationStore((state) => state.currentPlanetId);

  // Intercept Scene Interactions and convert to Navigation State
  React.useEffect(() => {
    const unsubClick = InteractionEvents.on('PlanetClick', (payload) => {
      if (payload.planetId) {
        NavigationController.explorePlanet(payload.planetId);
      }
    });

    const unsubDoubleClick = InteractionEvents.on('PlanetDoubleClick', (payload) => {
      if (payload.planetId) {
        NavigationController.enterPlanetSection(payload.planetId);
      }
    });

    return () => {
      unsubClick();
      unsubDoubleClick();
    };
  }, []);

  // Sync Legacy Global Store (for backward compatibility during migration)
  React.useEffect(() => {
    setActivePlanet(currentPlanetId);
  }, [currentPlanetId, setActivePlanet]);

  return null;
}

