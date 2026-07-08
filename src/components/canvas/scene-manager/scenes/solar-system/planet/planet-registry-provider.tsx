'use client';

import * as React from 'react';
import type { PlanetManifestEntry } from './planet-manifest';
import { PlanetRegistry } from './planet-registry';

interface PlanetRegistryContextType {
  getPlanet: (id: string) => PlanetManifestEntry | undefined;
  getPlanetBySlug: (slug: string) => PlanetManifestEntry | undefined;
  getPlanetBySection: (section: string) => PlanetManifestEntry | undefined;
  getAllPlanets: () => PlanetManifestEntry[];
  isLoaded: boolean;
}

const PlanetRegistryContext = React.createContext<PlanetRegistryContextType | null>(null);

interface PlanetRegistryProviderProps {
  children: React.ReactNode;
}

/**
 * PlanetRegistryProvider distributes access to registry queries throughout the application.
 */
export function PlanetRegistryProvider({ children }: PlanetRegistryProviderProps) {
  const isLoaded = true;

  const value = React.useMemo<PlanetRegistryContextType>(
    () => ({
      getPlanet: (id) => PlanetRegistry.get(id),
      getPlanetBySlug: (slug) => PlanetRegistry.getBySlug(slug),
      getPlanetBySection: (section) => PlanetRegistry.getBySection(section),
      getAllPlanets: () => PlanetRegistry.getAll(),
      isLoaded,
    }),
    [isLoaded]
  );

  return <PlanetRegistryContext.Provider value={value}>{children}</PlanetRegistryContext.Provider>;
}

export function usePlanetRegistry() {
  const context = React.useContext(PlanetRegistryContext);
  if (!context) {
    throw new Error('usePlanetRegistry must be used within a PlanetRegistryProvider');
  }
  return context;
}
export default PlanetRegistryProvider;
