'use client';

import * as React from 'react';
import { GestureDebug } from '@/components/gesture/debug/gesture-debug';
import { LandingDebug } from '@/components/landing/debug/landing-debug';
import { NavigationDebug } from '@/components/navigation/debug/navigation-debug';
import { SectionLoaderDebug } from '@/components/section-loader/debug/section-loader-debug';
import { TransitionDebug } from '@/components/transition/debug/transition-debug';
import { useDebugHudEnabled } from '@/lib/debug-hud';

/** Dev diagnostics — hidden unless ?debug=1 or NEXT_PUBLIC_DEBUG_HUD=true */
export function DebugHudLayer() {
  const enabled = useDebugHudEnabled();

  if (!enabled) return null;

  return (
    <>
      <NavigationDebug />
      <LandingDebug />
      <SectionLoaderDebug />
      <TransitionDebug />
      <GestureDebug />
    </>
  );
}
