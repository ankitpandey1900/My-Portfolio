'use client';

import * as React from 'react';
import { InteractionManager } from '../canvas/scene-manager/scenes/solar-system/interaction/interaction-manager';
import { NavigationManager } from './navigation-manager';

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * NavigationProvider
 * Bootstraps the central Navigation Manager orchestrator into the React tree.
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  return (
    <>
      <NavigationManager />
      <InteractionManager />
      {children}
    </>
  );
}

