'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Environment Manager
// Headless lifecycle manager. Subscribes to global quality changes and
// syncs the environment config bounds accordingly.
// ─────────────────────────────────────────────────────────────────────────────
import * as React from 'react';
import { useStore } from '@/lib/store';
import { EnvironmentController } from './environment-controller';

export function EnvironmentManager() {
  const qualityTier = useStore((state) => state.qualityTier);

  // Sync environment features (like fog) when global quality changes
  React.useEffect(() => {
    EnvironmentController.syncQualityBounds();
  }, [qualityTier]);

  return null;
}

