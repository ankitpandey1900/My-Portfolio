// ─────────────────────────────────────────────────────────────────────────────
// Particle Manager
// Binds state config to the Renderer and Emitters.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useStore } from '@/lib/store';
import { ParticleEmitter } from './particle-emitter';
import { ParticlePool } from './particle-pool';
import { ParticleRenderer } from './particle-renderer';
import { useParticleStore } from './particle-state';

export function ParticleManager() {
  const qualityTier = useStore((state) => state.qualityTier);
  const activeConfig = useParticleStore((state) => state.activeConfig);

  const emitters = activeConfig.emitters[qualityTier];

  // Calculate max particles required across all active emitters
  const totalMaxParticles = React.useMemo(() => {
    return emitters?.reduce((sum, e) => sum + e.maxParticles, 0) || 0;
  }, [emitters]);

  // Initialize the shared pool
  const pool = React.useMemo(() => {
    if (totalMaxParticles > 0) {
      return new ParticlePool(totalMaxParticles);
    }
    return null;
  }, [totalMaxParticles]);

  if (!pool || !emitters || emitters.length === 0) return null;

  return (
    <group name={`particle-system-${activeConfig.id}`}>
      <ParticleRenderer pool={pool} />
      {emitters.map((emitterConfig) => (
        <ParticleEmitter key={emitterConfig.id} config={emitterConfig} pool={pool} />
      ))}
    </group>
  );
}

