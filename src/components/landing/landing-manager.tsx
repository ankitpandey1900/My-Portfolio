'use client';

import * as React from 'react';
import { NavigationEvents } from '../navigation/navigation-events';
import { LandingController } from './landing-controller';

/**
 * LandingManager
 * Headless orchestrator intercepting camera travel completions to start landing sequences.
 */
export function LandingManager() {
  React.useEffect(() => {
    // When camera travel completes, initiate landing phase
    const unsubTravel = NavigationEvents.on('TravelCompleted', (payload) => {
      if (payload.planetId && payload.openSection) {
        LandingController.startLanding(payload.planetId);
      }
    });

    const unsubReturn = NavigationEvents.on('ReturnHome', () => {
      LandingController.cancelLanding();
      LandingController.returnToOrbit();
    });

    return () => {
      unsubTravel();
      unsubReturn();
    };
  }, []);

  return null;
}

