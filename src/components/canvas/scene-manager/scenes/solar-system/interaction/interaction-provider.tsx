'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useDebugHudEnabled } from '@/lib/debug-hud';

const InteractionDebug = dynamic(
  () => import('./debug/interaction-debug').then((mod) => mod.InteractionDebug),
  { ssr: false }
);

interface InteractionProviderProps {
  children: React.ReactNode;
}

export function InteractionProvider({ children }: InteractionProviderProps) {
  const debugHud = useDebugHudEnabled();

  return (
    <group name="interaction-provider">
      {debugHud ? <InteractionDebug /> : null}
      {children}
    </group>
  );
}
