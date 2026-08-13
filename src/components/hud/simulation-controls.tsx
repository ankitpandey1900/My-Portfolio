'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSolarSystemSimulation } from '../canvas/scene-manager/scenes/solar-system/solar-system-store';
import { useHomePlanetStore } from '../home/home-planet-state';
import { useNavigationStore } from '../navigation/navigation-store';

export function SimulationControls() {
  const isPaused = useSolarSystemSimulation((s) => s.isPaused);
  const timeScale = useSolarSystemSimulation((s) => s.timeScale);
  const setPaused = useSolarSystemSimulation((s) => s.setPaused);
  const setTimeScale = useSolarSystemSimulation((s) => s.setTimeScale);

  const heroPhase = useHomePlanetStore((s) => s.phase);
  const inSystem = heroPhase === 'dismissed';

  const navState = useNavigationStore((s) => s.state);
  const isViewingSection = navState === 'viewingSection';

  // Only show when in system and not currently reading a section
  if (!inSystem || isViewingSection) return null;

  return (
    <motion.div
      className="fixed top-6 right-4 md:right-8 z-50 flex flex-col gap-2 pointer-events-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl flex flex-col items-center">
        <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1 mt-1 px-3">
          Time Control
        </div>

        <div className="flex gap-1 p-1">
          <button
            type="button"
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              isPaused
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
            )}
            onClick={() => setPaused(!isPaused)}
            title={isPaused ? 'Resume Time' : 'Pause Time'}
          >
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </button>

          <div className="w-[1px] bg-white/10 mx-1 my-2" />

          {[0.5, 1, 3, 5].map((speed) => {
            const isActive = timeScale === speed && !isPaused;
            return (
              <button
                key={speed}
                type="button"
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all',
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-transparent'
                )}
                onClick={() => {
                  setTimeScale(speed);
                  setPaused(false);
                }}
              >
                {speed}x
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default SimulationControls;

