'use client';

import * as React from 'react';
import { SceneWrapper } from './scene-wrapper';

export function PlanetScene() {
  return (
    <SceneWrapper name="PLANET">
      {/* 3D Planet close orbital coordinates and surface mesh placeholder */}
      <group name="planet-surface-group-placeholder" />
    </SceneWrapper>
  );
}
export default PlanetScene;
