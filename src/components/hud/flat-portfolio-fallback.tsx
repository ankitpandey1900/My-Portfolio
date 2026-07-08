'use client';

import * as React from 'react';
import { NavigationController } from '@/components/navigation/navigation-controller';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

interface FlatPortfolioFallbackProps {
  reason: 'webgl_unsupported' | 'render_crash';
}

/**
 * Accessible 2D fallback when WebGL is unavailable.
 */
export function FlatPortfolioFallback({ reason }: FlatPortfolioFallbackProps) {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 bg-space-black min-h-screen font-sans">
      <Card className="max-w-lg w-full p-8 space-y-6 border-border/30">
        <Typography variant="heading" className="text-white">
          {reason === 'webgl_unsupported' ? 'Flat portfolio mode' : '3D experience unavailable'}
        </Typography>
        <Typography variant="body" className="text-slate-400">
          The cinematic solar system requires WebGL. Browse portfolio content in accessible 2D mode
          below.
        </Typography>
        <nav className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="outline"
              size="sm"
              onClick={() => NavigationController.navigateToSection(section.id)}
            >
              {section.label}
            </Button>
          ))}
        </nav>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry 3D experience
        </Button>
      </Card>
    </div>
  );
}
