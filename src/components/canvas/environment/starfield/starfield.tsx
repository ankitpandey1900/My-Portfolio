'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { StarLayer } from './star-layer';
import { STARFIELD_PRESETS } from './starfield-config';

/**
 * Starfield composes multiple StarLayers into the full infinite starfield.
 *
 * Reads `qualityTier` from the Zustand store to select the appropriate
 * preset configuration. When the quality tier changes (via the adaptive
 * quality system), the starfield automatically re-renders with the new
 * star counts and layer configs.
 *
 * Each StarLayer is keyed by `${tier}-${layer.id}` so React properly
 * unmounts/remounts layers when the tier changes, triggering geometry
 * regeneration and GPU resource disposal.
 */
export function Starfield() {
  const qualityTier = useStore((state) => state.qualityTier);
  const preset = STARFIELD_PRESETS[qualityTier];

  return (
    <group name="starfield">
      {preset.layers.map((layerConfig) => (
        <StarLayer key={`${qualityTier}-${layerConfig.id}`} config={layerConfig} />
      ))}
    </group>
  );
}
export default Starfield;
