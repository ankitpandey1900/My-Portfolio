'use client';

import * as React from 'react';
import { SectionLoaderManager } from './section-loader-manager';

interface SectionLoaderProviderProps {
  children: React.ReactNode;
}

/**
 * SectionLoaderProvider
 * Bootstraps the Section Loader Manager into the React tree.
 */
export function SectionLoaderProvider({ children }: SectionLoaderProviderProps) {
  return (
    <>
      <SectionLoaderManager />
      {children}
    </>
  );
}

