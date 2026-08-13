'use client';

import * as React from 'react';
import { EnvironmentProvider } from './environment-provider';
import { NebulaProvider } from './nebula';
import { ParticleProvider } from './particles';
import { StarfieldProvider } from './starfield';

/**
 * SpaceEnvironment composes all deep-space environmental elements.
 *
 * Currently contains:
 * - Starfield: Multi-layered infinite star backdrop (Task 2.2)
 * - NebulaSystem: Layered 3D Simplex procedural nebula clouds (Task 2.3)
 * - EnvironmentManager: Dynamic HDRI, exposure, and tone mapping coordinator (Task 2.4)
 *
 * Future additions:
 * - Cosmic dust particles
 * - Galaxy arm structures
 */
export function SpaceEnvironment() {
  return (
    <group name="space-environment">
      <StarfieldProvider />
      <ParticleProvider />
      <NebulaProvider />
      <EnvironmentProvider />
    </group>
  );
}
export default SpaceEnvironment;

