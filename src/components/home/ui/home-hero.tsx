'use client';

import * as React from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { HomePlanetController } from '../home-planet-controller';
import { HOME_PLANET_CONFIG } from '../home-planet-config';
import { useHomePlanetStore } from '../home-planet-state';
import { Utensils, Mail } from 'lucide-react';
import { HeroStarfield } from './hero-starfield';

const IconX = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const IconLinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconGitHub = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const IconInstagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// ─── Animation helpers ──────────────────────────────────────────────────────

const ease = [0.19, 1, 0.22, 1] as const;
const slowEase = [0.25, 1, 0.25, 1] as const;

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

/** Animated counter that counts up when element enters viewport */
function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const numericPart = parseInt(target.replace(/\D/g, ''), 10);
  const nonNumeric = target.replace(/[0-9]/g, '');
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericPart));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, numericPart]);

  return (
    <span ref={ref}>
      {count}{nonNumeric}{suffix}
    </span>
  );
}

/** Scroll-triggered reveal wrapper */
function Reveal({
  children,
  delay = 0,
  y = 40,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Text that reveals via a clip-path wipe */
function TextWipe({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Horizontal line that draws itself */
function DrawLine({ delay = 0, className = '' }: { delay?: number; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      className={`h-px bg-white/[0.06] ${className}`}
      initial={{ scaleX: 0, transformOrigin: 'left' }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.4, delay, ease }}
    />
  );
}

/** Image with parallax and clip-path reveal */
function CinematicImage({ 
  src, 
  alt, 
  className = '',
  containerRef 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    container: containerRef,
    offset: ['start end', 'end start'] 
  });
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full"
        initial={{ clipPath: 'inset(100% 0 0 0)' }}
        animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
        transition={{ duration: 1.4, ease: slowEase }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover origin-center"
          style={{ y, scale }}
        />
      </motion.div>
    </div>
  );
}

// ─── Minimal Tech Icons (SVG) ────────────────────────────────────────────────

const TechIcons = {
  TS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 4h16v16H4z" />
      <path d="M9 10v6M7 10h4M16 11c0-1.5-3-1.5-3 0s3 1.5 3 3-3 1.5-3 1.5" />
    </svg>
  ),
  JS: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 4h16v16H4z" />
      <path d="M10 16v-6M10 16c0 1.5-2 1.5-2 0M16 11c0-1.5-3-1.5-3 0s3 1.5 3 3-3 1.5-3 1.5" />
    </svg>
  ),
  Python: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 4c-3.3 0-4 1.3-4 3v2h5v1H7C4.2 10 4 12 4 14c0 3 1.3 4 4 4h1v-2c0-2.2 1.8-4 4-4h2v-3c0-3.3-1.3-5-7-5z" />
      <path d="M12 20c3.3 0 4-1.3 4-3v-2h-5v-1h6c2.8 0 3-2 3-4 0-3-1.3-4-4-4h-1v2c0 2.2-1.8 4-4 4h-2v3c0 3.3 1.3 5 7 5z" />
    </svg>
  ),
  React: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
    </svg>
  ),
  Nextjs: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M15 15l-5-6v6M15 9v6" />
    </svg>
  ),
  Threejs: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 8l-6 11h12L12 8z" />
    </svg>
  ),
  Prisma: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 2L2 22h20L12 2z" />
      <path d="M12 8v14" />
    </svg>
  ),
  PostgreSQL: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </svg>
  ),
  Docker: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 14h16v4H4z" />
      <path d="M8 10h4v4H8z" />
      <path d="M12 10h4v4h-4z" />
      <path d="M8 6h4v4H8z" />
    </svg>
  ),
  Git: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M6 9v9" />
      <path d="M18 15v3" />
      <path d="M6 9c0 1.7 1.3 3 3 3h6" />
    </svg>
  ),
  Zustand: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M8 12h8" />
    </svg>
  ),
  FramerMotion: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M4 4h8l8 8-8 8H4l8-8z" />
    </svg>
  ),
  Shadcn: () => (
    <svg viewBox="0 0 256 256" fill="none" stroke="currentColor" strokeWidth="16" className="w-5 h-5">
      <line x1="208" y1="128" x2="128" y2="208" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="192" y1="40" x2="40" y2="192" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Tailwind: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 8.5C12 7 11 6 9.5 6 7.5 6 6 8 6 10s2 2 3.5 2C11 12 12 11 12 9.5v-1z" />
      <path d="M18 15.5c0-1.5-1-2.5-2.5-2.5-2 0-3.5 2-3.5 4s2 2 3.5 2c1.5 0 2.5-1 2.5-2.5v-1z" />
    </svg>
  ),
  BetterAuth: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  SQL: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
      <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
    </svg>
  ),
};

