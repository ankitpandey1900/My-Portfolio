import * as React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  align?: 'left' | 'right';
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, isOpen, align = 'right', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed top-0 bottom-0 z-40 w-full max-w-md bg-space-black/90 border-hud-teal/20 backdrop-blur-lg shadow-dialog transition-transform duration-500 p-6 flex flex-col',
          {
            // Alignment controls (Slide-in transitions)
            'right-0 border-l': align === 'right',
            'translate-x-full': !isOpen && align === 'right',

            'left-0 border-r': align === 'left',
            '-translate-x-full': !isOpen && align === 'left',

            'translate-x-0': isOpen,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';

export { Panel };
