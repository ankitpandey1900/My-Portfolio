/* eslint-disable react-hooks/immutability */
'use client';

import * as React from 'react';
import { Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore, type SpaceEnvPreset, type ToneMappingType } from '@/lib/store';

// Map user-friendly presets to Drei built-in environment maps
const DREI_PRESET_MAP: Record<SpaceEnvPreset, 'night' | 'sunset' | 'city'> = {
  'deep-space': 'night',
  'nebula-glow': 'sunset',
  'solar-flare': 'city',
};

// Map custom string tone mapping to Three.js constants
const TONE_MAPPING_MAP: Record<ToneMappingType, THREE.ToneMapping> = {
  ACESFilmic: THREE.ACESFilmicToneMapping,
  Cineon: THREE.CineonToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  None: THREE.NoToneMapping,
};

/**
 * EnvironmentManager coordinates global tone mapping, exposure settings,
 * and mounts Drei's Environment system to provide image-based lighting (IBL).
 */
export function EnvironmentManager() {
  const { gl } = useThree();

  const exposure = useStore((state) => state.exposure);
  const toneMapping = useStore((state) => state.toneMapping);
  const envPreset = useStore((state) => state.envPreset);
  const environmentIntensity = useStore((state) => state.environmentIntensity);
  const showHDRIBackground = useStore((state) => state.showHDRIBackground);

  // Dynamically update renderer parameters when exposure or tone mapping settings change
  React.useEffect(() => {
    gl.toneMappingExposure = exposure;
    gl.toneMapping = TONE_MAPPING_MAP[toneMapping];
  }, [gl, exposure, toneMapping]);

  const dreiPreset = DREI_PRESET_MAP[envPreset];

  return (
    <Environment
      preset={dreiPreset}
      background={showHDRIBackground}
      blur={0.8} // Blur the background if shown, to keep it atmospheric
      environmentIntensity={environmentIntensity}
    />
  );
}
export default EnvironmentManager;
