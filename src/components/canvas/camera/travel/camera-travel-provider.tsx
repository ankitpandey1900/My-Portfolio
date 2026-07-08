'use client';

import * as React from 'react';
import { CameraTransition } from './camera-transition';
import { CameraTravelController } from './camera-travel-controller';
import { CameraTravelManager } from './camera-travel-manager';

interface CameraTravelProviderProps {
  children: React.ReactNode;
}

/**
 * CameraTravelProvider
 * Encapsulates the entire travel engine and visual transitions.
 */
export function CameraTravelProvider({ children }: CameraTravelProviderProps) {
  return (
    <group name="camera-travel-provider">
      <CameraTravelManager />
      <CameraTravelController />
      <CameraTransition />
      {children}
    </group>
  );
}
