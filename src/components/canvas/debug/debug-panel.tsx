'use client';

import * as React from 'react';
import { Stats } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

export function DebugPanel() {
  const isDev = process.env.NODE_ENV === 'development';
  const { camera } = useThree();

  const setQuality = useStore((state) => state.setQuality);
  const setPostProcessing = useStore((state) => state.setPostProcessing);
  const setEnvironment = useStore((state) => state.setEnvironment);
  const setExposure = useStore((state) => state.setExposure);
  const setEnvironmentIntensity = useStore((state) => state.setEnvironmentIntensity);
  const setEnvPreset = useStore((state) => state.setEnvPreset);
  const setToneMapping = useStore((state) => state.setToneMapping);
  const setHDRIBackground = useStore((state) => state.setHDRIBackground);
  const setCameraPreset = useStore((state) => state.setCameraPreset);
  const setCameraFov = useStore((state) => state.setCameraFov);

  // Mount Leva controllers (Only destructure keys directly to prevent typing mismatch)
  const { ambientLight, starDensity, nebulaIntensity } = useControls('3D Engine Controls', {
    quality: {
      value: 'high',
      options: ['low', 'high'],
      onChange: (v) => setQuality(v as 'low' | 'high'),
    },
    postProcessing: {
      value: true,
      onChange: (v) => setPostProcessing(v),
    },
    ambientLight: {
      value: 0.15,
      min: 0,
      max: 1,
      step: 0.05,
    },
    starDensity: {
      value: 10000,
      min: 1000,
      max: 20000,
      step: 1000,
    },
    nebulaIntensity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.05,
    },
    exposure: {
      value: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.05,
      onChange: (v) => setExposure(v),
    },
    environmentIntensity: {
      value: 1.0,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      onChange: (v) => setEnvironmentIntensity(v),
    },
    envPreset: {
      value: 'deep-space',
      options: ['deep-space', 'nebula-glow', 'solar-flare'],
      onChange: (v) => setEnvPreset(v as 'deep-space' | 'nebula-glow' | 'solar-flare'),
    },
    toneMapping: {
      value: 'ACESFilmic',
      options: ['ACESFilmic', 'Cineon', 'Linear', 'Reinhard', 'None'],
      onChange: (v) =>
        setToneMapping(v as 'ACESFilmic' | 'Cineon' | 'Linear' | 'Reinhard' | 'None'),
    },
    showHDRIBackground: {
      value: false,
      onChange: (v) => setHDRIBackground(v),
    },
    cameraPreset: {
      value: 'galaxy',
      options: ['galaxy', 'system', 'planet', 'cockpit'],
      onChange: (v) => setCameraPreset(v as 'galaxy' | 'system' | 'planet' | 'cockpit'),
    },
    cameraFov: {
      value: 45,
      min: 25,
      max: 75,
      step: 1,
      onChange: (v) => setCameraFov(v),
    },
    copyCameraCoords: button(() => {
      const pos = camera.position;
      const target = useStore.getState().targetLookAt;
      const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 45;
      const text = `Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}], Target: [${target[0]}, ${target[1]}, ${target[2]}], FOV: ${fov}`;
      navigator.clipboard.writeText(text);
      console.warn('Copied camera coordinates to clipboard:', text);
    }),
  });

  React.useEffect(() => {
    if (isDev) {
      setEnvironment(ambientLight as number, starDensity as number, nebulaIntensity as number);
    }
  }, [isDev, ambientLight, starDensity, nebulaIntensity, setEnvironment]);

  if (!isDev) {
    return null;
  }

  // Render Stats HUD overlays on dev screen margins
  return <Stats className="absolute top-16 left-4 z-50" />;
}
export default DebugPanel;
