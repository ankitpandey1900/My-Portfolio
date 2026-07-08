// ─────────────────────────────────────────────────────────────────────────────
// Sequence Registry
// Contains the hardcoded sequence definitions and their step choreographies.
// ─────────────────────────────────────────────────────────────────────────────
import { EnvironmentController } from '../canvas/environment/environment-controller';
import { NebulaController } from '../canvas/environment/nebula';
import { ParticleController } from '../canvas/environment/particles';
import { StarfieldController } from '../canvas/environment/starfield/starfield-controller';
import { useStore } from '@/lib/store';
import { animateValue } from './sequence-utils';
import type { SequenceDefinition, SequenceId } from './sequence-types';

export const SEQUENCE_REGISTRY: Record<SequenceId, SequenceDefinition> = {
  IntroSequence: {
    id: 'IntroSequence',
    interruptible: true,
    steps: [
      {
        type: 'emitEvent',
        eventName: 'VisitorArrives',
      },
      // 1. Scene Initialized - Wait for resources
      {
        type: 'delay',
        durationMs: 500,
        id: 'WaitSceneInit',
      },
      // 2. Environment ready, Nebula fades in
      {
        type: 'parallel',
        id: 'EnvironmentFadeIn',
        actions: [
          {
            type: 'call',
            fn: async ({ signal }) => {
              NebulaController.updateConfig({ opacity: 0.02 });
              StarfieldController.setOpacity(0.08);
              await animateValue(
                0.02,
                0.35,
                2800,
                (opacity) => NebulaController.updateConfig({ opacity }),
                signal
              );
            },
          },
          {
            type: 'delay',
            durationMs: 2000,
          },
        ],
      },
      // 3. Starfield & Particles activate
      {
        type: 'parallel',
        id: 'ActivateStarsAndParticles',
        actions: [
          {
            type: 'call',
            fn: async ({ signal }) => {
              StarfieldController.setPreset('deep-space');
              ParticleController.setPreset('SpaceDust');
              await animateValue(
                0.08,
                0.38,
                1800,
                (opacity) => StarfieldController.setOpacity(opacity),
                signal
              );
            },
          },
          {
            type: 'delay',
            durationMs: 1000,
          },
        ],
      },
      // 4. Sun intensity increases & Camera approaches
      {
        type: 'parallel',
        id: 'SunAndCamera',
        actions: [
          {
            type: 'call',
            fn: async ({ signal }) => {
              useStore.getState().setCameraPreset('galaxy');
              await animateValue(
                1,
                1.12,
                3500,
                (exposure) => EnvironmentController.updateConfig({ post: { exposure } }),
                signal
              );
            },
          },
          {
            type: 'delay',
            durationMs: 3000,
          },
        ],
      },
      // 5. UI sequence (Logo, Name, Title, Tagline, CTA)
      {
        type: 'sequential',
        id: 'UIReveal',
        actions: [
          {
            type: 'emitEvent',
            eventName: 'ShowLogo',
          },
          { type: 'delay', durationMs: 500 },
          {
            type: 'emitEvent',
            eventName: 'ShowName',
          },
          { type: 'delay', durationMs: 500 },
          {
            type: 'emitEvent',
            eventName: 'ShowTitle',
          },
          { type: 'delay', durationMs: 500 },
          {
            type: 'emitEvent',
            eventName: 'ShowTagline',
          },
          { type: 'delay', durationMs: 1000 },
          {
            type: 'emitEvent',
            eventName: 'ShowCTA',
          },
        ],
      },
      // 6. Camera reveals solar system and enters Idle
      {
        type: 'call',
        id: 'RevealSolarSystem',
        fn: ({ signal: _signal }) => {
          useStore.getState().setCameraPreset('galaxy');
          EnvironmentController.setPreset('nebula-glow');
        },
      },
      {
        type: 'delay',
        durationMs: 1000,
      },
    ],
  },

  // Stubs for future sequences
  HomeReveal: { id: 'HomeReveal', steps: [] },
  PlanetTravel: { id: 'PlanetTravel', steps: [] },
  PlanetLanding: { id: 'PlanetLanding', steps: [] },
  SectionReveal: { id: 'SectionReveal', steps: [] },
  SectionExit: { id: 'SectionExit', steps: [] },
  ReturnHome: { id: 'ReturnHome', steps: [] },
  FutureDemoMode: { id: 'FutureDemoMode', steps: [] },
  FutureIdleSequence: { id: 'FutureIdleSequence', steps: [] },
};
