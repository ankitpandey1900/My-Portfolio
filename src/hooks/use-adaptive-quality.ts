'use client';

import * as React from 'react';
import { sceneEventEmitter } from '@/components/canvas/scene-manager/events/scene-event-emitter';
import { useStore, type QualityTier } from '@/lib/store';

/** Quality tier degradation order. */
const QUALITY_TIERS: QualityTier[] = ['ultra', 'high', 'medium', 'low'];

/**
 * Maps quality tiers to renderer settings.
 * These are applied to the Zustand store when the tier changes.
 */
const TIER_CONFIGS: Record<
  QualityTier,
  { dpr: number; postProcessing: boolean; starDensity: number }
> = {
  ultra: { dpr: 2, postProcessing: true, starDensity: 10000 },
  high: { dpr: 2, postProcessing: true, starDensity: 8000 },
  medium: { dpr: 1.5, postProcessing: false, starDensity: 5000 },
  low: { dpr: 1, postProcessing: false, starDensity: 3000 },
};

/**
 * Subscribes to performance events from useRenderMonitor and automatically
 * adjusts the quality tier to maintain smooth frame rates.
 *
 * On `performance:degraded`: steps down one tier (high → medium → low).
 * On `performance:recovered`: steps up one tier after a cooldown period.
 */
export function useAdaptiveQuality() {
  const setQualityTier = useStore((state) => state.setQualityTier);
  const setPostProcessing = useStore((state) => state.setPostProcessing);
  const setEnvironment = useStore((state) => state.setEnvironment);

  const currentTierIndex = React.useRef(1); // Start at 'high' (index 1)
  const recoveryTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const applyTier = (tierIndex: number) => {
      const tier = QUALITY_TIERS[tierIndex];
      if (!tier) return;

      const config = TIER_CONFIGS[tier];
      setQualityTier(tier);
      setPostProcessing(config.postProcessing);
      setEnvironment(0.1, config.starDensity, 0.5);
    };

    const handleDegraded = () => {
      // Step down one tier
      const nextIndex = Math.min(currentTierIndex.current + 1, QUALITY_TIERS.length - 1);
      if (nextIndex !== currentTierIndex.current) {
        currentTierIndex.current = nextIndex;
        applyTier(nextIndex);
      }
    };

    const handleRecovered = () => {
      // Wait 10 seconds before stepping up to avoid oscillation
      if (recoveryTimeout.current) clearTimeout(recoveryTimeout.current);
      recoveryTimeout.current = setTimeout(() => {
        const nextIndex = Math.max(currentTierIndex.current - 1, 0);
        if (nextIndex !== currentTierIndex.current) {
          currentTierIndex.current = nextIndex;
          applyTier(nextIndex);
        }
        recoveryTimeout.current = null;
      }, 10_000);
    };

    const unsubDegraded = sceneEventEmitter.on('performance:degraded', handleDegraded);
    const unsubRecovered = sceneEventEmitter.on('performance:recovered', handleRecovered);

    return () => {
      unsubDegraded();
      unsubRecovered();
      if (recoveryTimeout.current) clearTimeout(recoveryTimeout.current);
    };
  }, [setQualityTier, setPostProcessing, setEnvironment]);
}
export default useAdaptiveQuality;
