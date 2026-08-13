import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 font-sans tracking-wide',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-2 focus-visible:ring-primary/45 border border-primary/20',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-secondary/45 border border-border/40',
        accent:
          'bg-accent text-accent-foreground hover:bg-accent/95 focus-visible:ring-2 focus-visible:ring-accent/45 border border-accent/20',
        outline:
          'border border-border/60 bg-transparent text-foreground hover:bg-secondary/45 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/45',
        ghost:
          'text-foreground hover:bg-secondary/45 hover:text-white focus-visible:ring-2 focus-visible:ring-primary/45',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/45 border border-destructive/20',
      },
      size: {
        default: 'h-9 gap-2 px-4',
        xs: 'h-6 gap-1 rounded-sm px-2 text-xs',
        sm: 'h-8 gap-1.5 rounded-sm px-3 text-[0.8rem]',
        lg: 'h-11 gap-2.5 px-6 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => {
    return (
      <ButtonPrimitive
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading && <Loader2 className="animate-spin mr-1 size-4" />}
        {children}
      </ButtonPrimitive>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

