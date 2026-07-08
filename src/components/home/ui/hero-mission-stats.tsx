'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import type { HeroStat, HomePlanetPhase } from '../home-planet-types';

interface HeroMissionStatsProps {
  phase: HomePlanetPhase;
  stats: HeroStat[];
}

const TECH_ICONS = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'Three.js',
  'PostgreSQL', 'Tailwind', 'Git', 'Docker', 'Prisma',
  'Zustand', 'Framer Motion',
];

/**
 * Section 3: THE TELEMETRY
 * Stats dashboard with spacecraft data-readout aesthetic.
 */
export function HeroMissionStats({ phase, stats }: HeroMissionStatsProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-16 py-24 snap-start"
    >
      {/* Section label */}
      <motion.p
        className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500/50 mb-16 self-start max-w-5xl mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        ▸ Sector 03 — Mission Telemetry
      </motion.p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto mb-20">
        {stats.slice(0, 3).map((stat, index) => (
          <motion.div
            key={stat.label}
            className="relative group"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              delay: 0.2 + index * 0.15,
              duration: 0.9,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            {/* Glow border on hover */}
            <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 md:p-8 overflow-hidden">
              {/* Power-on flicker overlay */}
              <motion.div
                className="absolute inset-0 bg-amber-500/5"
                initial={{ opacity: 1 }}
                animate={isInView ? { opacity: [1, 0, 0.3, 0, 0.1, 0] } : {}}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
              />

              {/* Scanline */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.005)_3px,rgba(255,255,255,0.005)_6px)] pointer-events-none" />

              <div className="relative z-10">
                {/* Index */}
                <span className="text-[10px] font-mono text-white/15 uppercase tracking-wider block mb-4">
                  TLM-0{index + 1}
                </span>

                {/* Value */}
                <span className="block text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-2">
                  {stat.value}
                </span>

                {/* Label */}
                <span className="block text-sm font-semibold uppercase tracking-[0.15em] text-amber-400/60 mb-3">
                  {stat.label}
                </span>

                {/* Description */}
                {stat.description && (
                  <span className="block text-xs text-zinc-500 leading-relaxed">
                    {stat.description}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech ticker */}
      <motion.div
        className="w-full max-w-5xl mx-auto overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/15 mb-4">
          Core systems online
        </p>
        <div className="flex flex-wrap gap-3">
          {TECH_ICONS.map((tech, i) => (
            <motion.span
              key={tech}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-white/[0.02] border border-white/[0.04] rounded"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 + i * 0.05, duration: 0.5 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Decorative horizontal rule */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: 1.2, duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
      />
    </section>
  );
}
