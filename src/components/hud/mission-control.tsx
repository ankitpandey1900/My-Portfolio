'use client';

import * as React from 'react';
import { useHomePlanetStore } from '@/components/home/home-planet-state';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { useNavigationStore } from '@/components/navigation/navigation-store';
import { SECTION_REGISTRY } from '@/components/section-loader/section-registry';
import type { SectionId } from '@/components/section-loader/section-loader-types';
import { cn } from '@/lib/utils';

export function MissionControl() {
  const heroPhase = useHomePlanetStore((s) => s.phase);
  const navState = useNavigationStore((s) => s.state);
  const currentSection = useNavigationStore((s) => s.currentSectionId);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isHeroVisible = heroPhase !== 'dismissed' && heroPhase !== 'idle';
  const isInSystem = !isHeroVisible;
  const isMenuOpen = menuOpen && isInSystem;
  const isViewingSection = navState === 'viewingSection' || navState === 'focused';

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleWarp = (sectionId: SectionId) => {
    setMenuOpen(false);
    NavigationController.navigateToSectionFromUI(sectionId);
  };

  const handleReturn = () => {
    setMenuOpen(false);
    NavigationController.goHome();
  };

  if (!isInSystem) return null;

  const sectionLabel = currentSection
    ? SECTION_REGISTRY[currentSection as SectionId]?.name
    : null;

  return (
    <>
      {isViewingSection && (
        <button type="button" className="mission-control__return" onClick={handleReturn}>
          Return
        </button>
      )}

      <div className={cn('mission-control', isMenuOpen && 'mission-control--open')}>
        <button
          type="button"
          className="mission-control__trigger"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="mission-control__monogram">AP</span>
          <span className="mission-control__trigger-label">
            {sectionLabel ?? 'Explore'}
          </span>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="mission-control__scrim"
              role="presentation"
              onClick={() => setMenuOpen(false)}
            />
            <nav className="mission-control__menu" aria-label="Portfolio sections">
              {(Object.keys(SECTION_REGISTRY) as SectionId[])
                .filter((id) => id !== 'home')
                .map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={cn(
                      'mission-control__menu-item',
                      currentSection === id && 'mission-control__menu-item--active'
                    )}
                    onClick={() => handleWarp(id)}
                  >
                    {SECTION_REGISTRY[id].name}
                  </button>
                ))}
              <a href="/resume" className="mission-control__menu-item mission-control__menu-item--quiet">
                Resume
              </a>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
