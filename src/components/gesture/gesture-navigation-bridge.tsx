'use client';

import * as React from 'react';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { GestureEvents } from './gesture-events';

/**
 * Maps recognized gestures to navigation actions.
 */
export function GestureNavigationBridge() {
  React.useEffect(() => {
    const handleReturn = () => {
      const navState = useNavigationStore.getState().state;
      if (navState === 'viewingSection' || navState === 'focused') {
        NavigationController.goHome();
      }
    };

    const unsubDown = GestureEvents.on('SwipeDown', handleReturn);
    const unsubRight = GestureEvents.on('SwipeRight', handleReturn);

    return () => {
      unsubDown();
      unsubRight();
    };
  }, []);

  return null;
}

