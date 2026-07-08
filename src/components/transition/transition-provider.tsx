'use client';

import * as React from 'react';
import { TransitionManager } from './transition-manager';

interface TransitionProviderProps {
  children: React.ReactNode;
}

/**
 * TransitionProvider
 * Mounts the headless manager into the application tree.
 */
export function TransitionProvider({ children }: TransitionProviderProps) {
  return (
    <>
      <TransitionManager />
      {children}
    </>
  );
}
