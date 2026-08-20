'use client';

import * as React from 'react';

/**
 * Generates a static array of star positions at mount time.
 * Uses CSS transforms for parallax — no canvas, no Three.js overhead.
 */
function generateStars(count: number, seed: number) {
  const stars: { x: number; y: number; size: number; opacity: number; delay: number }[] = [];
  for (let i = 0; i < count; i++) {
    // Simple deterministic pseudo-random
    const hash = Math.sin(seed + i * 127.1) * 43758.5453;
    const r = hash - Math.floor(hash);
    const hash2 = Math.sin(seed + i * 269.5 + 311.7) * 43758.5453;
    const r2 = hash2 - Math.floor(hash2);
    const hash3 = Math.sin(seed + i * 419.2 + 631.2) * 43758.5453;
    const r3 = hash3 - Math.floor(hash3);

    stars.push({
      x: r * 100,
      y: r2 * 100,
      size: 0.5 + r3 * 2,
      opacity: 0.15 + r3 * 0.7,
      delay: r * 8,
    });
  }
  return stars;
}

function generateMeteors(count: number, seed: number) {
  const meteors: { top: number; left: number; delay: number; duration: number }[] = [];
  for (let i = 0; i < count; i++) {
    const hash = Math.sin(seed + i * 812.1) * 43758.5453;
    const r = hash - Math.floor(hash);
    
    const duration = 6 + r * 4; // Between 6s and 10s
    
    meteors.push({
      top: -10 + r * 50, // Spawn in top half mostly (-10 to 40)
      left: 40 + r * 60, // Spawn towards the right (40 to 100)
      delay: -(i * (12 / count)), // Evenly stagger across 12 seconds so they continuously spawn
      duration: duration
    });
  }
  return meteors;
}

interface HeroStarfieldProps {
  /** 0 = invisible, 1 = fully visible. Drives star density and brightness. */
  intensity?: number;
  /** Scroll-based parallax offset in pixels */
  parallaxY?: number;
  showMeteors?: boolean;
}

export function HeroStarfield({ intensity = 1, parallaxY = 0, showMeteors = true }: HeroStarfieldProps) {
  const stars = React.useMemo(() => generateStars(200, 42), []);
  const meteors = React.useMemo(() => generateMeteors(12, 1337), []);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    requestAnimationFrame(() => {
      if (mounted) setIsMounted(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ opacity: intensity }}
      aria-hidden
    >
      {/* Layer 1: Distant, tiny stars — slow parallax */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${parallaxY * 0.15}px)` }}
      >
        {stars.slice(0, 120).map((star, i) => (
          <div
            key={`far-${i}`}
            className="absolute rounded-full bg-white animate-[twinkle_4s_ease-in-out_infinite]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 0.6}px`,
              height: `${star.size * 0.6}px`,
              opacity: star.opacity * 0.5,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 2: Mid-range stars — medium parallax */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${parallaxY * 0.3}px)` }}
      >
        {stars.slice(120, 170).map((star, i) => (
          <div
            key={`mid-${i}`}
            className="absolute rounded-full bg-white animate-[twinkle_3s_ease-in-out_infinite]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity * 0.7,
              animationDelay: `${star.delay * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Close, bright stars — fast parallax */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${parallaxY * 0.5}px)` }}
      >
        {stars.slice(170).map((star, i) => (
          <div
            key={`near-${i}`}
            className="absolute rounded-full animate-[twinkle_2s_ease-in-out_infinite]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 1.5}px`,
              height: `${star.size * 1.5}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay * 0.5}s`,
              background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,180,140,0.3) 60%, transparent 100%)`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255,255,255,${star.opacity * 0.3})`,
            }}
          />
        ))}
      </div>

      {/* Layer 4: Falling Meteors */}
      {showMeteors && (
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${parallaxY * 0.2}px)` }}
        >
          {meteors.map((meteor, i) => (
            <div
              key={`meteor-${i}`}
              className="meteor"
              style={{
                top: `${meteor.top}%`,
                left: `${meteor.left}%`,
                animation: `meteor ${meteor.duration}s linear infinite`,
                animationDelay: `${meteor.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Nebula gradient overlay — intensifies with scroll */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: Math.min(intensity * 0.6, 0.6),
          background: `
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(88,122,150,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(216,162,74,0.05) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  );
}

