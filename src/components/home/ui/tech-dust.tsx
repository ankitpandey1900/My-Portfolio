'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface TechDustItem {
  label: string;
  color: string;
  x: number;       // % from left
  y: number;       // % from top
  size: number;     // rem
  blur: number;     // px
  duration: number; // seconds for float cycle
  delay: number;    // initial animation delay
}

const TECH_DUST: TechDustItem[] = [
  { label: '{ TS }',     color: '#3178c6', x: 8,  y: 18, size: 1.2, blur: 2, duration: 22, delay: 0 },
  { label: '<Next />',   color: '#ffffff', x: 85, y: 12, size: 1.0, blur: 3, duration: 28, delay: 2 },
  { label: 'Pg',         color: '#336791', x: 92, y: 65, size: 1.1, blur: 2, duration: 25, delay: 4 },
  { label: '{ }',        color: '#f0db4f', x: 5,  y: 72, size: 0.9, blur: 3, duration: 30, delay: 1 },
  { label: 'fn()',       color: '#61dafb', x: 78, y: 85, size: 0.8, blur: 2, duration: 26, delay: 3 },
  { label: '[ ]',        color: '#8b5cf6', x: 15, y: 45, size: 0.7, blur: 4, duration: 32, delay: 5 },
];

export function TechDust() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      {TECH_DUST.map((item) => (
        <TechDustParticle key={item.label} item={item} />
      ))}
    </div>
  );
}

function TechDustParticle({ item }: { item: TechDustItem }) {
  return (
    <motion.span
      className="absolute font-mono font-bold select-none"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        fontSize: `${item.size}rem`,
        color: item.color,
        filter: `blur(${item.blur}px)`,
        opacity: 0,
        textShadow: `0 0 12px ${item.color}40, 0 0 24px ${item.color}20`,
      }}
      animate={{
        opacity: [0, 0.15, 0.08, 0.15, 0],
        y: [0, -20, -10, -25, 0],
        x: [0, 8, -5, 10, 0],
        rotate: [0, 5, -3, 4, 0],
      }}
      transition={{
        duration: item.duration,
        repeat: Infinity,
        delay: item.delay,
        ease: 'easeInOut' as const,
      }}
    >
      {item.label}
    </motion.span>
  );
}

