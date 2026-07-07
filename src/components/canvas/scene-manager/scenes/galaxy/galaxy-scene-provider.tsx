'use client';

import * as React from 'react';
import { GALAXY_SCENE_CONFIG, type GalaxySceneConfig } from './galaxy-scene-config';
import { GALAXY_SCENE_SETTINGS, type GalaxySceneSettings } from './galaxy-scene-settings';

interface GalaxySceneContextType {
  config: GalaxySceneConfig;
  settings: GalaxySceneSettings;
}

const GalaxySceneContext = React.createContext<GalaxySceneContextType | null>(null);

export function GalaxySceneProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({
      config: GALAXY_SCENE_CONFIG,
      settings: GALAXY_SCENE_SETTINGS,
    }),
    []
  );

  return <GalaxySceneContext.Provider value={value}>{children}</GalaxySceneContext.Provider>;
}

export function useGalaxyScene() {
  const context = React.useContext(GalaxySceneContext);
  if (!context) {
    throw new Error('useGalaxyScene must be used within a GalaxySceneProvider');
  }
  return context;
}
