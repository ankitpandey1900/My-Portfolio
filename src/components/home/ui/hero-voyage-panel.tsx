'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { HomePlanetController } from '../home-planet-controller';
import type { HeroPlanetMarker, HomePlanetPhase } from '../home-planet-types';
import { HOME_PLANET_CONFIG } from '../home-planet-config';
import { fadeUp, fadeUpTransition, scaleIn, slideBlur, staggerContainer } from '@/lib/motion';

interface HeroVoyagePanelProps {
  phase: HomePlanetPhase;
  markers: HeroPlanetMarker[];
}

function isVisible(phase: HomePlanetPhase): boolean {
  return phase === 'reveal' || phase === 'ready' || phase === 'dismissed';
}

export function HeroVoyagePanel({ phase, markers }: HeroVoyagePanelProps) {
  const visible = isVisible(phase);
  const { voyage } = HOME_PLANET_CONFIG;
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!visible) return;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % markers.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [visible, markers.length]);

  const activeMarker = markers[activeIndex];

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="hero-voyage-panel"
          aria-label="Voyage planner"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={fadeUpTransition(0.34)}
        >
          <motion.div className="hero-planet-rail" variants={staggerContainer} initial="hidden" animate="visible">
            {markers.map((marker, index) => (
              <motion.button
                key={marker.id}
                type="button"
                className="hero-planet-marker"
                data-active={index === activeIndex}
                style={{ '--marker-accent': marker.accent } as Record<string, string>}
                variants={fadeUp}
                transition={fadeUpTransition(0.08 * index)}
                onClick={() => setActiveIndex(index)}
                aria-label={`Highlight ${marker.label} sector`}
              >
                <span className="hero-planet-marker__dot" aria-hidden />
                {marker.label}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="hero-voyage-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {voyage.fields.map((field, index) => (
              <motion.div
                key={field.label}
                className="hero-voyage-cell"
                variants={slideBlur}
                transition={fadeUpTransition(0.42 + index * 0.06)}
              >
                <span className="hero-voyage-cell__label">{field.label}</span>
                <span className="hero-voyage-cell__value">{field.value}</span>
                {field.hint ? <span className="hero-voyage-cell__hint">{field.hint}</span> : null}
              </motion.div>
            ))}
          </motion.div>

          {activeMarker ? (
            <motion.p
              className="hero-voyage-route"
              key={activeMarker.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fadeUpTransition(0)}
            >
              Next stop · <strong>{activeMarker.label}</strong> sector
            </motion.p>
          ) : null}

          <motion.button
            type="button"
            className="hero-voyage-cta"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={fadeUpTransition(0.72)}
            onClick={() => HomePlanetController.beginJourney()}
          >
            <span className="hero-voyage-cta__copy">
              <Rocket className="hero-voyage-cta__icon" aria-hidden size={16} strokeWidth={1.75} />
              <span>{voyage.ctaLabel}</span>
            </span>
            <span className="hero-voyage-cta__meta">{voyage.ctaMeta}</span>
            <motion.span
              className="hero-voyage-cta__arrow"
              aria-hidden
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

