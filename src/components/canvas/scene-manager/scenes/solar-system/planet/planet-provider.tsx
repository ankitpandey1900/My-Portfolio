'use client';

import * as React from 'react';
import type { PlanetStateContextType } from './planet-state';
import type { PlanetConfig, PlanetLifecycleStage, PlanetState } from './planet-types';

const PlanetContext = React.createContext<PlanetStateContextType | null>(null);

interface PlanetProviderProps {
  config: PlanetConfig;
  children: React.ReactNode;
}

/**
 * PlanetProvider distributes state (idle/focused/hovered) and configuration details
 * locally to all child mesh layers, rings, and atmospheres.
 */
export function PlanetProvider({ config, children }: PlanetProviderProps) {
  const [state, setState] = React.useState<PlanetState>('idle');
  const [lifecycle, setLifecycle] = React.useState<PlanetLifecycleStage>('initialize');

  const value = React.useMemo<PlanetStateContextType>(
    () => ({
      state,
      lifecycle,
      config,
      setState,
      setLifecycle,
    }),
    [state, lifecycle, config]
  );

  return <PlanetContext.Provider value={value}>{children}</PlanetContext.Provider>;
}

export function usePlanet() {
  const context = React.useContext(PlanetContext);
  if (!context) {
    throw new Error('usePlanet must be used within a PlanetProvider');
  }
  return context;
}
export default PlanetProvider;
