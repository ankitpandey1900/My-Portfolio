'use client';

import * as React from 'react';
import { useProgress } from '@react-three/drei';
import { useStore } from '@/lib/store';

interface LoaderProps {
  children: React.ReactNode;
}

export function AssetLoaderManager({ children }: LoaderProps) {
  // Bind Drei useProgress hook metrics
  const { active, progress, loaded, total } = useProgress();

  const startLoading = useStore((state) => state.startLoading);
  const updateProgress = useStore((state) => state.updateProgress);
  const finishLoading = useStore((state) => state.finishLoading);

  React.useEffect(() => {
    if (active) {
      // Sync loader metrics to Zustand sub-store
      startLoading(total);
      updateProgress(loaded, progress);
    } else {
      finishLoading();
    }
  }, [active, progress, loaded, total, startLoading, updateProgress, finishLoading]);

  // Use Suspense to wrap async asset loading components (GLTF/models, textures, etc.)
  return <React.Suspense fallback={null}>{children}</React.Suspense>;
}
export default AssetLoaderManager;
