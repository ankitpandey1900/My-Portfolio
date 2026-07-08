'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { HeroFactSnippet, HomePlanetPhase } from '../home-planet-types';
import { fadeUpTransition, slideBlur } from '@/lib/motion';

interface HeroFactCardProps {
  phase: HomePlanetPhase;
  snippet: HeroFactSnippet;
}

function isVisible(phase: HomePlanetPhase): boolean {
  return phase === 'reveal' || phase === 'ready' || phase === 'dismissed';
}

export function HeroFactCard({ phase, snippet }: HeroFactCardProps) {
  return (
    <AnimatePresence>
      {isVisible(phase) ? (
        <motion.aside
          className="hero-fact-card"
          aria-label="Space fact"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={slideBlur}
          transition={fadeUpTransition(0.88)}
        >
          <span className="hero-fact-card__title">{snippet.title}</span>
          <p className="hero-fact-card__body">{snippet.body}</p>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
