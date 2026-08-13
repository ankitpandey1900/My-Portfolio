import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'feature' | 'project' | 'stat' | 'modal';
  glowColor?: 'teal' | 'orange' | 'violet' | 'none';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glowColor: _glowColor = 'none', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border text-card-foreground font-sans transition-colors duration-300',
          {
            'bg-card border-border/40': variant === 'default',
            'bg-space-black/60 border-border/30': variant === 'glass',
            'bg-space-blue/20 border-border/30 hover:border-border/50': variant === 'feature',
            'bg-card border-border/30 hover:border-border/50': variant === 'project',
            'bg-space-black/60 border-border/40 p-4': variant === 'stat',
            'bg-card/95 border-border/60 shadow-dialog': variant === 'modal',
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

