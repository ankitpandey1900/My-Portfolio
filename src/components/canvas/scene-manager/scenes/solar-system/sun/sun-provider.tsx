'use client';

import * as React from 'react';
import { SUN_PRESETS } from './sun-config';
import type { SunPresetConfig } from './sun-types';

interface SunContextType {
  config: SunPresetConfig;
  setConfig: React.Dispatch<React.SetStateAction<SunPresetConfig>>;
}

const SunContext = React.createContext<SunContextType | null>(null);

export function SunProvider({ children }: { children: React.ReactNode }) {
  // Start with default high preset configuration on mount
  const [config, setConfig] = React.useState<SunPresetConfig>(SUN_PRESETS.high);

  const value = React.useMemo(() => ({ config, setConfig }), [config]);

  return <SunContext.Provider value={value}>{children}</SunContext.Provider>;
}

export function useSun() {
  const context = React.useContext(SunContext);
  if (!context) {
    throw new Error('useSun must be used within a SunProvider');
  }
  return context;
}
export default SunProvider;
