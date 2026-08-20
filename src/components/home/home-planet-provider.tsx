'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Provider
// Context wrapper. Composes Manager + Hero UI together.
// Insert into SceneRoot alongside other providers.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { HomePlanetManager } from './home-planet-manager';

interface HomePlanetProviderProps {
  children: React.ReactNode;
}

export function HomePlanetProvider({ children }: HomePlanetProviderProps) {
  return (
    <>
      {/* Headless lifecycle manager */}
      <HomePlanetManager />
      {/* Rest of the application tree */}
      {children}
    </>
  );
}

