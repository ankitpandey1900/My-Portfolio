'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCameraTravelStore } from '@/components/canvas/camera/travel/camera-travel-state';
import { useInteractionStore } from '@/components/canvas/scene-manager/scenes/solar-system/interaction/interaction-state';
import { PLANET_DEFINITIONS } from '@/components/canvas/scene-manager/scenes/solar-system/planet/planet-definitions';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { useKeyboardKeys } from '@/hooks/use-keyboard-keys';
import { fadeUp, fadeUpTransition } from '@/lib/motion';
import { cn } from '@/lib/utils';

const CATALOG = [...PLANET_DEFINITIONS]
  .filter((entry) => entry.status === 'active')
  .sort((a, b) => a.order - b.order);

type DeckTab = 'fly' | 'destinations';

function KeyCap({
  label,
  active = false,
  size = 'md',
}: {
  label: string;
  active?: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <kbd className="command-deck__key" data-active={active} data-size={size}>
      {label}
    </kbd>
  );
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

export function SystemNavigation() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const currentSection = useNavigationStore((s) => s.currentSectionId);
  const currentPlanetId = useNavigationStore((s) => s.currentPlanetId);
  const travelState = useCameraTravelStore((s) => s.state);
  const hoveredId = useInteractionStore((s) => s.hoveredPlanetId);
  const selectedId = useInteractionStore((s) => s.selectedPlanetId);

  const [expanded, setExpanded] = React.useState(false);
  const [tab, setTab] = React.useState<DeckTab>('destinations');

  const inSystem = heroPhase === 'dismissed';
  const travelling = travelState === 'preparing' || travelState === 'travelling';
  const inSection = navState === 'viewingSection';
  const exploring = navState === 'focused' && Boolean(currentPlanetId);
  const controlsActive = inSystem && !travelling && !inSection;

  const { isPressed } = useKeyboardKeys(controlsActive);

  React.useEffect(() => {
    if (!controlsActive) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isFormField(event.target)) return;

      if (event.key === 'Escape') {
        if (inSection) NavigationController.goHome();
        else setExpanded(false);
        return;
      }

      if (event.key === 'Enter' && exploring && currentPlanetId) {
        event.preventDefault();
        NavigationController.enterPlanetSection(currentPlanetId);
        return;
      }

      if (event.key === '0') {
        event.preventDefault();
        NavigationController.viewSystemOverview();
        return;
      }

      if (event.key.toLowerCase() === 'b') {
        event.preventDefault();
        NavigationController.viewBlackHole();
        return;
      }

      const index = Number.parseInt(event.key, 10);
      if (index >= 1 && index <= CATALOG.length) {
        event.preventDefault();
        const planet = CATALOG[index - 1];
        if (planet) NavigationController.explorePlanet(planet.id);
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [controlsActive, inSection, exploring, currentPlanetId]);

  if (!inSystem) return null;

  const statusLabel = travelling
    ? 'In transit'
    : inSection
      ? 'Sector open'
      : exploring
        ? 'Exploring planet'
        : 'Orbit stable';

  return (
    <>
      {/* Top left redundant buttons removed for cleaner UI */}

      <motion.div
        className={cn(
          'fixed z-40 bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[800px] px-4',
          expanded ? 'bottom-6' : 'bottom-6',
          travelling && 'pointer-events-none opacity-50'
        )}
        role="region"
        aria-label="Mission control"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-2 pl-6">
            <button
              type="button"
              className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-1 text-left min-w-[120px]"
              aria-expanded={expanded}
              onClick={() => setExpanded((open) => !open)}
            >
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_10px_currentColor]',
                  !travelling && !inSection
                    ? 'bg-green-500 text-green-500 animate-pulse'
                    : 'bg-amber-500 text-amber-500'
                )}
                aria-hidden
              />
              <span className="flex flex-col truncate">
                <span className="text-white font-semibold tracking-tight text-sm truncate">
                  Mission Control
                </span>
                <span className="text-zinc-400 text-xs font-medium truncate">{statusLabel}</span>
              </span>
              <motion.span
                className="text-zinc-500 text-xs ml-2 shrink-0"
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                aria-hidden
              >
                ▼
              </motion.span>
            </button>

            {!expanded && !inSection ? (
              <div className="flex items-center gap-2 sm:gap-4 pr-2" aria-label="Quick actions">
                <button
                  type="button"
                  className="hidden sm:flex shrink-0 items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] transition-all border border-white/10 text-white/70 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap"
                  onClick={() => NavigationController.viewSystemOverview()}
                  disabled={travelling}
                >
                  <span>Overview</span>
                  <KeyCap label="0" size="sm" />
                </button>
                <div
                  className="hidden lg:flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]"
                  aria-hidden
                >
                  <KeyCap label="W" active={isPressed('w')} size="sm" />
                  <KeyCap label="A" active={isPressed('a')} size="sm" />
                  <KeyCap label="S" active={isPressed('s')} size="sm" />
                  <KeyCap label="D" active={isPressed('d')} size="sm" />
                </div>
                <button
                  type="button"
                  className="hidden sm:flex shrink-0 items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/[0.05] hover:bg-orange-500/[0.15] transition-all border border-orange-500/20 text-orange-400/90 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap"
                  onClick={() => NavigationController.viewBlackHole()}
                  disabled={travelling}
                >
                  <span>Black Hole</span>
                  <KeyCap label="B" size="sm" />
                </button>
                <button
                  type="button"
                  className="shrink-0 px-5 py-2 rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all text-[10px] font-sans font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.15)] ml-2 sm:ml-0 whitespace-nowrap"
                  onClick={() => {
                    setTab('destinations');
                    setExpanded(true);
                  }}
                >
                  Destinations
                </button>
              </div>
            ) : null}
          </div>

          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                className="command-deck__panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              >
                {!inSection ? (
                  <>
                    <div className="command-deck__tabs" role="tablist">
                      {(['fly', 'destinations'] as DeckTab[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          role="tab"
                          aria-selected={tab === item}
                          className="command-deck__tab"
                          data-active={tab === item}
                          onClick={() => setTab(item)}
                        >
                          {item === 'fly' ? 'Flight' : 'Destinations'}
                        </button>
                      ))}
                    </div>

                    {tab === 'fly' ? (
                      <div className="command-deck__fly">
                        <div className="command-deck__fly-visual">
                          <KeyCap label="W" active={isPressed('w') || isPressed('ArrowUp')} />
                          <div className="command-deck__fly-row">
                            <KeyCap label="A" active={isPressed('a') || isPressed('ArrowLeft')} />
                            <KeyCap label="S" active={isPressed('s') || isPressed('ArrowDown')} />
                            <KeyCap label="D" active={isPressed('d') || isPressed('ArrowRight')} />
                          </div>
                        </div>
                        <ul className="command-deck__fly-notes">
                          <li>
                            <span className="type-label">Pointer</span>
                            Drag to orbit · scroll to zoom · right-drag to pan
                          </li>
                          <li>
                            <span className="type-label">Keyboard</span>
                            WASD fly · Q/E rise & fall · +/- zoom · Shift boost
                          </li>
                          <li>
                            <span className="type-label">Travel</span>
                            Click to fly · drag to orbit 360° · Enter or double-click to open sector
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="command-deck__destinations">
                        <button
                          type="button"
                          className="command-deck__planet command-deck__planet--overview"
                          onClick={() => NavigationController.viewSystemOverview()}
                          disabled={travelling}
                        >
                          <span className="command-deck__planet-index">00</span>
                          <span className="command-deck__planet-copy">
                            <span className="command-deck__planet-name">System overview</span>
                            <span className="command-deck__planet-desc">
                              Pull back and explore every orbit
                            </span>
                          </span>
                          <KeyCap label="0" size="sm" />
                        </button>

                        <div className="command-deck__planet-grid">
                          {CATALOG.map((planet, index) => {
                            const isActive = hoveredId === planet.id || selectedId === planet.id;
                            const accent = planet.colorPalette[0] ?? '#d8a24a';

                            return (
                              <motion.button
                                key={planet.id}
                                type="button"
                                className={cn(
                                  'command-deck__planet',
                                  isActive && 'command-deck__planet--active'
                                )}
                                style={
                                  (isActive ? { borderLeftColor: accent } : {}) as Record<
                                    string,
                                    string
                                  >
                                }
                                onClick={() => NavigationController.explorePlanet(planet.id)}
                                disabled={travelling}
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                transition={fadeUpTransition(0.02 * index)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <span className="command-deck__planet-index">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="command-deck__planet-copy">
                                  <span className="command-deck__planet-name">
                                    {planet.displayName}
                                  </span>
                                  <span className="command-deck__planet-desc">
                                    {planet.description}
                                    {planet.moons.length > 0
                                      ? ` · ${planet.moons.length} moon${planet.moons.length > 1 ? 's' : ''}`
                                      : ''}
                                  </span>
                                </span>
                                <KeyCap label={String(index + 1)} size="sm" />
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="command-deck__section-note type-body">
                    Viewing {currentSection ?? 'sector'}. Press Esc or Return to orbit to keep
                    exploring.
                  </p>
                )}

                <footer className="command-deck__footer">
                  <a href="/resume" className="command-deck__footer-link">
                    Resume
                  </a>
                  <span className="command-deck__footer-hint type-label">
                    Interactive solar portfolio
                  </span>
                </footer>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

export default SystemNavigation;

