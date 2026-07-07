import * as React from 'react';
import { cn } from '@/lib/utils';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  inline?: boolean;
}

const gapMap = {
  none: 'gap-0',
  xs: 'gap-1', // 4px
  sm: 'gap-2', // 8px
  md: 'gap-4', // 16px
  lg: 'gap-6', // 24px
  xl: 'gap-8', // 32px
};

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = 'col', align, justify, gap = 'md', inline = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          inline ? 'inline-flex' : 'flex',
          {
            'flex-row': direction === 'row',
            'flex-col': direction === 'col',
            'flex-row-reverse': direction === 'row-reverse',
            'flex-col-reverse': direction === 'col-reverse',
          },
          align && {
            'items-start': align === 'start',
            'items-end': align === 'end',
            'items-center': align === 'center',
            'items-baseline': align === 'baseline',
            'items-stretch': align === 'stretch',
          },
          justify && {
            'justify-start': justify === 'start',
            'justify-end': justify === 'end',
            'justify-center': justify === 'center',
            'justify-between': justify === 'between',
            'justify-around': justify === 'around',
            'justify-evenly': justify === 'evenly',
          },
          gapMap[gap],
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = 'Stack';

export { Stack };
