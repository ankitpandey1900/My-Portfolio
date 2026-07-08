'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { HomePlanetPhase } from '../home-planet-types';

interface HeroScrollRailProps {
  phase: HomePlanetPhase;
}

/**
 * Minimal scroll progress indicator — a thin vertical line on the right edge.
 */
export function HeroScrollRail({ phase }: HeroScrollRailProps) {
  const isVisible = phase === 'reveal' || phase === 'ready';
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!isVisible) return null;

  return (
    <aside
      className="fixed right-3 top-1/2 -translate-y-1/2 z-30 h-24 w-px"
      aria-hidden
    >
      {/* Track */}
      <div className="absolute inset-0 bg-white/[0.06] rounded-full" />
      {/* Fill */}
      <motion.div
        className="absolute inset-0 bg-amber-500/40 rounded-full origin-top"
        style={{ scaleY }}
      />
    </aside>
  );
}
