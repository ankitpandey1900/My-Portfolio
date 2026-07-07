import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helperText?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, label, id, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 selection:bg-transparent"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded border border-border/40 bg-space-black/50 px-3 py-1 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none disabled:opacity-40 disabled:cursor-not-allowed font-sans',
            {
              'border-destructive/65 focus:border-destructive focus:ring-destructive/50': error,
            },
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive font-sans">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500 font-sans">{helperText}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  label?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, label, id, disabled, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5 font-sans">
        {label && (
          <label
            htmlFor={id}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 selection:bg-transparent"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex min-h-[80px] w-full rounded border border-border/40 bg-space-black/50 px-3 py-2 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none disabled:opacity-40 disabled:cursor-not-allowed font-sans resize-y',
            {
              'border-destructive/65 focus:border-destructive focus:ring-destructive/50': error,
            },
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-destructive font-sans">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500 font-sans">{helperText}</span>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
