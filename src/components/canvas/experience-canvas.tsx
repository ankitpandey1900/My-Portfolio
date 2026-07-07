'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useAdaptiveQuality } from '@/hooks/use-adaptive-quality';
import { useRenderLifecycle } from '@/hooks/use-render-lifecycle';
import { useRenderMonitor } from '@/hooks/use-render-monitor';
import { useResizeHandler } from '@/hooks/use-resize-handler';
import { CameraController } from './camera/camera-controller';
import { CameraManager } from './camera/camera-manager';
import { EffectsPipeline } from './effects/effects-pipeline';
import { SpaceEnvironment } from './environment/space-environment';
import { LightingRig } from './lights/lighting-rig';
import { AssetLoaderManager } from './loaders/asset-loader-manager';
import { CanvasProvider } from './providers/canvas-provider';
import { SceneManagerCore } from './scene-manager/scene-manager-core';

/**
 * Dynamically import the debug panel so that Leva (a devDependency)
 * is excluded from production bundles entirely.
 */
const DebugPanel = dynamic(() => import('./debug/debug-panel').then((mod) => mod.DebugPanel), {
  ssr: false,
});

/**
 * RenderPipeline runs inside the R3F Canvas context.
 * Hooks here have access to useFrame and useThree.
 */
function RenderPipeline() {
  useRenderMonitor();
  useAdaptiveQuality();
  return null;
}

/**
 * ExperienceCanvas is the single integration point between the Next.js page
 * and the entire 3D rendering engine. It composes every canvas subsystem
 * into a unified component tree.
 *
 * DOM-level hooks (visibility, resize) run in the outer component.
 * R3F-level hooks (FPS monitoring, adaptive quality) run inside the Canvas.
 */
export function ExperienceCanvas() {
  // DOM-level lifecycle hooks (run outside Canvas)
  useRenderLifecycle();
  useResizeHandler();

  return (
    <CanvasProvider>
      <AssetLoaderManager>
        <SpaceEnvironment />
        <LightingRig />
        <CameraController />
        <CameraManager />
        <SceneManagerCore />
        <EffectsPipeline />
        <RenderPipeline />
        <DebugPanel />
      </AssetLoaderManager>
    </CanvasProvider>
  );
}
export default ExperienceCanvas;
