'use client';

import * as React from 'react';
import { SceneWrapper } from './scene-wrapper';

export function ErrorScene() {
  return (
    <SceneWrapper name="ERROR">
      {/* 3D Static glitch effect elements when graphics systems fail */}
      <group name="error-glitch-placeholder" />
    </SceneWrapper>
  );
}
export default ErrorScene;
