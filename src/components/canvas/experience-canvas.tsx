'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useAdaptiveQuality } from '@/hooks/use-adaptive-quality';
import { useRenderLifecycle } from '@/hooks/use-render-lifecycle';
import { useRenderMonitor } from '@/hooks/use-render-monitor';
import { useResizeHandler } from '@/hooks/use-resize-handler';
import { useDebugHudEnabled } from '@/lib/debug-hud';
import { CameraManager } from './camera/camera-manager';
import { CameraOrbitControls } from './camera/camera-orbit-controls';
import { CameraKeyboardControls } from './camera/camera-keyboard-controls';
import { CameraFovController } from './camera/camera-fov-controller';
import { CameraTravelProvider } from './camera/travel/camera-travel-provider';
import { EffectsPipeline } from './effects/effects-pipeline';
import { SpaceEnvironment } from './environment/space-environment';
import { LightingRig } from './lights/lighting-rig';
import { AssetLoaderManager } from './loaders/asset-loader-manager';
import { CanvasProvider } from './providers/canvas-provider';
import { SceneManagerCore } from './scene-manager/scene-manager-core';
import { Minimap } from '@/components/hud/minimap';

const DebugPanel = dynamic(() => import('./debug/debug-panel').then((mod) => mod.DebugPanel), {
  ssr: false,
});

function RenderPipeline() {
  useRenderMonitor();
  useAdaptiveQuality();
  return null;
}

export function ExperienceCanvas() {
  useRenderLifecycle();
  useResizeHandler();
  const debugHud = useDebugHudEnabled();

  return (
    <CanvasProvider>
      <AssetLoaderManager>
        <SpaceEnvironment />
        <LightingRig />
        <CameraTravelProvider>
          <CameraManager />
          <CameraOrbitControls />
          <CameraKeyboardControls />
          <CameraFovController />
          <SceneManagerCore />
        </CameraTravelProvider>
        <EffectsPipeline />
        <RenderPipeline />

        {debugHud ? <DebugPanel /> : null}
      </AssetLoaderManager>
    </CanvasProvider>
  );
}
export default ExperienceCanvas;

