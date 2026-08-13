'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { NebulaLayer } from './nebula-layer';
import { useNebulaStore } from './nebula-state';

/**
 * NebulaRenderer composes multiple NebulaLayer shells.
 * It selects configurations based on the active quality tier and
 * applies global modifiers from the active config.
 */
export function NebulaRenderer() {
  const qualityTier = useStore((state) => state.qualityTier);
  const activeConfig = useNebulaStore((state) => state.activeConfig);

  const layers = activeConfig.layers[qualityTier];

  return (
    <group name="nebula-renderer">
      {layers.map((layerConfig) => (
        <NebulaLayer
          key={`${qualityTier}-${layerConfig.id}`}
          config={layerConfig}
          globalDensity={activeConfig.density}
          globalOpacity={activeConfig.opacity}
          globalSpeed={activeConfig.speedBase}
          globalScale={activeConfig.scaleBase}
        />
      ))}
    </group>
  );
}

