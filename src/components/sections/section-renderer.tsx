'use client';

import * as React from 'react';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useSectionLoaderStore } from '@/components/section-loader/section-loader-state';
import type { SectionId } from '@/components/section-loader/section-loader-types';
import { SectionShell } from './section-shell';
import { UnderConstruction } from './under-construction';

export function SectionRenderer() {
  const sectionId = useNavigationStore((s) => s.currentSectionId);
  const navState = useNavigationStore((s) => s.state);
  const loaderState = useSectionLoaderStore((s) => s.state);
  const LoadedView = useSectionLoaderStore((s) => s.loadedView);

  const isOpen =
    navState === 'viewingSection' &&
    loaderState === 'loaded' &&
    sectionId !== null &&
    LoadedView !== null;

  const handleClose = React.useCallback(() => {
    NavigationController.goHome();
  }, []);

  if (!sectionId || !LoadedView) return null;

  return (
    <SectionShell sectionId={sectionId as SectionId} isOpen={isOpen} onClose={handleClose}>
      <UnderConstruction />
    </SectionShell>
  );
}
