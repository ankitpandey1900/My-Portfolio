'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashLoader() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const mountTime = React.useRef(0);

  React.useEffect(() => {
    mountTime.current = performance.now();
    // Simulate progress while the page loads assets in background
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate towards end
        const increment = prev < 60 ? 3 : prev < 85 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    // Listen for full page load
    const handleLoad = () => {
      setProgress(100);
      clearInterval(interval);
    };

    if (document.readyState === 'complete') {
      // Already loaded — quick dismiss
      setTimeout(() => setProgress(100), 300);
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  React.useEffect(() => {
    if (progress >= 100) {
      // Ensure the loader stays visible for at least 2.5s total
      const minDisplayTime = 2500;
      const elapsed = performance.now() - mountTime.current;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      const timeout = setTimeout(() => setIsLoading(false), remaining + 400);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#030305]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Subtle starfield dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] h-[1px] bg-white rounded-full"
                  style={{
                    left: `${(i * 37 + 13) % 100}%`,
                    top: `${(i * 53 + 7) % 100}%`,
                    opacity: 0.2 + (i % 5) * 0.1,
                  }}
                />
              ))}
            </div>

            {/* Orbiting planet system */}
            <div className="relative w-40 h-40 mb-12">
              {/* Central glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_20px_8px_rgba(251,146,60,0.4)]" />
              </div>

              {/* Orbit ring 1 (Mars-like) */}
              <motion.div
                className="absolute inset-4 border border-white/[0.08] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
              >
                <motion.div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-red-900 shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.8)]"
                  animate={{ boxShadow: ['0 0 15px rgba(251,146,60,0.3)', '0 0 30px rgba(251,146,60,0.6)', '0 0 15px rgba(251,146,60,0.3)'] }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                />
              </motion.div>

              {/* Orbit ring 2 (Earth-like) */}
              <motion.div
                className="absolute inset-0 border border-white/[0.04] rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
              >
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-800 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </motion.div>
            </div>

            {/* Name + Progress */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="text-lg font-display font-bold tracking-[0.3em] uppercase text-white/70">
                Ankit Pandey
              </h1>

              {/* Progress bar */}
              <div className="w-48 h-[2px] bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-white/80 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                />
              </div>

              <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-white/30">
                Loading Experience
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

