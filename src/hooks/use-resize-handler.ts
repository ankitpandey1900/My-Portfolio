'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';

/**
 * Debounced resize handler that updates viewport dimensions in the Zustand store.
 *
 * Components and hooks can read `viewport.width`, `viewport.height`, and
 * `viewport.aspect` for responsive 3D layout calculations (e.g. adapting
 * orbit radii or HUD element placement based on screen aspect ratio).
 */
export function useResizeHandler() {
  const setViewport = useStore((state) => state.setViewport);

  React.useEffect(() => {
    let rafId: number | null = null;

    const handleResize = () => {
      // Debounce via requestAnimationFrame — fires at most once per frame
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setViewport(window.innerWidth, window.innerHeight);
        rafId = null;
      });
    };

    // Set initial dimensions
    setViewport(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [setViewport]);
}
export default useResizeHandler;

