'use client';

import * as React from 'react';
import { SceneWrapper } from './scene-wrapper';

export function LoadingScene() {
  return (
    <SceneWrapper name="LOADING">
      {/* 3D Preloader placeholder elements (particle circles, orbital loaders) */}
      <group name="loading-loader-placeholder" />
    </SceneWrapper>
  );
}
export default LoadingScene;
