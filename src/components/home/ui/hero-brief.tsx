'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { HomePlanetPhase } from '../home-planet-types';
import { HOME_PLANET_CONFIG } from '../home-planet-config';
import { fadeUp, fadeUpTransition, scaleIn } from '@/lib/motion';

interface HeroBriefProps {
  phase: HomePlanetPhase;
}

function isVisible(phase: HomePlanetPhase): boolean {
  return phase === 'reveal' || phase === 'ready' || phase === 'dismissed';
}

export function HeroBrief({ phase }: HeroBriefProps) {
  const visible = isVisible(phase);
  const { stats } = HOME_PLANET_CONFIG;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          className="hero-brief"
          aria-label="Portfolio highlights"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={fadeUpTransition(0.52)}
        >
          <div className="hero-brief__grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="hero-brief__cell"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={fadeUpTransition(0.58 + index * 0.06)}
              >
                <span className="hero-brief__label">{stat.label}</span>
                <span className="hero-brief__value">{stat.value}</span>
                <span className="hero-brief__desc">{stat.description}</span>
              </motion.div>
            ))}
          </div>
          <div className="hero-brief__footer">
            <span className="hero-brief__cta-label">Launch sequence</span>
            <span className="hero-brief__cta-hint">Enter the solar system to explore each planet</span>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
