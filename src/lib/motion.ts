import type { Transition, Variants } from 'framer-motion';

export const motionEase = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const titleReveal: Variants = {
  hidden: { opacity: 0, y: 20, letterSpacing: '0.08em' },
  visible: { opacity: 1, y: 0, letterSpacing: '0.02em' },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export function fadeUpTransition(delay = 0): Transition {
  return {
    duration: 0.62,
    delay,
    ease: motionEase,
  };
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export const slideBlur: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

