import * as React from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { InteractionEvents } from './interaction-events';
import { useInteractionStore } from './interaction-state';

const CLICK_DELAY_MS = 240;

/**
 * useInteractionController
 * Logic for orchestrating inputs (mouse, touch) into explicit semantic events.
 */
export function useInteractionController(planetId: string) {
  const clickTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const handlePointerOver = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      InteractionEvents.emit('PlanetHover', { planetId, timestamp: Date.now() });
    },
    [planetId]
  );

  const handlePointerOut = React.useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      InteractionEvents.emit('PlanetLeave', { planetId, timestamp: Date.now() });
    },
    [planetId]
  );

  const handlePointerDown = React.useCallback((e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
  }, []);

  const handleClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (e.button !== 0) return;

      const disabled = useInteractionStore.getState().disabledPlanets.includes(planetId);
      const navState = useNavigationStore.getState().state;
      if (disabled || navState === 'returning') return;

      e.stopPropagation();

      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
      }

      clickTimerRef.current = window.setTimeout(() => {
        InteractionEvents.emit('PlanetClick', { planetId, timestamp: Date.now() });
        clickTimerRef.current = null;
      }, CLICK_DELAY_MS);
    },
    [planetId]
  );

  const handleDoubleClick = React.useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      const disabled = useInteractionStore.getState().disabledPlanets.includes(planetId);
      const navState = useNavigationStore.getState().state;
      if (disabled || navState === 'returning') return;

      e.stopPropagation();

      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }

      InteractionEvents.emit('PlanetDoubleClick', { planetId, timestamp: Date.now() });
    },
    [planetId]
  );

  return {
    handlePointerOver,
    handlePointerOut,
    handlePointerDown,
    handleClick,
    handleDoubleClick,
  };
}
