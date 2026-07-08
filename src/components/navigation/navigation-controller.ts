import { useCameraTravelStore } from '../canvas/camera/travel/camera-travel-state';
import { CAMERA_PRESETS } from '../canvas/camera/camera-presets';
import { useInteractionStore } from '../canvas/scene-manager/scenes/solar-system/interaction/interaction-state';
import { PlanetRegistry } from '../canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { useStore } from '@/lib/store';
import { SectionLoaderController } from '../section-loader/section-loader-controller';
import { useSectionLoaderStore } from '../section-loader/section-loader-state';
import { NavigationEvents } from './navigation-events';
import { useNavigationStore } from './navigation-store';
import { resolveSectionFromPlanet } from './planet-section-resolver';

export interface SelectPlanetOptions {
  durationMs?: number;
  cameraDistanceScale?: number;
  openSection?: boolean;
}

const SYSTEM_OVERVIEW = {
  targetPosition: CAMERA_PRESETS.system.position,
  targetLookAt: CAMERA_PRESETS.system.lookAt,
} as const;

export const NavigationController = {
  selectPlanet: (planetId: string, options: SelectPlanetOptions = {}) => {
    const navStore = useNavigationStore.getState();
    const cameraStore = useCameraTravelStore.getState();
    const { durationMs = 2200, cameraDistanceScale = 1, openSection = false } = options;

    if (
      navStore.currentPlanetId === planetId &&
      navStore.state === 'viewingSection'
    ) {
      return;
    }

    if (
      navStore.currentPlanetId === planetId &&
      navStore.state === 'focused' &&
      !openSection
    ) {
      return;
    }

    navStore.setPlanet(planetId);
    navStore.setState('planetSelected');
    NavigationEvents.emit('PlanetSelected', { planetId, timestamp: Date.now() });

    navStore.setState('travelling');
    NavigationEvents.emit('TravelStarted', { planetId, timestamp: Date.now() });
    useStore.getState().setCameraMode('transitioning');

    cameraStore.queueTravel({
      targetId: planetId,
      durationMs,
      easing: 'ease-in-out',
      cameraDistanceScale,
      onComplete: () => {
        useNavigationStore.getState().setState('focused');
        useStore.getState().setCameraMode('orbit');
        useCameraTravelStore.getState().setState('idle');
        NavigationEvents.emit('TravelCompleted', {
          planetId,
          openSection,
          timestamp: Date.now(),
        });
      },
    });
  },

  /** Fly close to a planet and orbit freely — does not open the portfolio section. */
  explorePlanet: (planetId: string) => {
    NavigationController.selectPlanet(planetId, {
      durationMs: 1800,
      cameraDistanceScale: 0.58,
      openSection: false,
    });
  },

  /** Travel and auto-open the portfolio section after landing. */
  visitPlanet: (planetId: string) => {
    NavigationController.selectPlanet(planetId, {
      durationMs: 2200,
      cameraDistanceScale: 1,
      openSection: true,
    });
  },

  /** @deprecated Use explorePlanet */
  zoomToPlanet: (planetId: string) => {
    NavigationController.explorePlanet(planetId);
  },

  enterPlanetSection: (planetId?: string) => {
    const navStore = useNavigationStore.getState();
    const targetId = planetId ?? navStore.currentPlanetId;
    if (!targetId) return;

    const sectionId = resolveSectionFromPlanet(targetId);
    if (!sectionId) return;

    if (
      navStore.currentPlanetId === targetId &&
      (navStore.state === 'focused' || navStore.state === 'viewingSection')
    ) {
      NavigationController.navigateToSection(sectionId);
      return;
    }

    NavigationController.selectPlanet(targetId, {
      durationMs: 1800,
      cameraDistanceScale: 0.58,
      openSection: true,
    });
  },

  viewSystemOverview: () => {
    const navStore = useNavigationStore.getState();
    const cameraStore = useCameraTravelStore.getState();

    SectionLoaderController.cancelLoading();
    useSectionLoaderStore.getState().reset();
    useInteractionStore.getState().setSelected(null);
    useInteractionStore.getState().setHovered(null);

    navStore.setState('idle');
    navStore.setSection(null);
    useStore.getState().setCameraMode('transitioning');

    cameraStore.queueTravel({
      targetId: null,
      ...SYSTEM_OVERVIEW,
      durationMs: 1800,
      easing: 'ease-in-out',
      onComplete: () => {
        useNavigationStore.getState().resetNavigation();
        useStore.getState().setCameraMode('orbit');
        useStore.getState().setCameraPreset('system');
        useCameraTravelStore.getState().setState('idle');
        NavigationEvents.emit('NavigationReset', { timestamp: Date.now() });
      },
    });
  },

  deselectPlanet: () => {
    NavigationController.viewSystemOverview();
  },

  navigateToSection: (sectionId: string) => {
    const store = useNavigationStore.getState();
    store.setSection(sectionId);
    store.setState('viewingSection');
    useStore.getState().setCameraMode('focus');
    NavigationEvents.emit('SectionOpened', { sectionId, timestamp: Date.now() });
  },

  navigateToSectionFromUI: (sectionId: string) => {
    const planet = PlanetRegistry.getBySection(sectionId);
    if (planet) {
      NavigationController.visitPlanet(planet.id);
      return;
    }
    NavigationController.navigateToSection(sectionId);
  },

  goHome: () => {
    NavigationController.viewSystemOverview();
  },
};
