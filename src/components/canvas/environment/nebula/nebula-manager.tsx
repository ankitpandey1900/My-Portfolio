'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Nebula Manager
// Headless lifecycle manager. Subscribes to global quality changes and
// syncs the nebula config bounds accordingly.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useStore } from '@/lib/store';
import { NebulaController } from './nebula-controller';

export function NebulaManager() {
  const qualityTier = useStore((state) => state.qualityTier);

  React.useEffect(() => {
    NebulaController.syncQualityBounds();
  }, [qualityTier]);

  return null;
}

