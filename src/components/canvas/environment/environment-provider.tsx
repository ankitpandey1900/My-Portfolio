'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Environment Provider
// Context wrapper and composition root for the Environment Engine.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { EnvironmentManager } from './environment-manager';
import { EnvironmentScene } from './environment-scene';

interface EnvironmentProviderProps {
  children?: React.ReactNode;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  return (
    <>
      <EnvironmentManager />
      <EnvironmentScene />
      {children}
    </>
  );
}

