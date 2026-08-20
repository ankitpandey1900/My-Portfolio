'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { useStore } from '@/lib/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ComposerElement = EffectComposer as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BloomElement = Bloom as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VignetteElement = Vignette as any;

export function EffectsPipeline() {
  const postProcessingEnabled = useStore((state) => state.postProcessingEnabled);
  const quality = useStore((state) => state.quality);

  if (!postProcessingEnabled || quality === 'low') {
    return null;
  }

  return (
    <ComposerElement multisampling={0}>
      <BloomElement
        mipmapBlur
        intensity={0.3} // Gentle bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.2}
      />
      <VignetteElement eskil={false} offset={0.28} darkness={0.55} />
    </ComposerElement>
  );
}
export default EffectsPipeline;

