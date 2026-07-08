'use client';

import * as React from 'react';
import { GestureManager } from './gesture-manager';
import { GestureNavigationBridge } from './gesture-navigation-bridge';

interface GestureProviderProps {
  children: React.ReactNode;
}

export function GestureProvider({ children }: GestureProviderProps) {
  return (
    <>
      <GestureManager />
      <GestureNavigationBridge />
      {children}
    </>
  );
}
