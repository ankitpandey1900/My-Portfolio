'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PLANET_DEFINITIONS } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-definitions';
import { useInteractionStore } from '@/components/canvas/scene-manager/scenes/solar-system/interaction/interaction-state';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';
import { fadeUp, fadeUpTransition, scaleIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

const CATALOG = [...PLANET_DEFINITIONS]
  .filter((entry) => entry.status === 'active')
  .sort((a, b) => a.order - b.order);

export function PlanetCatalog() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const travelState = useCameraTravelStore((s) => s.state);
  const hoveredId = useInteractionStore((s) => s.hoveredPlanetId);
  const selectedId = useInteractionStore((s) => s.selectedPlanetId);
  const [expanded, setExpanded] = React.useState(true);

  const inSystem = heroPhase === 'dismissed';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';

  React.useEffect(() => {
    if (!inSystem || travelling || inSection) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a')) {
        return;
      }

      if (event.key === '0') {
        NavigationController.viewSystemOverview();
        return;
      }

      const index = Number.parseInt(event.key, 10);
      if (index >= 1 && index <= CATALOG.length) {
        const planet = CATALOG[index - 1];
        if (planet) NavigationController.selectPlanet(planet.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inSystem, travelling, inSection]);

  if (!inSystem || inSection) return null;

  const handleSelect = (planetId: string) => {
    NavigationController.selectPlanet(planetId);
  };

  return (
    <motion.section
      className={cn('planet-catalog', expanded && 'planet-catalog--expanded', travelling && 'planet-catalog--busy')}
      aria-label="Solar system destinations"
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={fadeUpTransition(0.2)}
    >
      <button
        type="button"
        className="planet-catalog__toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className="planet-catalog__toggle-label">Solar system</span>
        <motion.span
          className="planet-catalog__toggle-icon"
          aria-hidden
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.35 }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            className="planet-catalog__body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <button
              type="button"
              className="planet-catalog__overview"
              onClick={() => NavigationController.viewSystemOverview()}
              disabled={travelling}
            >
              <span className="planet-catalog__index">00</span>
              <span className="planet-catalog__meta">
                <span className="planet-catalog__name">System overview</span>
                <span className="planet-catalog__desc">Zoom out and explore all orbits · press 0</span>
              </span>
            </button>

            <ul className="planet-catalog__list" role="list">
              {CATALOG.map((planet, index) => {
                const isActive = hoveredId === planet.id || selectedId === planet.id;
                const moonLabel =
                  planet.moons.length > 0
                    ? `${planet.moons.length} moon${planet.moons.length > 1 ? 's' : ''}`
                    : null;

                return (
                  <motion.li
                    key={planet.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={fadeUpTransition(0.04 * index)}
                  >
                    <button
                      type="button"
                      className={cn('planet-catalog__item', isActive && 'planet-catalog__item--active')}
                      onClick={() => handleSelect(planet.id)}
                      disabled={travelling}
                    >
                      <span className="planet-catalog__index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="planet-catalog__meta">
                        <span className="planet-catalog__name">
                          {planet.displayName}
                          {planet.ring.hasRing ? (
                            <span className="planet-catalog__badge" aria-hidden>
                              ring
                            </span>
                          ) : null}
                          <span className="planet-catalog__arrow" aria-hidden>
                            ↗
                          </span>
                        </span>
                        <span className="planet-catalog__desc">
                          {planet.description}
                          {moonLabel ? ` · ${moonLabel}` : ''}
                        </span>
                      </span>
                      <span className="planet-catalog__keyhint" aria-hidden>
                        {index + 1}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}

