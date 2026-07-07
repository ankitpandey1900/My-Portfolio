import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'feature' | 'project' | 'stat' | 'modal';
  glowColor?: 'teal' | 'orange' | 'violet' | 'none';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glowColor = 'none', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border text-card-foreground font-sans transition-all duration-300',
          {
            // Default base card
            'bg-card border-border/40': variant === 'default',
            // Glass Card (NASA HUD dashboard style)
            'bg-space-black/40 border-hud-teal/20 backdrop-blur-md shadow-surface hover:border-hud-teal/40':
              variant === 'glass',
            // Feature Package Card
            'bg-space-blue/30 border-border/40 hover:bg-space-blue/40 hover:border-hud-teal/30 shadow-surface':
              variant === 'feature',
            // Project details Card
            'bg-card border-border/30 hover:border-hud-teal/50 hover:shadow-panel-teal':
              variant === 'project',
            // Telemetry / Statistic Console Card
            'bg-space-black/60 border-border/50 p-4 hover:border-solar-orange/40 shadow-surface':
              variant === 'stat',
            // Modal dialog Card
            'bg-card/95 border-border/80 shadow-dialog backdrop-blur-lg': variant === 'modal',
          },
          {
            'hover:shadow-glow-teal hover:border-hud-teal/50': glowColor === 'teal',
            'hover:shadow-glow-orange hover:border-solar-orange/50': glowColor === 'orange',
            'hover:shadow-glow-violet hover:border-space-violet/50': glowColor === 'violet',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };
