'use client';

import { motion } from 'framer-motion';
import type { HomePlanetPhase } from '../home-planet-types';
import { fadeUpTransition } from '@/lib/motion';

interface HeroSequenceProps {
  phase: HomePlanetPhase;
}

const PHASES: { id: HomePlanetPhase; label: string }[] = [
  { id: 'initializing', label: 'Boot' },
  { id: 'intro', label: 'Align' },
  { id: 'reveal', label: 'Reveal' },
  { id: 'ready', label: 'Ready' },
];

function phaseIndex(phase: HomePlanetPhase): number {
  if (phase === 'idle' || phase === 'dismissed') return -1;
  return PHASES.findIndex((entry) => entry.id === phase);
}

export function HeroSequence({ phase }: HeroSequenceProps) {
  const activeIndex = phaseIndex(phase);
  if (activeIndex < 0) return null;

  const progress = ((activeIndex + 1) / PHASES.length) * 100;

  return (
    <motion.div
      className="hero-sequence"
      aria-hidden
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={fadeUpTransition(0.12)}
    >
      <div className="hero-sequence__track">
        <motion.span
          className="hero-sequence__fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>
      <div className="hero-sequence__labels">
        {PHASES.map((entry, index) => (
          <span
            key={entry.id}
            className="hero-sequence__step"
            data-active={index <= activeIndex}
          >
            {entry.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
