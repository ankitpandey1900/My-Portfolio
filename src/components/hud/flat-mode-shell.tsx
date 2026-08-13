'use client';

import { NavigationProvider } from '@/components/navigation/navigation-provider';
import { SectionLoaderProvider } from '@/components/section-loader/section-loader-provider';
import { SectionRenderer } from '@/components/sections/section-renderer';
import { FlatPortfolioFallback } from './flat-portfolio-fallback';

interface FlatModeShellProps {
  reason: 'webgl_unsupported' | 'render_crash';
}

export function FlatModeShell({ reason }: FlatModeShellProps) {
  return (
    <NavigationProvider>
      <SectionLoaderProvider>
        <FlatPortfolioFallback reason={reason} />
        <SectionRenderer />
      </SectionLoaderProvider>
    </NavigationProvider>
  );
}

