import * as React from 'react';

/** Debug HUD (Leva, FPS, state panels) — off by default. Enable with ?debug=1 or NEXT_PUBLIC_DEBUG_HUD=true */
export function isDebugHudEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DEBUG_HUD === 'true') return true;
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('debug');
}

/** Client-only debug flag — lazy init avoids SSR mismatch without an effect. */
export function useDebugHudEnabled(): boolean {
  const [enabled] = React.useState(() =>
    typeof window !== 'undefined' ? isDebugHudEnabled() : false
  );
  return enabled;
}
