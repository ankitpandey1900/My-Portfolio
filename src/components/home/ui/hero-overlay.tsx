'use client';

import type { HomePlanetPhase } from '../home-planet-types';

interface HeroOverlayProps {
  phase: HomePlanetPhase;
}

/**
 * Full-screen overlay for phase transitions.
 * Warp-speed effect on dismiss.
 */
export function HeroOverlay({ phase }: HeroOverlayProps) {
  if (phase === 'idle' || phase === 'dismissed') return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[15] pointer-events-none transition-opacity duration-1000"
      style={{ opacity: phase === 'initializing' ? 1 : 0 }}
    >
      <div className="absolute inset-0 bg-[#050510]" />
    </div>
  );
}
