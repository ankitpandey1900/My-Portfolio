'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';

/**
 * Manages render loop pausing based on browser visibility.
 *
 * When the browser tab is hidden (user switches tabs), the R3F render loop
 * continues running but wastes GPU cycles on invisible frames. This hook
 * sets `isRenderActive` to false, allowing expensive scene components to
 * skip calculations in their useFrame callbacks.
 *
 * Usage in scene components:
 * ```ts
 * const isRenderActive = useStore((s) => s.isRenderActive);
 * useFrame((_, delta) => {
 *   if (!isRenderActive) return; // Skip when tab is hidden
 *   // expensive calculations...
 * });
 * ```
 */
export function useRenderLifecycle() {
  const setRenderActive = useStore((state) => state.setRenderActive);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setRenderActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set initial state
    setRenderActive(document.visibilityState === 'visible');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setRenderActive]);
}
export default useRenderLifecycle;

