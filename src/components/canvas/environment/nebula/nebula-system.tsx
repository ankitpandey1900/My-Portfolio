'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { NEBULA_PRESETS } from './nebula-config';
import { NebulaLayer } from './nebula-layer';

/**
 * NebulaSystem composes multiple NebulaLayer shells.
 * It selects configurations based on the active quality tier and
 * applies a global opacity modifier from the store's nebulaIntensity.
 */
export function NebulaSystem() {
  const qualityTier = useStore((state) => state.qualityTier);
  const nebulaIntensity = useStore((state) => state.nebulaIntensity);

  const layers = NEBULA_PRESETS[qualityTier];

  return (
    <group name="nebula-system">
      {layers.map((layerConfig) => (
        <NebulaLayer
          key={`${qualityTier}-${layerConfig.id}`}
          config={layerConfig}
          globalIntensity={nebulaIntensity}
        />
      ))}
    </group>
  );
}
export default NebulaSystem;
