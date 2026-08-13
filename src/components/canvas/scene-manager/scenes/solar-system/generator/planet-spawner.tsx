'use client';

import * as React from 'react';
import type { PlanetManifestEntry } from '../planet/planet-manifest';

interface PlanetSpawnerProps {
  entry: PlanetManifestEntry;
  children: React.ReactNode;
}

/**
 * PlanetSpawner handles conditional loading parameters:
 * Skips spawning if the manifest status is set to 'hidden'.
 */
export function PlanetSpawner({ entry, children }: PlanetSpawnerProps) {
  // If the status is hidden, skip spawning mesh into R3F scene trees
  if (entry.status === 'hidden') {
    return null;
  }

  return <>{children}</>;
}
export default PlanetSpawner;

