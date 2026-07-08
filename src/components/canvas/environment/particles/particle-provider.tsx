// ─────────────────────────────────────────────────────────────────────────────
// Particle Provider
// Top-level engine composition component.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { ParticleManager } from './particle-manager';

export function ParticleProvider() {
  return (
    <>
      <ParticleManager />
    </>
  );
}
