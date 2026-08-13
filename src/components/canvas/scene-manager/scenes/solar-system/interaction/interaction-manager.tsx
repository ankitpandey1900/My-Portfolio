'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { InteractionEvents } from './interaction-events';
import { NavigationEvents } from '@/components/navigation/navigation-events';
import { useInteractionStore } from './interaction-state';

/**
 * InteractionManager
 * Centralized event handling.
 * Listens to InteractionEvents, updates the interaction state, and bridges external store states.
 */
export function InteractionManager() {
  const { setHovered, setSelected, selectedPlanetId } = useInteractionStore();
  const setActivePlanet = useStore((state) => state.setActivePlanet);
  const activePlanet = useStore((state) => state.activePlanet);

  // Bind global interaction events to state updates
  React.useEffect(() => {
    const unsubHover = InteractionEvents.on('PlanetHover', (payload) => {
      setHovered(payload.planetId);
    });

    const unsubLeave = InteractionEvents.on('PlanetLeave', (payload) => {
      // Only clear if the planet leaving is the currently hovered one
      if (useInteractionStore.getState().hoveredPlanetId === payload.planetId) {
        setHovered(null);
      }
    });

    const unsubClick = InteractionEvents.on('PlanetClick', (payload) => {
      setSelected(payload.planetId);
      setActivePlanet(payload.planetId); // Sync to global portfolio store
    });

    const unsubFocus = InteractionEvents.on('PlanetFocus', (payload) => {
      setHovered(payload.planetId);
    });

    const unsubBlur = InteractionEvents.on('PlanetBlur', (payload) => {
      if (useInteractionStore.getState().hoveredPlanetId === payload.planetId) {
        setHovered(null);
      }
    });

    return () => {
      unsubHover();
      unsubLeave();
      unsubClick();
      unsubFocus();
      unsubBlur();
    };
  }, [setHovered, setSelected, setActivePlanet]);

  React.useEffect(() => {
    const unlockAll = () => {
      useInteractionStore.getState().setDisabled([]);
    };

    const unsubReset = NavigationEvents.on('NavigationReset', unlockAll);
    const unsubCompleted = NavigationEvents.on('TravelCompleted', unlockAll);
    const unsubCancelled = NavigationEvents.on('ReturnHome', unlockAll);

    return () => {
      unsubReset();
      unsubCompleted();
      unsubCancelled();
    };
  }, []);

  // Sync external global activePlanet changes back down to InteractionStore
  React.useEffect(() => {
    if (activePlanet !== selectedPlanetId) {
      setSelected(activePlanet);
    }
  }, [activePlanet, selectedPlanetId, setSelected]);

  // Manager is headless
  return null;
}

