'use client';

import { EnvironmentController } from '@/components/canvas/environment/environment-controller';
import type { EnvironmentPresetId } from '@/components/canvas/environment/environment-types';
import { NebulaController } from '@/components/canvas/environment/nebula/nebula-controller';
import type { NebulaPresetId } from '@/components/canvas/environment/nebula/nebula-types';
import { ParticleController } from '@/components/canvas/environment/particles/particle-controller';
import type { ParticlePresetId } from '@/components/canvas/environment/particles/particle-types';
import { StarfieldController } from '@/components/canvas/environment/starfield/starfield-controller';
import type { StarfieldPresetId } from '@/components/canvas/environment/starfield/starfield-types';
import { useStore } from '@/lib/store';
import { useSceneLifecycle } from '../../lifecycle/use-scene-lifecycle';
import { SOLAR_SYSTEM_SCENE_CONFIG } from './solar-system-scene-config';
import { useSolarSystem } from './solar-system-provider';

/**
 * SolarSystemManager binds lifecycle callbacks for the SYSTEM scene.
 */
export function SolarSystemManager() {
  const setCameraPreset = useStore((state) => state.setCameraPreset);
  const setCameraMode = useStore((state) => state.setCameraMode);
  const { registry, setActiveTarget } = useSolarSystem();

  useSceneLifecycle({
    name: 'SYSTEM',
    onInitialize: () => {
      const config = SOLAR_SYSTEM_SCENE_CONFIG;
      StarfieldController.setPreset(config.starfieldPreset as StarfieldPresetId);
      EnvironmentController.setPreset(config.envPreset as EnvironmentPresetId);
      NebulaController.setPreset(config.nebulaPreset as NebulaPresetId);
      ParticleController.setPreset(config.particlePreset as ParticlePresetId);
    },
    onMount: () => {
      setCameraPreset(SOLAR_SYSTEM_SCENE_CONFIG.cameraPreset);
      setCameraMode('cinematic');
    },
    onSuspend: () => {
      setActiveTarget(null);
    },
    onResume: () => {
      setCameraPreset(SOLAR_SYSTEM_SCENE_CONFIG.cameraPreset);
      setCameraMode('cinematic');
    },
    onDestroy: () => {
      setActiveTarget(null);
      registry.clear();
    },
  });

  return null;
}
export default SolarSystemManager;

