'use client';

import { EnvironmentController } from '@/components/canvas/environment/environment-controller';
import type { EnvironmentPresetId } from '@/components/canvas/environment/environment-types';
import { NebulaController } from '@/components/canvas/environment/nebula/nebula-controller';
import type { NebulaPresetId } from '@/components/canvas/environment/nebula/nebula-types';
import { StarfieldController } from '@/components/canvas/environment/starfield/starfield-controller';
import type { StarfieldPresetId } from '@/components/canvas/environment/starfield/starfield-types';
import { useStore } from '@/lib/store';
import { useSceneLifecycle } from '../../lifecycle/use-scene-lifecycle';
import { GALAXY_SCENE_CONFIG } from './galaxy-scene-config';

/**
 * useGalaxySceneLifecycle binds the custom useSceneLifecycle callbacks
 * for the GALAXY view, configuring starlight density, exposure levels,
 * and setting up initial camera preset focal points.
 */
export function useGalaxySceneLifecycle() {
  const setCameraPreset = useStore((state) => state.setCameraPreset);
  const setCameraMode = useStore((state) => state.setCameraMode);

  useSceneLifecycle({
    name: 'GALAXY',
    onInitialize: () => {
      // Configure environmental scales matching Galaxy configurations
      const config = GALAXY_SCENE_CONFIG;
      StarfieldController.setPreset(config.starfieldPreset as StarfieldPresetId);
      EnvironmentController.setPreset(config.envPreset as EnvironmentPresetId);
      NebulaController.setPreset(config.nebulaPreset as NebulaPresetId);
    },
    onMount: () => {
      // Focus camera on galaxy overview preset on mount
      setCameraPreset(GALAXY_SCENE_CONFIG.cameraPreset);
      setCameraMode('cinematic');
    },
    onSuspend: () => {
      // Suspended when navigating to other scenes (e.g. planet detail zoom)
      // Pauses local animations or dials down dynamic settings here if needed
    },
    onResume: () => {
      // Re-apply preset values when returning to focus
      setCameraPreset(GALAXY_SCENE_CONFIG.cameraPreset);
      setCameraMode('cinematic');
    },
    onDestroy: () => {
      // Local resources cleanups handled automatically by SceneWrapper recursive disposal
    },
  });
}
export default useGalaxySceneLifecycle;
