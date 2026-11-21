import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'default' | 'primary' | 'emerald' | 'amber' | 'rose' | 'muted';

const TONE_CLASSES: Record<BadgeTone, string> = {
  default: 'border-border bg-secondary text-secondary-foreground',
  primary: 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  rose: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300',
  muted: 'border-border bg-muted/60 text-muted-foreground',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeTone;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors',
        TONE_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
