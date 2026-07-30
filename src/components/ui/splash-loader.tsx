'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashLoader() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
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
      const timeout = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      {/* Keyframes */}
      <style jsx global>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes planet-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(251,146,60,0.3), inset -4px -4px 8px rgba(0,0,0,0.8); }
          50% { box-shadow: 0 0 35px rgba(251,146,60,0.5), inset -4px -4px 8px rgba(0,0,0,0.8); }
        }
      `}</style>

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
            <div className="relative w-32 h-32 mb-12">
              {/* Central glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-1 bg-orange-400 rounded-full shadow-[0_0_20px_8px_rgba(251,146,60,0.3)]" />
              </div>

              {/* Orbit ring 1 */}
              <div
                className="absolute inset-2 border border-white/[0.06] rounded-full"
                style={{ animation: 'orbit-spin 3s linear infinite' }}
              >
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 via-red-600 to-red-900"
                  style={{ animation: 'planet-pulse 2s ease-in-out infinite' }}
                />
              </div>

              {/* Orbit ring 2 */}
              <div
                className="absolute inset-0 border border-white/[0.04] rounded-full"
                style={{ animation: 'orbit-spin 5s linear infinite reverse' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-800" />
              </div>
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
