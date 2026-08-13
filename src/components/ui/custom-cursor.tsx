'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use framer-motion values for raw, zero-lag performance
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true);
    }

    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, select, textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => {
      if (window.matchMedia('(pointer: fine)').matches) setIsVisible(true);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          body, a, button, input, select, textarea, [role="button"] { cursor: none !important; }
        }
      `}} />
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      >
        {/* Core Dot (The actual pointer coordinate) */}
        <motion.div 
          className="w-2 h-2 bg-white rounded-full"
          animate={{ 
            scale: isClicking ? 0.5 : isHovering ? 0 : 1,
            opacity: isHovering ? 0 : 1
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Outer Orbit / Reticle */}
        <motion.div
          className="absolute rounded-full border border-white/50 flex items-center justify-center"
          animate={{
            width: isHovering ? 48 : 24,
            height: isHovering ? 48 : 24,
            rotate: isHovering ? 90 : 0,
            borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)'
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Orbital Satellite (Spins constantly when not hovering) */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: isHovering ? 0 : 360, opacity: isHovering ? 0 : 1 }}
            transition={{ rotate: { duration: 2, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.2 } }}
          >
            <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>

          {/* Hover Crosshairs (Only visible when hovering) */}
          {isHovering && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-1 w-0.5 h-2 bg-white" />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-1 w-0.5 h-2 bg-white" />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -left-1 w-2 h-0.5 bg-white" />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -right-1 w-2 h-0.5 bg-white" />
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

