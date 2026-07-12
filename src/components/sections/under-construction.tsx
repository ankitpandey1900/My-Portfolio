'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useNavigationStore } from '@/components/navigation/navigation-store';

export function UnderConstruction() {
  const sectionId = useNavigationStore((s) => s.currentSectionId);
  const planetName = sectionId ? sectionId.charAt(0).toUpperCase() + sectionId.slice(1) : 'Sector';

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-8 p-6 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-[0_0_40px_rgba(255,255,255,0.05)]"
      >
        <Rocket className="w-12 h-12 text-white/50" />
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
        {planetName} Under Construction
      </h2>

      <p className="text-white/40 max-w-sm mx-auto leading-relaxed text-sm">
        We&apos;re currently building out this sector of the universe. Check back later for new data
        transmissions and interactive content.
      </p>

      <div className="mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" />
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-500/80">
          Work in Progress
        </span>
      </div>
    </div>
  );
}
