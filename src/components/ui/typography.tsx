import * as React from 'react';
import { cn } from '@/lib/utils';

type TypographyVariant =
  | 'display-xl'
  | 'display-l'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label'
  | 'code';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

const defaultTags: Record<TypographyVariant, React.ElementType> = {
  'display-xl': 'h1',
  'display-l': 'h2',
  heading: 'h3',
  title: 'h4',
  subtitle: 'p',
  body: 'p',
  caption: 'span',
  label: 'label',
  code: 'code',
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'body', as, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (as || defaultTags[variant]) as any;

    return (
      <Component
        ref={ref}
        className={cn(
          'transition-colors duration-200',
          {
            // Large cosmic titles
            'font-title text-4xl md:text-5xl font-extrabold tracking-tight text-white':
              variant === 'display-xl',
            // Section/Planet focal headers
            'font-title text-2xl md:text-3xl font-bold tracking-tight text-slate-100':
              variant === 'display-l',
            // Modal / Component headers
            'font-title text-lg md:text-xl font-semibold tracking-wide text-white':
              variant === 'heading',
            // Card visual headers
            'font-title text-sm md:text-base font-bold tracking-wide text-slate-200':
              variant === 'title',
            // Explanatory descriptive text
            'font-sans text-sm md:text-base font-normal leading-relaxed text-slate-400':
              variant === 'subtitle',
            // Paragraph copy text
            'font-sans text-xs md:text-sm font-normal leading-relaxed text-slate-300':
              variant === 'body',
            // Small form details
            'font-sans text-[11px] font-medium leading-none text-slate-500': variant === 'caption',
            // Dynamic uppercase badges
            'font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400':
              variant === 'label',
            // Monospace instrumentation telemetry text
            'font-mono text-xs font-semibold bg-secondary/35 px-1.5 py-0.5 rounded text-primary border border-border/10':
              variant === 'code',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Typography.displayName = 'Typography';

export { Typography };
