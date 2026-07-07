'use client';

import * as React from 'react';
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { useStore } from '@/lib/store';

// Cast components to any to bypass React 19 typings bugs in react-three-postprocessing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComposerElement = EffectComposer as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BloomElement = Bloom as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DepthOfFieldElement = DepthOfField as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChromaticAberrationElement = ChromaticAberration as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VignetteElement = Vignette as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NoiseElement = Noise as any;

export function EffectsPipeline() {
  // Disable post effects on low-quality settings or manual user toggle
  const postProcessingEnabled = useStore((state) => state.postProcessingEnabled);
  const quality = useStore((state) => state.quality);

  if (!postProcessingEnabled || quality === 'low') {
    return null;
  }

  return (
    <ComposerElement disableNormalPass multisampling={0}>
      {/* 1. Bloom - Simulates intense radiation flares (Sun core glow) */}
      <BloomElement mipmapBlur intensity={1.2} luminanceThreshold={0.8} luminanceSmoothing={0.05} />

      {/* 2. Depth Of Field - Standard camera focal range blur mapping */}
      <DepthOfFieldElement focusDistance={0.02} focalLength={0.05} bokehScale={2} />

      {/* 3. Chromatic Aberration - Subtle lens chromatic aberration color splitting */}
      <ChromaticAberrationElement offset={[0.0008, 0.0008]} />

      {/* 4. Vignette - Subtle frame border shading to focus viewport elements */}
      <VignetteElement eskil={false} offset={0.5} darkness={0.6} />

      {/* 5. Noise - Minimal film grain to match HUD terminal instrumentation texture */}
      <NoiseElement opacity={0.015} />
    </ComposerElement>
  );
}
export default EffectsPipeline;
