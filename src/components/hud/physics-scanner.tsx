'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Gauge, Orbit, Scale } from 'lucide-react';
import { useInteractionStore } from '../canvas/scene-manager/scenes/solar-system/interaction/interaction-state';
import { PlanetRegistry } from '../canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { useHomePlanetStore } from '../home/home-planet-state';

export function PhysicsScanner() {
  const hoveredPlanetId = useInteractionStore((state) => state.hoveredPlanetId);
  const selectedPlanetId = useInteractionStore((state) => state.selectedPlanetId);
  const phase = useHomePlanetStore((state) => state.phase);

  const activePlanetId = hoveredPlanetId || selectedPlanetId;
  const planet = activePlanetId ? PlanetRegistry.get(activePlanetId) : null;
  const inSystem = phase === 'dismissed';

  if (!inSystem) return null;

  return (
    <AnimatePresence>
      {planet && planet.physics && (
        <motion.div
          key="physics-scanner"
          className="fixed bottom-6 right-4 md:right-8 z-40 pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col w-[260px] relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />

            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <div className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                Telemetry
              </div>
            </div>

            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1 relative z-10">
              {planet.displayName}
            </h3>
            <div className="text-xs text-white/40 uppercase tracking-widest mb-4 relative z-10">
              {planet.physics.type}
            </div>

            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/50">
                  <Gauge size={14} />
                  <span className="text-[11px] uppercase tracking-wider">Velocity</span>
                </div>
                <div className="text-sm font-mono text-white/90">{planet.physics.velocity}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/50">
                  <Orbit size={14} />
                  <span className="text-[11px] uppercase tracking-wider">Rotation</span>
                </div>
                <div className="text-sm font-mono text-white/90">{planet.physics.rotation}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/50">
                  <Compass size={14} />
                  <span className="text-[11px] uppercase tracking-wider">Axial Tilt</span>
                </div>
                <div className="text-sm font-mono text-white/90">{planet.physics.tilt}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/50">
                  <Scale size={14} />
                  <span className="text-[11px] uppercase tracking-wider">Gravity</span>
                </div>
                <div className="text-sm font-mono text-white/90">{planet.physics.gravity}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhysicsScanner;
