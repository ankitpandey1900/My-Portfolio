import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline' | 'destructive';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans tracking-wide border transition-colors select-none',
          {
            'bg-muted/30 text-muted-foreground border-border/40': variant === 'default',
            'bg-primary/10 text-primary border-primary/20 shadow-[0_0_8px_rgba(0,229,229,0.05)]':
              variant === 'primary',
            'bg-secondary/45 text-secondary-foreground border-border/30': variant === 'secondary',
            'bg-accent/10 text-accent border-accent/20 shadow-[0_0_8px_rgba(255,106,0,0.05)]':
              variant === 'accent',
            'border-border/60 text-slate-300 bg-transparent': variant === 'outline',
            'bg-destructive/10 text-destructive border-destructive/20': variant === 'destructive',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
