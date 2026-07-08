'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Nebula Provider
// Context wrapper and composition root for the Nebula Engine.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { NebulaManager } from './nebula-manager';
import { NebulaRenderer } from './nebula-renderer';

interface NebulaProviderProps {
  children?: React.ReactNode;
}

export function NebulaProvider({ children }: NebulaProviderProps) {
  return (
    <>
      <NebulaManager />
      <NebulaRenderer />
      {children}
    </>
  );
}
