'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import type { HeroIdentity, HeroMission, HomePlanetPhase } from '../home-planet-types';

interface HeroContentProps {
  identity: HeroIdentity;
  mission: HeroMission;
  phase: HomePlanetPhase;
}

/**
 * Section 1: THE VOID — Name emerges from darkness
 * Section 2: THE SIGNAL — Identity & mission broadcast
 */
export function HeroContent({ identity, mission, phase }: HeroContentProps) {
  const sectionTwoRef = React.useRef<HTMLDivElement>(null);
  const isSection2InView = useInView(sectionTwoRef, { once: true, amount: 0.5 });

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: THE VOID
          Pure darkness → name emerges letter by letter
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 snap-start">
        {/* Eyebrow */}
        <motion.p
          className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-500/40 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 2 }}
        >
          {mission.eyebrow}
        </motion.p>

        {/* Name — massive, cinematic */}
        <motion.h1
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-extrabold text-white tracking-tighter leading-[0.85] text-center select-none"
          initial={{ opacity: 0, y: 30, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.04em' }}
          transition={{ delay: 1.2, duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {mission.codename}
        </motion.h1>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-12 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1.5 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/20">
            Scroll to explore
          </span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: THE SIGNAL
          Identity & mission data — broadcast transmission aesthetic
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={sectionTwoRef}
        className="relative min-h-screen flex items-center justify-center px-6 md:px-16 snap-start"
      >
        <div className="w-full max-w-3xl">
          {/* Section label */}
          <motion.p
            className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500/50 mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={isSection2InView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            ▸ Sector 02 — Signal Received
          </motion.p>

          {/* Title */}
          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            {identity.title}
          </motion.h2>

          {/* Tagline — with terminal aesthetic */}
          <motion.blockquote
            className="relative text-xl md:text-2xl text-zinc-300 leading-relaxed mb-8 pl-6 border-l-2 border-amber-500/30"
            initial={{ opacity: 0, y: 16 }}
            animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="text-amber-400/50 font-mono text-sm mr-2">&gt;</span>
            {identity.tagline}
          </motion.blockquote>

          {/* Bio */}
          <motion.p
            className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 1, ease: [0.19, 1, 0.22, 1] }}
          >
            {identity.bio}
          </motion.p>

          {/* Availability beacon */}
          {identity.availability.visible && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={isSection2InView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
              </span>
              <span className="text-sm font-medium text-zinc-400">
                {identity.currentFocus}
              </span>
            </motion.div>
          )}
        </div>

        {/* Decorative scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/10 to-transparent"
          style={{ top: '30%' }}
          initial={{ scaleX: 0 }}
          animate={isSection2InView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        />
      </section>
    </>
  );
}

