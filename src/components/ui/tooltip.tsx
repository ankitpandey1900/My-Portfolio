import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: React.ReactNode;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              'absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded border border-border/80 bg-card px-2.5 py-1 text-xs text-white shadow-floating backdrop-blur-md font-sans duration-150',
              className
            )}
            role="tooltip"
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';

export { Tooltip };