// ─── Main component ──────────────────────────────────────────────────────────

export function HomeHero() {
  const phase = useHomePlanetStore((s) => s.phase);
  const isVisible = useHomePlanetStore((s) => s.isVisible);
  const { identity, mission, stats, primaryCTA, secondaryCTA } = HOME_PLANET_CONFIG;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(true);
  const [isLaunching, setIsLaunching] = React.useState(false);

  // Scroll-driven transforms
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroImgY = useTransform(scrollYProgress, [0, 0.4], [0, 150]); 
  const heroImgScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const ghostNumberY = useParallax(scrollYProgress, 50);

  // Mouse-driven tilt for project cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  React.useEffect(() => {
    if (phase === 'dismissed') {
      const t = setTimeout(() => setMounted(false), 1400);
      return () => clearTimeout(t);
    }
  }, [phase]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat || phase !== 'ready') return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, button, a')) return;
      handleLaunch();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => HomePlanetController.beginJourney(), 1000);
  };

  if (!mounted || !isVisible) return null;
  const isDismissed = phase === 'dismissed';

  return (
    <>
      {/* Warp flash on launch */}
      {isLaunching && (
        <motion.div
          className="fixed inset-0 z-[200] bg-white pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.9, 0] }}
          transition={{ duration: 1, times: [0, 0.6, 0.8, 1] }}
        />
      )}

      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-20 overflow-y-auto overflow-x-hidden"
        style={{ background: '#030305' }}
        animate={{ opacity: isDismissed ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        {/* Fixed Background Image across ALL sections */}
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none"
        >
          <img
            src="/assets/hero-space.png"
            alt=""
            className="w-full h-full object-cover opacity-60"
            aria-hidden
          />
          <HeroStarfield intensity={1} parallaxY={0} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/60 to-[#030305]/95" />
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — HERO
        ════════════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col">

          <header className="relative z-10 flex items-center justify-center md:justify-end px-5 md:px-16 pt-8">
            <nav className="flex items-center justify-center gap-5 md:gap-8 w-full md:w-auto">
              {['About', 'Projects', 'Skills', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[10px] md:text-xs font-sans font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </header>

          <motion.div
            className="relative z-10 flex-1 flex flex-col justify-center pt-10 pb-20 md:justify-end md:pt-0 md:pb-24 px-5 md:px-16"
            style={{ y: heroTextY }}
          >
            <div className="flex flex-col mb-10 md:mb-12 relative z-10 items-center md:items-start w-full">
              <div className="overflow-hidden">
                <motion.h1
                  className="text-[clamp(3.5rem,13vw,9rem)] font-display font-extrabold text-white leading-[0.9] tracking-[-0.04em] max-w-5xl"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 1.2, ease }}
                >
                  ANKIT
                </motion.h1>
              </div>
              <div className="overflow-hidden mt-0 md:mt-2">
                <motion.h1
                  className="text-[clamp(3.5rem,13vw,9rem)] font-display font-extrabold text-white leading-[0.9] tracking-[-0.04em] max-w-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 1.2, ease }}
                >
                  PANDEY
                </motion.h1>
              </div>
            </div>

            {/* Apple/Tesla Typography applied to these specific numbers */}
            <motion.div
              className="grid grid-cols-3 md:flex items-start md:items-end gap-3 md:gap-20 mb-8 md:mb-10 w-full max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center md:items-start text-center md:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.15, duration: 0.8, ease }}
                >
                  <span className="text-3xl sm:text-4xl md:text-5xl font-sans font-light text-white tracking-tighter">
                    <AnimatedCounter target={stat.value} />
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-sans font-semibold uppercase tracking-widest text-white/50 mt-1 md:mt-2 leading-relaxed">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-sm md:text-lg text-white/60 max-w-lg leading-relaxed font-normal text-center md:text-left px-4 md:px-0 mx-auto md:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1.2 }}
            >
              {identity.tagline}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1.2 }}
              className="mt-8 md:mt-10 flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <button 
                onClick={handleLaunch}
                className="inline-flex justify-center items-center gap-3 px-6 py-3 md:py-3.5 rounded-full bg-white text-black text-sm font-sans font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all cursor-pointer"
              >
                Launch Solar System
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              
              <a href="#projects" className="inline-flex justify-center items-center gap-3 px-6 py-3 md:py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white text-sm font-sans font-medium transition-colors">
                Explore My Work
                <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — ABOUT
        ════════════════════════════════════════════════════════════════════ */}
        <section id="about" className="relative px-5 md:px-16 py-16 md:py-24">
          <DrawLine className="mb-16" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5">
              <Reveal delay={0}>
                <p className="text-[11px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 mb-6">
                  01 — About
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/30 pr-2 pb-2">
                  {identity.title}
                </h2>
              </Reveal>
            </div>

            <div className="md:col-span-7 md:pt-4">
              <Reveal delay={0.2}>
                <p className="text-lg md:text-xl text-white/40 leading-[1.8] mb-10 font-light whitespace-pre-line">
                  {identity.bio}
                </p>
              </Reveal>
              <Reveal delay={0.35}>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors cursor-default">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-[11px] font-sans font-semibold text-white/60 tracking-wide uppercase">Available for Hire</span>
                  </div>
                  
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors cursor-default">
                    <span className="text-[11px] font-sans font-semibold text-white/60 tracking-wide uppercase">📍 India</span>
                  </div>

                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors cursor-default">
                    <span className="text-[11px] font-sans font-semibold text-white/60 tracking-wide uppercase">⚡ {identity.currentFocus}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Freelance Spotlight */}
          <div className="mt-16 md:mt-24 max-w-7xl mx-auto p-6 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -inset-20 bg-gradient-to-r from-amber-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <Reveal delay={0.1}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">Independent Engineer & Freelance Developer</h3>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-white/50 text-base md:text-lg leading-relaxed font-light mb-6">
                  Crafting tailored web solutions and scalable architectures.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-white/20 shrink-0"></div>
                    <span className="text-white/70 text-base md:text-lg font-light tracking-wide">Delivered 5+ global freelance projects</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-white/20 shrink-0"></div>
                    <span className="text-white/70 text-base md:text-lg font-light tracking-wide">Built 3 complete full-stack systems from the ground up</span>
                  </div>
                </div>
              </Reveal>
            </div>
            
            <Reveal delay={0.3} className="relative z-10 shrink-0 w-full md:w-auto">
              <a href="#contact" className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black text-xs font-sans font-bold tracking-widest uppercase hover:scale-105 transition-transform w-full md:w-auto shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Start a Project
              </a>
            </Reveal>
          </div>
        </section>



        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — PROJECTS (4 CARDS)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="projects" className="relative px-5 md:px-16 py-16 md:py-24">
          <DrawLine className="mb-16" />
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <p className="text-[11px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 mb-16">
                02 — Selected Work
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              
              {/* Project 1: AllTracker */}
              {/* Project 1: AllTracker (Featured) */}
              <Reveal delay={0.1} className="md:col-span-2">
                <motion.a
                  href="https://alltracker.online/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <img src="/assets/logos/alltracker.jpg" alt="AllTracker Logo" className="relative z-10 w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Productivity</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">AllTracker</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Gamified tracking, global leaderboard, AI strategist.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">TS · Supabase · Vite</p>
                  </div>
                </motion.a>
              </Reveal>

              {/* Project 2: Tally Mate */}
              <Reveal delay={0.2}>
                <motion.a
                  href="https://tallymate.alltracker.online/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <img src="/assets/logos/tallymate.png" alt="Tally Mate Logo" className="relative z-10 w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Finance</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">Tally Mate</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Track expenses, debts, budgets & split bills.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">Next.js · TS · Prisma</p>
                  </div>
                </motion.a>
              </Reveal>

              {/* Project 3: IP Wala */}
              <Reveal delay={0.1}>
                <motion.a
                  href="https://ipwala.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <img src="/assets/logos/ipwala.png" alt="IP Wala Logo" className="relative z-10 w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Networking</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">IP Wala</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Terminal-first DNS & Network toolkit.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">Next.js · TS · Tailwind</p>
                  </div>
                </motion.a>
              </Reveal>

              {/* Project 4: Bank Niti */}
              <Reveal delay={0.2}>
                <motion.a
                  href="https://github.com/ankitpandey1900/bankniti"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <img src="/assets/logos/bankniti.png" alt="Bank Niti Logo" className="relative z-10 w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Platform</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">Bank Niti</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Premium financial utilities & IFSC lookups.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">Next.js 16 · Tailwind 4</p>
                  </div>
                </motion.a>
              </Reveal>

              {/* Project 5: Mess Tracker */}
              <Reveal delay={0.1}>
                <motion.a
                  href="https://mess-tracker.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-[#0a100d] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <Utensils className="w-10 h-10 md:w-12 md:h-12 text-[#00ff88] group-hover:scale-110 transition-transform duration-500" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Management</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">Mess Tracker</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Thali Management with streaks & heatmap.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">HTML · CSS · JS</p>
                  </div>
                </motion.a>
              </Reveal>

              {/* Project 6: Fitness Tracker */}
              <Reveal delay={0.2}>
                <motion.a
                  href="https://github.com/ankitpandey1900/fitness_tracker"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                    <div className="text-3xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors">FT</div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 truncate pr-4">Health</span>
                      <svg className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white/90 tracking-tight mb-2 group-hover:text-white transition-colors truncate">Fitness Tracker</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed truncate">Daily routine for cricket academy athletes.</p>
                    <p className="text-[10px] md:text-xs text-white/25 font-mono mt-2 uppercase tracking-wide">Web · Mobile-first</p>
                  </div>
                </motion.a>
              </Reveal>
              
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 6 — TECH STACK (WITH SVG ICONS)
        ════════════════════════════════════════════════════════════════════ */}
        <section id="skills" className="relative px-5 md:px-16 py-16 md:py-24">
          <DrawLine className="mb-16" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <Reveal>
                <p className="text-[11px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 mb-4">
                  03 — Core Systems
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-2xl font-display font-bold text-white/90 tracking-tight">
                  Technologies
                </h2>
              </Reveal>
            </div>

            <div className="md:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Frontend (Col 1 & 2) */}
                <Reveal delay={0.1} className="lg:col-span-2">
                  <div className="h-full p-5 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-default relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="text-sm font-sans font-semibold text-white/70 tracking-wide mb-8">Frontend Architecture</h3>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: 'React', Icon: TechIcons.React },
                        { name: 'Next.js', Icon: TechIcons.Nextjs },
                        { name: 'TypeScript', Icon: TechIcons.TS },
                        { name: 'JavaScript', Icon: TechIcons.JS },
                        { name: 'shadcn/ui', Icon: TechIcons.Shadcn },
                        { name: 'Tailwind CSS', Icon: TechIcons.Tailwind },
                      ].map(tech => (
                        <div key={tech.name} className="flex flex-col items-center gap-3">
                           <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-white transition-colors duration-500 group-hover:scale-110 group-hover:border-white/[0.15]">
                             <div className="scale-125"><tech.Icon /></div>
                           </div>
                           <span className="text-[11px] font-sans font-medium text-white/40 group-hover:text-white/80 transition-colors">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Backend (Col 3, Row span 2) */}
                <Reveal delay={0.2} className="lg:col-span-1 lg:row-span-2">
                  <div className="h-full p-5 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-default relative overflow-hidden group">
                    <h3 className="text-sm font-sans font-semibold text-white/70 tracking-wide mb-8">Backend Systems</h3>
                    <div className="flex flex-col gap-4">
                      {[
                        { name: 'Python', Icon: TechIcons.Python },
                        { name: 'PostgreSQL', Icon: TechIcons.PostgreSQL },
                        { name: 'SQL', Icon: TechIcons.SQL },
                        { name: 'Prisma', Icon: TechIcons.Prisma },
                        { name: 'Better Auth', Icon: TechIcons.BetterAuth },
                      ].map(tech => (
                        <div key={tech.name} className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-white transition-colors duration-500 group-hover:scale-110 group-hover:border-white/[0.15] shrink-0">
                             <div className="scale-110"><tech.Icon /></div>
                           </div>
                           <span className="text-xs font-sans font-medium text-white/50 group-hover:text-white/90 transition-colors">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Animation & State (Col 1) */}
                <Reveal delay={0.3} className="lg:col-span-1">
                  <div className="h-full p-5 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-default relative overflow-hidden group">
                    <h3 className="text-sm font-sans font-semibold text-white/70 tracking-wide mb-6">Creative & State</h3>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { name: 'Three.js', Icon: TechIcons.Threejs },
                        { name: 'Framer', Icon: TechIcons.FramerMotion },
                        { name: 'Zustand', Icon: TechIcons.Zustand },
                      ].map(tech => (
                        <div key={tech.name} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-3 py-2 rounded-lg group-hover:border-white/[0.15] transition-colors">
                           <div className="text-white/40 group-hover:text-white transition-colors scale-90"><tech.Icon /></div>
                           <span className="text-[10px] font-sans font-medium text-white/60">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* DevOps (Col 2) */}
                <Reveal delay={0.4} className="lg:col-span-1">
                  <div className="h-full p-5 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] hover:border-white/[0.1] transition-all cursor-default relative overflow-hidden group">
                    <h3 className="text-sm font-sans font-semibold text-white/70 tracking-wide mb-6">DevOps</h3>
                    <div className="flex gap-4">
                      {[
                        { name: 'Docker', Icon: TechIcons.Docker },
                        { name: 'Git', Icon: TechIcons.Git },
                      ].map(tech => (
                        <div key={tech.name} className="flex-1 flex flex-col items-center gap-3">
                           <div className="w-full aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/40 group-hover:text-white transition-colors duration-500 group-hover:border-white/[0.15]">
                             <div className="scale-125"><tech.Icon /></div>
                           </div>
                           <span className="text-[10px] font-sans font-medium text-white/40">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* AI Tools */}
              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] text-white/30 whitespace-nowrap">AI & Productivity</span>
                  <div className="flex flex-wrap items-center gap-3">
                    {['Claude', 'Cursor', 'Antigravity'].map((tool) => (
                      <span key={tool} className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-sans text-white/80 font-semibold tracking-wide hover:bg-white/[0.08] hover:text-white transition-all cursor-default">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 7 — CONTACT & ENQUIRY
        ════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="relative px-5 md:px-16 py-24 md:py-32 overflow-hidden">
          <DrawLine className="mb-16" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <p className="text-[11px] md:text-xs font-sans font-semibold tracking-widest uppercase text-white/50 mb-6">
                  04 — Collaborate
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                  Let's build<br />the future.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-lg text-white/40 max-w-md leading-relaxed mb-12 font-light">
                  Whether you have a freelance project in mind, need a full-stack architecture built from scratch, or just want to connect.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                 <div className="flex flex-col gap-6">
                    <a href="mailto:ankit1pandey11@gmail.com" className="inline-flex items-center gap-4 text-white/50 hover:text-white transition-colors group w-fit">
                       <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.1] group-hover:scale-110 transition-all">
                          <Mail className="w-5 h-5" />
                       </div>
                       <span className="font-sans text-sm tracking-wide font-medium">ankit1pandey11@gmail.com</span>
                    </a>
                 </div>
              </Reveal>
            </div>
            
            <Reveal delay={0.4}>
              <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md relative shadow-2xl w-full">
                 <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest pl-1">Name</label>
                       <input type="text" placeholder="Ankit Pandey" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all font-sans" />
                     </div>
                     <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest pl-1">Email</label>
                       <input type="email" placeholder="ankit1pandey11@gmail.com" className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all font-sans" />
                     </div>
                   </div>
                   <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest pl-1">Project Details</label>
                     <textarea placeholder="Tell me about your project, timeline, and goals..." rows={4} className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all font-sans resize-none"></textarea>
                   </div>
                   <button className="mt-2 w-full py-4 rounded-2xl bg-white text-black font-sans font-bold uppercase tracking-widest text-xs hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                     Send Transmission
                   </button>
                 </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════════════════════════ */}
        <footer className="relative px-5 md:px-16 py-12">
          <DrawLine className="mb-8" />
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.span
              className="text-[11px] font-sans font-semibold uppercase tracking-widest text-white/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              © 2026 Ankit Pandey
            </motion.span>
            
            <div className="flex items-center gap-3">
              {[
                { name: 'X', Icon: IconX, href: 'https://x.com/AnkitPande5641' },
                { name: 'LinkedIn', Icon: IconLinkedIn, href: 'https://www.linkedin.com/in/ankitpandey1900/' },
                { name: 'GitHub', Icon: IconGitHub, href: 'https://github.com/ankitpandey1900' },
                { name: 'Instagram', Icon: IconInstagram, href: 'https://www.instagram.com/ankit.pandey19/' },
                { name: 'Email', Icon: Mail, href: 'mailto:ankit1pandey11@gmail.com' }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
                  aria-label={social.name}
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </footer>

      </motion.div>
    </>
  );
}
