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
    <ComposerElement disableNormalPass multisampling={0}>
      <BloomElement
        mipmapBlur
        intensity={0.2}
        luminanceThreshold={0.92}
        luminanceSmoothing={0.18}
      />
      <VignetteElement eskil={false} offset={0.28} darkness={0.55} />
    </ComposerElement>
  );
}
export default EffectsPipeline;
