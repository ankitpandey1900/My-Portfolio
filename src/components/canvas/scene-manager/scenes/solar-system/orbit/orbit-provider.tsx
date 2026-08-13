'use client';

import * as React from 'react';
import type { OrbitStateContextType } from './orbit-state';
import type { OrbitConfig, OrbitLifecycleStage, OrbitState } from './orbit-types';

const OrbitContext = React.createContext<OrbitStateContextType | null>(null);

interface OrbitProviderProps {
  config: OrbitConfig;
  children: React.ReactNode;
}

/**
 * OrbitProvider distributes mechanical configurations and active status (running/paused)
 * locally to the orbit rendering path segments and children groups.
 */
export function OrbitProvider({ config, children }: OrbitProviderProps) {
  const [state, setState] = React.useState<OrbitState>('initializing');
  const [lifecycle, setLifecycle] = React.useState<OrbitLifecycleStage>('initialize');

  const value = React.useMemo<OrbitStateContextType>(
    () => ({
      state,
      lifecycle,
      config,
      setState,
      setLifecycle,
    }),
    [state, lifecycle, config]
  );

  return <OrbitContext.Provider value={value}>{children}</OrbitContext.Provider>;
}

export function useOrbit() {
  const context = React.useContext(OrbitContext);
  if (!context) {
    throw new Error('useOrbit must be used within an OrbitProvider');
  }
  return context;
}
export default OrbitProvider;

