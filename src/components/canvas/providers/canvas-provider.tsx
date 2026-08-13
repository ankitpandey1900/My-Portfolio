'use client';

import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/lib/store';
import { WebGLErrorBoundary } from './webgl-error-boundary';

interface CanvasProviderProps {
  children: React.ReactNode;
}

export function CanvasProvider({ children }: CanvasProviderProps) {
  const dpr = useStore((state) => state.dpr);
  const isRenderActive = useStore((state) => state.isRenderActive);
  const setRenderActive = useStore((state) => state.setRenderActive);
  const [canvasKey, setCanvasKey] = React.useState(0);

  const handleContextLost = React.useCallback(
    (event: Event) => {
      event.preventDefault();
      setRenderActive(false);
      console.warn('[WebGL] Context lost — remounting canvas on restore.');
    },
    [setRenderActive]
  );

  const handleContextRestored = React.useCallback(() => {
    setCanvasKey((key) => key + 1);
    setRenderActive(true);
  }, [setRenderActive]);

  return (
    <WebGLErrorBoundary>
      <div
        className="relative w-full h-full min-h-screen select-none outline-none"
        tabIndex={-1}
        onPointerDown={(event) => {
          if (event.currentTarget === event.target || event.target instanceof HTMLCanvasElement) {
            event.currentTarget.focus({ preventScroll: true });
          }
        }}
      >
        <Canvas
          key={canvasKey}
          dpr={dpr}
          frameloop={isRenderActive ? 'always' : 'never'}
          camera={{
            fov: 34,
            near: 0.1,
            far: 1000,
            position: [0, 15, 30],
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;

            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', handleContextLost);
            canvas.addEventListener('webglcontextrestored', handleContextRestored);
          }}
          className="absolute inset-0 z-0 bg-space-black"
        >
          {children}
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
export default CanvasProvider;

