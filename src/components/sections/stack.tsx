import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StackProps {
  children: ReactNode;
  className?: string;
}

/**
 * A single bordered surface that separates its children with hairlines.
 * Used by the experience and education lists so related entries read as
 * one composed block instead of a pile of floating cards.
 */
export function Stack({ children, className }: StackProps) {
  return (
    <div className={cn('divide-y divide-border overflow-hidden rounded-xl border bg-card shadow-sm', className)}>{children}</div>
  );
}
