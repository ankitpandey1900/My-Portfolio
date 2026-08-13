// ─────────────────────────────────────────────────────────────────────────────
// Starfield Renderer
// Renders the correct number of StarLayers based on active engine state.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useStore } from '@/lib/store';
import { StarLayer } from './star-layer';
import { useStarfieldStore } from './starfield-state';

export function StarfieldRenderer() {
  const qualityTier = useStore((state) => state.qualityTier);
  const activeConfig = useStarfieldStore((state) => state.activeConfig);

  const layers = activeConfig.layers[qualityTier];

  if (!layers || layers.length === 0) return null;

  return (
    <group name="starfield-renderer" scale={activeConfig.parallaxStrength}>
      {layers.map((layerConfig) => (
        <StarLayer
          key={`${qualityTier}-${layerConfig.id}`}
          config={layerConfig}
          globalOpacity={activeConfig.opacityBase}
          globalSize={activeConfig.sizeBase}
          globalTwinkleSpeed={activeConfig.twinkleSpeedBase}
        />
      ))}
    </group>
  );
}

