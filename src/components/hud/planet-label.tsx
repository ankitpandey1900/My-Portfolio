'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { PlanetRegistry } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-registry';
import { useInteractionStore } from '@/components/canvas/scene-manager/scenes/solar-system/interaction/interaction-state';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { fadeUp, fadeUpTransition } from '@/lib/motion';

export function PlanetLabel() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const hoveredId = useInteractionStore((s) => s.hoveredPlanetId);
  const selectedId = useInteractionStore((s) => s.selectedPlanetId);
  const navState = useNavigationStore((s) => s.state);
  const currentPlanetId = useNavigationStore((s) => s.currentPlanetId);

  const isHeroVisible = heroPhase !== 'dismissed' && heroPhase !== 'idle';
  const focusedId =
    navState === 'focused' && currentPlanetId ? currentPlanetId : hoveredId ?? selectedId;
  const planet = focusedId ? PlanetRegistry.get(focusedId) : null;
  const isFocused = navState === 'focused' && currentPlanetId === planet?.id;
  const accent = planet?.colorPalette[0] ?? '#d8a24a';

  return (
    <AnimatePresence mode="wait">
      {!isHeroVisible && planet ? (
        <motion.div
          key={planet.id}
          className="planet-label"
          role="status"
          aria-live="polite"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={fadeUpTransition(0)}
        >
          <div
            className="planet-label__card"
            style={{ '--planet-accent': accent } as React.CSSProperties}
          >
            <span className="planet-label__eyebrow type-label">
              {isFocused ? 'In orbit' : 'Destination'}
            </span>
            <span className="planet-label__name type-display">{planet.displayName}</span>
            <span className="planet-label__desc type-body">{planet.description}</span>

            {isFocused ? (
              <button
                type="button"
                className="planet-label__enter"
                onClick={() => NavigationController.enterPlanetSection(planet.id)}
              >
                Enter sector
              </button>
            ) : (
              <span className="planet-label__hint type-label">
                Click to fly · Drag to orbit · Double-click or Enter to open
              </span>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
