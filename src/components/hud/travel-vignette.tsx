'use client';

import * as React from 'react';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';
import { cn } from '@/lib/utils';

function getReducedMotionPreference() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Subtle vignette overlay during camera travel — cinematic without motion sickness.
 * Respects prefers-reduced-motion.
 */
export function TravelVignette() {
  const travelState = useCameraTravelStore((s) => s.state);
  const progress = useCameraTravelStore((s) => s.progress);
  const [reducedMotion, setReducedMotion] = React.useState(getReducedMotionPreference);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isActive = !reducedMotion && (travelState === 'preparing' || travelState === 'travelling');
  const opacity = isActive ? 0.15 + Math.sin(progress * Math.PI) * 0.25 : 0;

  return (
    <div
      aria-hidden="true"
      className={cn('travel-vignette', isActive && 'travel-vignette--active')}
      style={{ opacity }}
    />
  );
}
