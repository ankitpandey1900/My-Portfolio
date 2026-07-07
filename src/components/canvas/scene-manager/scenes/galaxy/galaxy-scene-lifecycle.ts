'use client';

import { useStore } from '@/lib/store';
import { useSceneLifecycle } from '../../lifecycle/use-scene-lifecycle';
import { GALAXY_SCENE_CONFIG } from './galaxy-scene-config';

/**
 * useGalaxySceneLifecycle binds the custom useSceneLifecycle callbacks
 * for the GALAXY view, configuring starlight density, exposure levels,
 * and setting up initial camera preset focal points.
 */
export function useGalaxySceneLifecycle() {
  const setEnvironment = useStore((state) => state.setEnvironment);
  const setExposure = useStore((state) => state.setExposure);
  const setEnvironmentIntensity = useStore((state) => state.setEnvironmentIntensity);
  const setEnvPreset = useStore((state) => state.setEnvPreset);
  const setToneMapping = useStore((state) => state.setToneMapping);
  const setCameraPreset = useStore((state) => state.setCameraPreset);
  const setCameraMode = useStore((state) => state.setCameraMode);

  useSceneLifecycle({
    name: 'GALAXY',
    onInitialize: () => {
      // Configure environmental scales matching Galaxy configurations
      const config = GALAXY_SCENE_CONFIG;
      setEnvironment(config.ambientIntensity, config.starDensity, config.nebulaIntensity);
      setExposure(config.exposure);
      setEnvironmentIntensity(config.environmentIntensity);
      setEnvPreset(config.envPreset);
      setToneMapping(config.toneMapping);
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
