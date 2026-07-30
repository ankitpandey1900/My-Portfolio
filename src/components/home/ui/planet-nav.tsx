'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = ['About', 'Projects', 'Skills', 'Resume', 'Freelance', 'Contact'];

export function PlanetNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Keyframes for Mars texture rotation */}
      <style jsx global>{`
        @keyframes mars-rotate {
          from { background-position-x: 0%; }
          to { background-position-x: 200%; }
        }
      `}</style>

      {/* The Planet Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[60] w-12 h-12 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-110 group"
        aria-label="Toggle Navigation"
      >
        {/* Real Mars texture rotating on Y-axis via CSS keyframe */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: "url('/assets/planet-surface.png')",
            backgroundSize: "200% 100%",
            animation: "mars-rotate 20s linear infinite",
            filter: "hue-rotate(20deg) saturate(1.5) brightness(1.2)", // Make it look more Mars-like
          }}
        />
        
        {/* 3D lighting overlay — light from top-left, dark on bottom-right */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_50%,rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_-5px_-5px_12px_rgba(0,0,0,0.9),inset_2px_2px_8px_rgba(255,200,150,0.2)]" />
        
        {/* State indicator (Cross icon when open) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <span className="text-white text-lg font-bold">✕</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* The Full-Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((item, i) => (
                <motion.a
                  key={item}
                  href={item === 'Resume' ? '/resume' : item === 'Freelance' ? '/freelance' : `#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white/50 hover:text-white transition-colors relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  whileHover={{ scale: 1.1, color: '#fff', letterSpacing: '0.05em' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            
            {/* Ambient background decoration inside menu */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
