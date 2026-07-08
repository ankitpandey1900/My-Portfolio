'use client';

import * as React from 'react';
import { Html } from '@react-three/drei';
import { useInteractionStore } from '../interaction-state';

/**
 * InteractionDebug
 * Development only panel showing real-time interaction states.
 */
export function InteractionDebug() {
  const hovered = useInteractionStore((state) => state.hoveredPlanetId);
  const selected = useInteractionStore((state) => state.selectedPlanetId);
  const disabled = useInteractionStore((state) => state.disabledPlanets);

  // Failsafe rendering block for production
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Html position={[-5, 5, 0]} center>
      <div className="bg-black/90 text-green-400 p-4 rounded-lg text-xs font-mono border border-green-500/50 pointer-events-none w-64 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
        <h3 className="font-bold border-b border-green-500/50 mb-2 pb-1 uppercase tracking-wider">
          Interaction Engine
        </h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <span className="text-gray-400">Hovered:</span>
          <span className="truncate">{hovered || 'none'}</span>

          <span className="text-gray-400">Selected:</span>
          <span className="truncate">{selected || 'none'}</span>

          <span className="text-gray-400">Disabled:</span>
          <span className="truncate">{disabled.length ? disabled.join(', ') : 'none'}</span>
        </div>
      </div>
    </Html>
  );
}
