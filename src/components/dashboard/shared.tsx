'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RotateCw, X } from 'lucide-react';
import { ReactNode } from 'react';

/** Shared dashboard building blocks: headers, empty/error/loading states and the form panel. */

/** Section heading row with title, trailing actions and a hairline rule. */
export function SectionShell({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-16">
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-tight ltr:tracking-tight sm:text-xl">{title}</h2>
        {action}
      </div>
      <div aria-hidden className="rule-fade mt-4" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Centered empty state with an optional primary action. */
export function EmptyState({ text, actionText, onAction }: { text: string; actionText?: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-14 text-center">
      <p className="max-w-sm px-6 text-sm leading-relaxed text-muted-foreground">{text}</p>
      {actionText && onAction && (
        <Button variant="outline" onClick={onAction} className="rounded-full">
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
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-destructive/40 py-14 text-center">
      <span aria-hidden className="flex size-11 items-center justify-center rounded-full border border-destructive/40">
        <AlertTriangle className="size-4 text-destructive" />
      </span>
      <p className="max-w-sm px-6 text-sm leading-relaxed text-muted-foreground">{message || t('loadError')}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="rounded-full">
          <RotateCw className="me-2 size-3.5" aria-hidden />
          {t('retry')}
        </Button>
      )}
    </div>
  );
}

/** Loading skeleton mirroring the divided list surface. */
export function LoadingRows({ rows = 3 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border" aria-busy="true">
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-[76px] w-full rounded-none" />
        ))}
      </div>
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="rounded-xl border bg-card p-4 shadow-sm sm:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold ltr:tracking-tight">{title}</h3>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label={t('cancel')}>
              <X className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-5">{children}</div>
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
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
