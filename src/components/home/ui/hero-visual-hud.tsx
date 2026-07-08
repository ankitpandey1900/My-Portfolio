'use client';

import { motion } from 'framer-motion';
import type { HomePlanetPhase } from '../home-planet-types';
import { fadeUp, fadeUpTransition, staggerContainer } from '@/lib/motion';

interface HeroVisualHudProps {
  phase: HomePlanetPhase;
}

function isVisible(phase: HomePlanetPhase): boolean {
  return phase === 'reveal' || phase === 'ready' || phase === 'dismissed';
}

export function HeroVisualHud({ phase }: HeroVisualHudProps) {
  if (!isVisible(phase)) return null;

  return (
    <motion.aside
      className="hero-visual-hud"
      aria-label="Orbital telemetry"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="hero-visual-hud__panel" variants={fadeUp} transition={fadeUpTransition(0.2)}>
        <span className="hero-visual-hud__eyebrow">Telemetry</span>
        <dl className="hero-visual-hud__grid">
          <div>
            <dt>Orbit</dt>
            <dd>LEO · 408 km</dd>
          </div>
          <div>
            <dt>Velocity</dt>
            <dd>7.66 km/s</dd>
          </div>
          <div>
            <dt>Systems</dt>
            <dd>9 planets online</dd>
          </div>
          <div>
            <dt>Mode</dt>
            <dd>Cinematic nav</dd>
          </div>
        </dl>
      </motion.div>

      <motion.div className="hero-visual-hud__ring" variants={fadeUp} transition={fadeUpTransition(0.34)} aria-hidden>
        <span className="hero-visual-hud__ring-core" />
        <span className="hero-visual-hud__ring-orbit hero-visual-hud__ring-orbit--one" />
        <span className="hero-visual-hud__ring-orbit hero-visual-hud__ring-orbit--two" />
      </motion.div>
    </motion.aside>
  );
}
