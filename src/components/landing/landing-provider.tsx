'use client';

import * as React from 'react';
import { LandingManager } from './landing-manager';

interface LandingProviderProps {
  children: React.ReactNode;
}

/**
 * LandingProvider
 * Bootstraps the central Landing Experience orchestrator into the React tree.
 */
export function LandingProvider({ children }: LandingProviderProps) {
  return (
    <>
      <LandingManager />
      {children}
    </>
  );
}

