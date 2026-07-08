'use client';

import * as React from 'react';
import { LandingEvents } from '../landing/landing-events';
import { NavigationEvents } from '../navigation/navigation-events';
import { SectionLoaderEvents } from '../section-loader/section-loader-events';
import { TransitionController } from './transition-controller';

/**
 * TransitionManager wires macro transitions to navigation, landing, and section events.
 */
export function TransitionManager() {
  React.useEffect(() => {
    TransitionController.clearQueue();

    const completeCurrent = () => {
      const current = TransitionController.getCurrentTransition();
      if (current) {
        TransitionController.completeTransition(current.uid);
      }
    };

    const unsubTravelStart = NavigationEvents.on('TravelStarted', (payload) => {
      TransitionController.queueTransition('CameraTravel', payload.planetId);
    });

    const unsubTravelEnd = NavigationEvents.on('TravelCompleted', completeCurrent);

    const unsubLandingStart = LandingEvents.on('LandingStarted', (payload) => {
      TransitionController.queueTransition('PlanetLanding', payload.planetId);
    });

    const unsubLandingEnd = LandingEvents.on('LandingCompleted', completeCurrent);

    const unsubSectionOpen = NavigationEvents.on('SectionOpened', (payload) => {
      TransitionController.queueTransition('SectionOpening', payload.sectionId);
    });

    const unsubSectionLoad = SectionLoaderEvents.on('SectionLoading', (payload) => {
      TransitionController.queueTransition('SectionLoading', payload.sectionId);
    });

    const unsubSectionLoaded = SectionLoaderEvents.on('SectionLoaded', completeCurrent);

    const unsubReturn = NavigationEvents.on('ReturnHome', () => {
      TransitionController.queueTransition('ReturnHome');
    });

    const unsubReset = NavigationEvents.on('NavigationReset', completeCurrent);

    return () => {
      unsubTravelStart();
      unsubTravelEnd();
      unsubLandingStart();
      unsubLandingEnd();
      unsubSectionOpen();
      unsubSectionLoad();
      unsubSectionLoaded();
      unsubReturn();
      unsubReset();
      TransitionController.clearQueue();
      TransitionController.cancelTransition();
    };
  }, []);

  return null;
}
