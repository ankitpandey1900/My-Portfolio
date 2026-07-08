'use client';

import * as React from 'react';
import { useProgress } from '@react-three/drei';
import { useStore } from '@/lib/store';

interface LoaderProps {
  children: React.ReactNode;
}

function LoaderProgressSync() {
  const { active, progress, loaded, total } = useProgress();
  const startLoading = useStore((state) => state.startLoading);
  const updateProgress = useStore((state) => state.updateProgress);
  const finishLoading = useStore((state) => state.finishLoading);

  React.useEffect(() => {
    const sync = () => {
      if (active) {
        startLoading(total);
        updateProgress(loaded, progress);
      } else {
        finishLoading();
      }
    };

    queueMicrotask(sync);
  }, [active, progress, loaded, total, startLoading, updateProgress, finishLoading]);

  return null;
}

export function AssetLoaderManager({ children }: LoaderProps) {
  return (
    <>
      <LoaderProgressSync />
      <React.Suspense fallback={null}>{children}</React.Suspense>
    </>
  );
}
export default AssetLoaderManager;
