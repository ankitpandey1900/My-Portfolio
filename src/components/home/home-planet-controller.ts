// ─────────────────────────────────────────────────────────────────────────────
// Home Planet Controller
// Pure logic layer for phase transitions and user actions.
// No React. No rendering. Called by HomePlanetManager and UI components.
// ─────────────────────────────────────────────────────────────────────────────
import { useStore } from '@/lib/store';
import { HOME_PLANET_CONFIG } from './home-planet-config';
import { HomePlanetEvents } from './home-planet-events';
import { useHomePlanetStore } from './home-planet-state';

export const HomePlanetController = {
  /**
   * Starts the cinematic reveal sequence from idle.
   * Advances through: idle → initializing → intro → reveal → ready
   */
  startSequence: () => {
    const { setPhase, setVisible } = useHomePlanetStore.getState();
    const { phaseDurations } = HOME_PLANET_CONFIG;

    setVisible(true);
    setPhase('initializing');
    HomePlanetEvents.emit('home:phaseChanged', { phase: 'initializing' });

    const t1 = setTimeout(() => {
      setPhase('intro');
      HomePlanetEvents.emit('home:phaseChanged', { phase: 'intro' });
    }, phaseDurations.initializing);

    const t2 = setTimeout(() => {
      setPhase('reveal');
      HomePlanetEvents.emit('home:phaseChanged', { phase: 'reveal' });
    }, phaseDurations.initializing + phaseDurations.intro);

    const t3 = setTimeout(
      () => {
        setPhase('ready');
        HomePlanetEvents.emit('home:phaseChanged', { phase: 'ready' });
      },
      phaseDurations.initializing + phaseDurations.intro + phaseDurations.reveal
    );

    // Return cleanup function for useEffect
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  },

  /**
   * Called when the user clicks "Begin Journey".
   * Dismisses hero and transitions the scene to SYSTEM.
   */
  beginJourney: () => {
    const { setPhase, setInteracted } = useHomePlanetStore.getState();
    const { setCurrentScene } = useStore.getState();

    setInteracted();
    setPhase('dismissed');
    HomePlanetEvents.emit('home:journeyStarted');

    // Give CSS dismiss animation time before unmounting / switching scene
    setTimeout(() => {
      setCurrentScene('SYSTEM');
      useStore.getState().setCameraPreset('system');
      useStore.getState().setCameraMode('orbit');
    }, 600);
  },

  /**
   * Called when user clicks "Download Resume".
   * Emits telemetry event only — does not alter state.
   */
  downloadResume: () => {
    HomePlanetEvents.emit('home:resumeDownloaded');
  },

  /** Hard reset back to idle (used on unmount / error recovery). */
  reset: () => {
    useHomePlanetStore.getState().reset();
  },
};
