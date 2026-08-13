import * as React from 'react';
import { cn } from '@/lib/utils';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  glow?: boolean;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'shrink-0',
          {
            'h-[1px] w-full bg-gradient-to-r from-transparent via-border/30 to-transparent':
              orientation === 'horizontal' && !glow,
            'h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent':
              orientation === 'horizontal' && glow,

            'h-full w-[1px] bg-gradient-to-b from-transparent via-border/30 to-transparent':
              orientation === 'vertical' && !glow,
            'h-full w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent':
              orientation === 'vertical' && glow,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Divider.displayName = 'Divider';

export { Divider };

