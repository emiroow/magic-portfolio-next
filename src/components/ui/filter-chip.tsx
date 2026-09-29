'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Pill that filters a listing in place. The active state inverts to solid
 * ink, which is the only emphasis the monochrome palette allows, and
 * `aria-pressed` carries the state for assistive technology.
 */
export function FilterChip({
  active,
  onClick,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'border-foreground bg-foreground text-background' : 'text-muted-foreground hover:border-foreground/40 hover:text-foreground'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
