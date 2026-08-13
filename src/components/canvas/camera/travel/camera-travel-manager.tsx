'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { CAMERA_PRESETS } from '../camera-presets';
import { useCameraTravelStore } from './camera-travel-state';

/**
 * Bridges legacy preset targets into travel requests without fighting navigation travel.
 */
export function CameraTravelManager() {
  const queueTravel = useCameraTravelStore((state) => state.queueTravel);
  const activePlanet = useStore((state) => state.activePlanet);
  const targetPos = useStore((state) => state.targetPosition);
  const targetLook = useStore((state) => state.targetLookAt);

  React.useEffect(() => {
    const navState = useNavigationStore.getState().state;
    const travelState = useCameraTravelStore.getState().state;

    if (
      navState === 'travelling' ||
      navState === 'focused' ||
      navState === 'viewingSection' ||
      navState === 'planetSelected' ||
      navState === 'returning' ||
      travelState === 'preparing' ||
      travelState === 'travelling'
    ) {
      return;
    }

    queueTravel({
      targetId: null,
      targetPosition: targetPos,
      targetLookAt: targetLook,
      durationMs: 2800,
      easing: 'ease-in-out',
    });
  }, [targetPos, targetLook, queueTravel]);

  React.useEffect(() => {
    if (activePlanet !== null) return;

    const navState = useNavigationStore.getState().state;
    const travelState = useCameraTravelStore.getState().state;

    if (navState === 'returning' || navState === 'travelling') return;
    if (travelState !== 'focused') return;

    queueTravel({
      targetId: null,
      targetPosition: CAMERA_PRESETS.system.position,
      targetLookAt: CAMERA_PRESETS.system.lookAt,
      durationMs: 2200,
      easing: 'ease-in-out',
    });
  }, [activePlanet, queueTravel]);

  return null;
}

