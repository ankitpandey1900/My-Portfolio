'use client';

import * as React from 'react';
import { DEFAULT_SOLAR_CONFIG } from './solar-system-config';
import { SolarSystemRegistry } from './solar-system-registry';
import type { SolarSystemState } from './solar-system-state';
import type { SolarSystemConfig } from './solar-system-types';

const SolarSystemContext = React.createContext<SolarSystemState | null>(null);

interface SolarSystemProviderProps {
  children: React.ReactNode;
}

/**
 * SolarSystemProvider wraps the scene nodes graph.
 * Manages configuration updates and target registers locally.
 */
export function SolarSystemProvider({ children }: SolarSystemProviderProps) {
  // Pre-allocate the registry instance once on mount
  const registry = React.useMemo(() => new SolarSystemRegistry(), []);

  const [config, setConfig] = React.useState<SolarSystemConfig>(DEFAULT_SOLAR_CONFIG);
  const [activeTargetId, setActiveTargetId] = React.useState<string | null>(null);
  const [isOrbitActive, setOrbitActive] = React.useState<boolean>(true);

  const setActiveTarget = React.useCallback((id: string | null) => {
    setActiveTargetId(id);
  }, []);

  const updateConfig = React.useCallback((updater: Partial<SolarSystemConfig>) => {
    setConfig((prev) => ({ ...prev, ...updater }));
  }, []);

  const value = React.useMemo<SolarSystemState>(
    () => ({
      config,
      activeTargetId,
      registry,
      isOrbitActive,
      setActiveTarget,
      setOrbitActive,
      updateConfig,
    }),
    [config, activeTargetId, registry, isOrbitActive, setActiveTarget, updateConfig]
  );

  return <SolarSystemContext.Provider value={value}>{children}</SolarSystemContext.Provider>;
}

export function useSolarSystem() {
  const context = React.useContext(SolarSystemContext);
  if (!context) {
    throw new Error('useSolarSystem must be used within a SolarSystemProvider');
  }
  return context;
}
export default SolarSystemProvider;

