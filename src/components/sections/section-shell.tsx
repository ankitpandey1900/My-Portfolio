'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { PlanetRegistry } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { cn } from '@/lib/utils';
import { fadeUpTransition, scaleIn } from '@/lib/motion';
import type { SectionId } from '@/components/section-loader/section-loader-types';
import { SECTION_META } from './content/portfolio-content';

interface SectionShellProps {
  sectionId: SectionId;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SectionShell({ sectionId, isOpen, onClose, children }: SectionShellProps) {
  const meta = SECTION_META[sectionId];
  const planetId = useNavigationStore((s) => s.currentPlanetId);
  const planet = planetId ? PlanetRegistry.get(planetId) : null;

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const sectorCode = planet?.displayName?.toUpperCase() ?? sectionId.toUpperCase();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={cn('sector-overlay', 'sector-overlay--open')}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`section-title-${sectionId}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeUpTransition(0)}
        >
          <motion.div
            className="sector-viewport"
            data-sector={sectionId}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={fadeUpTransition(0.05)}
          >
            <div className="sector-viewport__scan" aria-hidden="true" />
            <div className="sector-viewport__glow" aria-hidden="true" />

            <header className="sector-header">
              <div className="sector-header__meta">
                <p className="sector-header__telemetry">
                  <span className="sector-header__pulse" aria-hidden="true" />
                  SECTOR // {sectorCode} · DEPLOY ACTIVE
                </p>
                <h2 id={`section-title-${sectionId}`} className="sector-header__title">
                  {meta.title}
                </h2>
                <p className="sector-header__subtitle">{meta.subtitle}</p>
                {planet?.description ? (
                  <p className="sector-header__desc">{planet.description}</p>
                ) : null}
              </div>
              <button type="button" className="sector-exit" onClick={onClose} aria-label="Exit sector">
                Exit sector
              </button>
            </header>

            <div className="sector-body">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

