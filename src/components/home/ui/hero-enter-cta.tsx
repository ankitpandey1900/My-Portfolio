'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { HomePlanetController } from '../home-planet-controller';
import type { HeroCTA, HomePlanetPhase } from '../home-planet-types';

interface HeroEnterCtaProps {
  phase: HomePlanetPhase;
  primary: HeroCTA;
  secondary: HeroCTA;
}

/**
 * Section 5: THE LAUNCH
 * Dramatic CTA with pulsing amber glow and warp-speed transition.
 */
export function HeroEnterCta({ phase: _phase, primary, secondary }: HeroEnterCtaProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isLaunching, setIsLaunching] = React.useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    // Let the warp animation play for 1.2s, then trigger the actual journey
    setTimeout(() => {
      HomePlanetController.beginJourney();
    }, 1200);
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 snap-start overflow-hidden"
    >
      {/* Central amber glow — builds with scroll */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: isInView ? 0.6 : 0 }}
        aria-hidden
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.06] blur-[80px]" />
      </div>

      {/* Warp speed overlay — triggers on launch */}
      {isLaunching && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Radial star streaks */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,rgba(255,255,255,0.03)_30%,transparent_31%,transparent_40%,rgba(255,255,255,0.02)_40%,transparent_41%,transparent_55%,rgba(216,162,74,0.04)_55%,transparent_56%)] animate-[warp_1s_ease-in_forwards]" />
          {/* White flash at the end */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.8, 0] }}
            transition={{ duration: 1.2, times: [0, 0.7, 0.85, 1] }}
          />
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Section label */}
        <motion.p
          className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500/50 mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          ▸ Sector 05 — Launch Sequence
        </motion.p>

        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          Ready to explore?
        </motion.h2>

        <motion.p
          className="text-base text-zinc-500 mb-12 max-w-sm"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Enter the interactive solar system to navigate projects, skills, and more.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Primary: Launch */}
          <button
            type="button"
            onClick={handleLaunch}
            disabled={isLaunching}
            className="group relative px-10 py-4 rounded-full text-sm font-bold uppercase tracking-[0.15em] text-black bg-amber-400 hover:bg-amber-300 transition-all duration-300 shadow-[0_0_30px_rgba(216,162,74,0.3)] hover:shadow-[0_0_50px_rgba(216,162,74,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-[pulse-ring_2s_ease-out_infinite] pointer-events-none" />
            <span className="relative z-10">
              {isLaunching ? 'Initiating...' : primary.label}
            </span>
          </button>

          {/* Secondary: Resume */}
          <a
            href={secondary.href}
            className="px-8 py-3.5 rounded-full text-sm font-medium tracking-wider text-zinc-400 border border-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-300"
            target={secondary.external ? '_blank' : undefined}
            rel={secondary.external ? 'noreferrer' : undefined}
          >
            {secondary.label}
          </a>
        </motion.div>
      </div>

      {/* Bottom signature */}
      <motion.p
        className="absolute bottom-8 text-[10px] font-mono text-white/10 tracking-wider"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 1 }}
      >
        ANKIT PANDEY · SOLAR PORTFOLIO · 2026
      </motion.p>
    </section>
  );
}

