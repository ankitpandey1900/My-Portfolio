'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useDebugHudEnabled } from '@/lib/debug-hud';
import { useStore } from '@/lib/store';
import { SUN_PRESETS } from './sun-config';
import { useSun } from './sun-provider';

const SunLevaControls = dynamic(
  () => import('./sun-leva-controls').then((mod) => mod.SunLevaControls),
  { ssr: false }
);

export function SunManager() {
  const { setConfig } = useSun();
  const qualityTier = useStore((state) => state.qualityTier);
  const debugHud = useDebugHudEnabled();

  React.useEffect(() => {
    const preset = SUN_PRESETS[qualityTier];
    if (preset) {
      setConfig(preset);
    }
  }, [qualityTier, setConfig]);

  if (!debugHud) return null;

  return <SunLevaControls />;
}

export default SunManager;
