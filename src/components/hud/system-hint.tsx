'use client';

import * as React from 'react';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { useNavigationStore } from '@/components/navigation/navigation-store';

/**
 * Minimal hint shown once the user enters the solar system.
 */
export function SystemHint() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const travelState = useCameraTravelStore((s) => s.state);
  const hoveredId = useNavigationStore((s) => s.currentPlanetId);

  const inSystem = heroPhase === 'dismissed';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const viewingSection = navState === 'viewingSection' || navState === 'focused';

  const visible = inSystem && !travelling && !viewingSection && !hoveredId;

  if (!visible) return null;

  return (
    <p className="system-hint" role="status" aria-live="polite">
      Select a planet to explore
    </p>
  );
}
