'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { HOME_PLANET_CONFIG } from '../home-planet-config';

const FEATURED_PROJECT = {
  name: 'AllTracker',
  tagline: 'A full-stack production tracking system built for real workflows.',
  stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
  status: 'LIVE',
};

export function HeroCoordinates() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-16 py-24"
    >
      {/* Faint orbit lines behind the card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="w-[600px] h-[600px] rounded-full border border-white/[0.03]" />
        <div className="absolute w-[450px] h-[450px] rounded-full border border-white/[0.04]" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/[0.05]" />
      </div>

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Section label */}
        <motion.p
          className="text-[11px] font-mono uppercase tracking-[0.25em] text-amber-500/60 mb-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          ▸ Sector 04 — Featured Coordinates
        </motion.p>

        {/* Card */}
        <div className="relative group">
          {/* Glow border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-8 md:p-12 overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.008)_2px,rgba(255,255,255,0.008)_4px)] pointer-events-none" />

            <div className="relative z-10">
              {/* Status badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-green-400/80">
                  {FEATURED_PROJECT.status}
                </span>
              </div>

              {/* Project name */}
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
                {FEATURED_PROJECT.name}
              </h3>

              {/* Description */}
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-lg mb-8">
                {FEATURED_PROJECT.tagline}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {FEATURED_PROJECT.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-300/70 bg-amber-500/[0.06] border border-amber-500/10 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative corner glyphs */}
            <div className="absolute top-4 right-4 text-white/[0.06] font-mono text-[10px]" aria-hidden>
              ┐
            </div>
            <div className="absolute bottom-4 left-4 text-white/[0.06] font-mono text-[10px]" aria-hidden>
              └
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

