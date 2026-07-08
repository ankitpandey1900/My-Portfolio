'use client';

import * as React from 'react';
import { Stats } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { EnvironmentController } from '../environment/environment-controller';
import type { EnvironmentPresetId, ToneMappingType } from '../environment/environment-types';
import { NebulaController } from '../environment/nebula/nebula-controller';
import type { NebulaPresetId } from '../environment/nebula/nebula-types';
import { StarfieldController } from '../environment/starfield/starfield-controller';
import type { StarfieldPresetId } from '../environment/starfield/starfield-types';

import { isDebugHudEnabled } from '@/lib/debug-hud';

export function DebugPanel() {
  const debugHud = isDebugHudEnabled();
  const { camera } = useThree();

  const setQuality = useStore((state) => state.setQuality);
  const setPostProcessing = useStore((state) => state.setPostProcessing);
  const setCameraPreset = useStore((state) => state.setCameraPreset);
  const setCameraFov = useStore((state) => state.setCameraFov);

  // Mount Leva controllers (Only destructure keys directly to prevent typing mismatch)
  const { ambientLight } = useControls('3D Engine Controls', {
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
    starfieldPreset: {
      value: 'realistic',
      options: ['ultra-dense', 'realistic', 'sparse', 'deep-space', 'minimal'],
      onChange: (v) => StarfieldController.setPreset(v as StarfieldPresetId),
    },
    starfieldDensity: {
      value: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      onChange: (v) => StarfieldController.setDensity(v),
    },
    nebulaPreset: {
      value: 'deep-space',
      options: ['deep-space', 'blue-nebula', 'purple-nebula', 'golden-nebula', 'minimal-space'],
      onChange: (v) => NebulaController.setPreset(v as NebulaPresetId),
    },
    nebulaOpacity: {
      value: 1.0,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (v) => NebulaController.updateConfig({ opacity: v }),
    },
    exposure: {
      value: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.05,
      onChange: (v) => EnvironmentController.updateConfig({ post: { exposure: v } }),
    },
    environmentIntensity: {
      value: 1.0,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      onChange: (v) =>
        EnvironmentController.updateConfig({ lighting: { environmentIntensity: v } }),
    },
    envPreset: {
      value: 'deep-space',
      options: ['deep-space', 'nebula-glow', 'solar-flare'],
      onChange: (v) => EnvironmentController.setPreset(v as EnvironmentPresetId),
    },
    toneMapping: {
      value: 'ACESFilmic',
      options: ['ACESFilmic', 'Cineon', 'Linear', 'Reinhard', 'None'],
      onChange: (v) =>
        EnvironmentController.updateConfig({ post: { toneMapping: v as ToneMappingType } }),
    },
    showHDRIBackground: {
      value: false,
      onChange: (v) =>
        EnvironmentController.updateConfig({ background: { mode: v ? 'hdri' : 'color' } }),
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
    if (debugHud) {
      EnvironmentController.updateConfig({
        lighting: { ambientIntensity: ambientLight as number },
      });
    }
  }, [debugHud, ambientLight]);

  if (!debugHud) {
    return null;
  }

  // Render Stats HUD overlays on dev screen margins
  return <Stats className="absolute top-16 left-4 z-50" />;
}
export default DebugPanel;
