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
  // Bind dynamic DPR value to Zustand renderer settings
  const dpr = useStore((state) => state.dpr);

  return (
    <WebGLErrorBoundary>
      <div className="relative w-full h-full min-h-screen select-none outline-none">
        {/* Render R3F Canvas Layer (Stretches absolute on bottom z-0) */}
        <Canvas
          shadows
          dpr={dpr}
          camera={{
            fov: 45,
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
            // Assert shadows configuration details
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
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
