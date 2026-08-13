'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSolarSystem } from '@/components/canvas/scene-manager/scenes/solar-system/solar-system-provider';

export function Minimap() {
  const { camera } = useThree();
  const playerDotRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // In a real implementation, we would map the actual solar system bounds to the minimap size
  const mapScale = 0.5; // Scale factor from 3D world to Minimap pixels

  useFrame(() => {
    if (!playerDotRef.current) return;
    
    // GTA-style: Map tracks the player, but here we'll do a simple radar 
    // where the center is the sun (0,0) and the dot is the camera.
    const x = camera.position.x * mapScale;
    const z = camera.position.z * mapScale; // using Z as the 2D Y axis

    // Clamp to map bounds (assuming 150px map)
    const clampedX = Math.max(-65, Math.min(65, x));
    const clampedZ = Math.max(-65, Math.min(65, z));

    playerDotRef.current.style.transform = `translate(${clampedX}px, ${clampedZ}px)`;
    
    // Rotate the player dot to match camera Y rotation
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const angle = -euler.y * (180 / Math.PI);
    playerDotRef.current.style.rotate = `${angle}deg`;
  });

  return (
    <Html
      fullscreen
      style={{
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div 
        className="hidden sm:block absolute bottom-6 left-6 w-40 h-40 rounded-full border border-white/10 bg-black/50 backdrop-blur-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        style={{ pointerEvents: 'auto' }}
        ref={mapRef}
      >
        {/* Radar Rings & Crosshairs */}
        <div className="absolute inset-0 border border-white/5 rounded-full m-8" />
        <div className="absolute inset-0 border border-white/5 rounded-full m-4" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/[0.03] -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.03] -translate-x-1/2" />
        
        {/* Radar Sweep Animation */}
        <div className="absolute inset-0 rounded-full mix-blend-screen opacity-30 animate-[spin_4s_linear_infinite]" 
             style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.1) 90%, rgba(255,255,255,0.5) 100%)' }} />

        {/* Sun Center */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />

        {/* Player Indicator */}
        <div 
          ref={playerDotRef}
          className="absolute top-1/2 left-1/2 w-0 h-0"
        >
          {/* Sleek SVG Chevron pointing in camera direction */}
          <svg className="absolute -top-3 -left-2 w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L22 20L12 17L2 20L12 2Z" />
          </svg>
        </div>
        
        {/* Map Label (Top Pill) */}
        <div className="absolute top-3 w-full flex justify-center">
          <div className="bg-white/10 border border-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[8px] font-mono tracking-[0.2em] text-white/80 uppercase shadow-xl">
            Sector Nav
          </div>
        </div>
      </div>
    </Html>
  );
}

