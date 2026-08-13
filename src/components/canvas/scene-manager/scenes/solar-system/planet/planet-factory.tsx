'use client';

import * as React from 'react';
import { PlanetComponent } from './planet-component';
import type { PlanetManifestEntry } from './planet-manifest';
import { PlanetProvider } from './planet-provider';
import { PlanetRegistry } from './planet-registry';

interface PlanetFactoryProps {
  id: string;
  fallbackEntry?: PlanetManifestEntry;
}

export function PlanetFactory({ id, fallbackEntry }: PlanetFactoryProps) {
  const config = React.useMemo(() => PlanetRegistry.get(id) ?? fallbackEntry, [id, fallbackEntry]);

  if (!config) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`PlanetFactory: Configuration for planet "${id}" not found in registry.`);
    }
    return null;
  }

  return (
    <PlanetProvider config={config}>
      <PlanetComponent />
    </PlanetProvider>
  );
}
export default PlanetFactory;

