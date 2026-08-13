import { resolveSectionFromPlanet } from '../navigation/planet-section-resolver';
import { NavigationController } from '../navigation/navigation-controller';
import { LANDING_CONFIG } from './landing-config';
import { LandingEvents } from './landing-events';
import { useLandingStore } from './landing-state';

let landingTimeout: NodeJS.Timeout | null = null;

export const LandingController = {
  startLanding: (planetId: string) => {
    const store = useLandingStore.getState();
    // Prevent duplicate triggers
    if (store.state === 'preparing' || store.state === 'landing') {
      return;
    }

    if (landingTimeout) {
      clearTimeout(landingTimeout);
    }

    const sectionId = resolveSectionFromPlanet(planetId);

    store.setTargetData(planetId, sectionId);
    store.setState('preparing');

    LandingEvents.emit('LandingStarted', {
      planetId,
      sectionId: sectionId || undefined,
      timestamp: Date.now(),
    });

    // Transition to active landing
    store.setState('landing');

    // Simulate future landing animations (audio, particles)
    landingTimeout = setTimeout(() => {
      LandingController.completeLanding();
    }, LANDING_CONFIG.DEFAULT_LANDING_DURATION);
  },

  completeLanding: () => {
    const store = useLandingStore.getState();
    const { targetPlanetId, targetSectionId } = store;

    if (store.state !== 'landing') return;

    store.setState('arrived');

    if (targetSectionId) {
      store.setState('openingSection');
      LandingEvents.emit('ReadyForSection', {
        planetId: targetPlanetId || undefined,
        sectionId: targetSectionId,
        timestamp: Date.now(),
      });
      NavigationController.navigateToSection(targetSectionId);
    }

    store.setState('completed');
    LandingEvents.emit('LandingCompleted', {
      planetId: targetPlanetId || undefined,
      timestamp: Date.now(),
    });

    if (landingTimeout) clearTimeout(landingTimeout);
  },

  cancelLanding: () => {
    const store = useLandingStore.getState();
    if (store.state === 'idle' || store.state === 'cancelled') return;

    store.setState('cancelled');
    LandingEvents.emit('LandingCancelled', { timestamp: Date.now() });

    if (landingTimeout) clearTimeout(landingTimeout);
  },

  returnToOrbit: () => {
    const store = useLandingStore.getState();
    store.setState('idle');
    LandingEvents.emit('ReturnStarted', { timestamp: Date.now() });
    // NavigationController handles camera return
  },
};

