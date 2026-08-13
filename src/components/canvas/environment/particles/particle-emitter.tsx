// ─────────────────────────────────────────────────────────────────────────────
// Particle Emitter
// React component that pipes particles into the pool.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import type { ParticlePool } from './particle-pool';
import type { ParticleEmitterConfig } from './particle-types';

interface ParticleEmitterProps {
  config: ParticleEmitterConfig;
  pool: ParticlePool;
}

/** Utility for random numbers */
const randRange = (min: number, max: number) => min + Math.random() * (max - min);

export function ParticleEmitter({ config, pool }: ParticleEmitterProps) {
  const spawnAccumulator = React.useRef(0);

  useFrame((state, delta) => {
    // Calculate how many particles to spawn this frame
    const rate = config.spawnRate * (1.0 + (Math.random() * 2 - 1) * config.spawnJitter);
    spawnAccumulator.current += rate * delta;

    const spawnCount = Math.floor(spawnAccumulator.current);
    if (spawnCount > 0) {
      spawnAccumulator.current -= spawnCount;

      const currentTime = state.clock.elapsedTime;

      for (let i = 0; i < spawnCount; i++) {
        // Generate start position based on shape
        let posX = 0,
          posY = 0,
          posZ = 0;
        const radius = randRange(config.emissionRadius[0], config.emissionRadius[1]);

        if (config.shape === 'Sphere') {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          posX = radius * Math.sin(phi) * Math.cos(theta);
          posY = radius * Math.sin(phi) * Math.sin(theta);
          posZ = radius * Math.cos(phi);
        } else if (config.shape === 'Ring') {
          const angle = Math.random() * Math.PI * 2;
          posX = radius * Math.cos(angle);
          posZ = radius * Math.sin(angle);
        } else if (config.shape === 'Point') {
          // Keep 0, 0, 0
        }

        // Generate velocity (outward from origin if Sphere/Ring)
        let velX = 0,
          velY = 0,
          velZ = 0;
        const speed = randRange(config.velocity[0], config.velocity[1]);

        if (config.shape === 'Sphere' || config.shape === 'Ring') {
          const len = Math.sqrt(posX * posX + posY * posY + posZ * posZ) || 1;
          velX = (posX / len) * speed;
          velY = (posY / len) * speed;
          velZ = (posZ / len) * speed;
        } else {
          velY = speed; // default upward
        }

        pool.spawn({
          position: [posX, posY, posZ],
          velocity: [velX, velY, velZ],
          acceleration: config.acceleration,
          colorStart: config.colorStart,
          colorEnd: config.colorEnd,
          size: randRange(config.size[0], config.size[1]),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: randRange(config.rotationSpeed[0], config.rotationSpeed[1]),
          startTime: currentTime,
          lifetime: randRange(config.lifetime[0], config.lifetime[1]),
          opacityStart: config.opacityStart,
          opacityEnd: config.opacityEnd,
        });
      }
    }
  });

  return null;
}

