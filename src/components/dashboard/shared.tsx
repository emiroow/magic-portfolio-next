'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RotateCw, X } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * Building blocks shared by every dashboard section so the admin UI
 * stays visually consistent: headers, empty/error/loading states and
 * the animated form panel.
 */

/** Section heading row with title and trailing actions. */
export function SectionShell({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-24">
      <div className="mt-3 flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Centered empty state with an optional primary action. */
export function EmptyState({ text, actionText, onAction }: { text: string; actionText?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      {actionText && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

/** Query error state with a retry button. */
export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const t = useTranslations('dashboard');

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-destructive/40 py-14 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <p className="text-sm text-muted-foreground">{message || t('loadError')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw className="me-2 h-3.5 w-3.5" />
          {t('retry')}
        </Button>
      )}
    </div>
  );
}

/** Loading skeleton rows while a query is pending. */
export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

/** Slide-in form panel with enter/exit animation and a close affordance. */
export function FormPanel({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const t = useTranslations('dashboard');

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          key="form-panel"
          initial={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t('cancel')}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Label + control + inline error text. */
export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
