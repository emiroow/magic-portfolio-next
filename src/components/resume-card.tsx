'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronDown, ExternalLink, PencilLine, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface ResumeCardProps {
  logoUrl?: string;
  altText?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period?: string;
  /** Extra trailing segment on the meta line (e.g. the work location). */
  meta?: string;
  /** `card` renders its own border; `row` sits inside a divided `Stack`. */
  variant?: 'card' | 'row';
  /** Dashboard mode: expansion is controlled by the parent. */
  isExpanded?: boolean;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

/** Absolute URLs open in a new tab; internal ones navigate in place. */
const isExternal = (href: string) => /^https?:\/\//i.test(href);

/** Hairline dot separating segments of the meta line. */
const Dot = () => (
  <span aria-hidden className="text-border">
    ·
  </span>
);

/**
 * Timeline entry shared by the public site (work / education) and the
 * dashboard lists. Title on the first line, role · period · place on the
 * second, so no element floats to the opposite edge of the row.
 * The description is disclosed through an explicit toggle (CSS height
 * transition, no animation runtime) so an entry can link out *and* expand.
 */
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  meta,
  variant = 'card',
  description,
  onDelete,
  onEdit,
  isExpanded: isExpandedOuter,
  onToggle,
}: ResumeCardProps) => {
  const [isExpandedInner, setIsExpandedInner] = React.useState(false);
  const isExpanded = Boolean(isExpandedOuter) || isExpandedInner;
  const headingId = React.useId();
  const t = useTranslations('dashboard');

  // The parent owns the state when it passes a toggle handler.
  const toggle = () => (onToggle ? onToggle() : setIsExpandedInner(value => !value));

  const iconButtonClass =
    'flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';

  return (
    <article
      className={cn(
        'group flex w-full flex-col',
        variant === 'row'
          ? 'px-4 py-4 transition-colors hover:bg-muted/40 focus-within:bg-muted/40 sm:px-5'
          : 'rounded-xl border bg-card px-4 py-4 shadow-sm transition-colors hover:border-foreground/30 sm:px-5'
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* The gutter is always reserved so rows stay aligned without a logo. */}
        <Avatar className="size-9 shrink-0 border sm:size-11">
          {logoUrl && (
            <AvatarImage
              src={logoUrl}
              alt={altText ?? ''}
              className="object-contain grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            />
          )}
          <AvatarFallback className="text-xs font-semibold">{(altText || title || '?').charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 grow">
          <h3 id={headingId} className="min-w-0 break-words text-sm font-semibold leading-snug sm:text-[15px]">
            {href ? (
              <Link
                href={href}
                {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="decoration-muted-foreground/50 underline-offset-2 transition-colors hover:underline"
              >
                {title}
                {isExternal(href) && <ExternalLink className="ms-1 inline-block size-3 align-baseline text-muted-foreground" aria-hidden />}
              </Link>
            ) : (
              title
            )}
            {badges && badges.length > 0 && (
              <span className="ms-2 inline-flex flex-wrap gap-1 align-middle">
                {badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="px-2 py-0 text-[10px] font-normal">
                    {badge}
                  </Badge>
                ))}
              </span>
            )}
          </h3>

          {(subtitle || period || meta) && (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-[13px]">
              {subtitle && <span className="min-w-0 break-words">{subtitle}</span>}
              {subtitle && (period || meta) && <Dot />}
              {period && <span className="shrink-0 tabular-nums whitespace-nowrap">{period}</span>}
              {period && meta && <Dot />}
              {meta && <span className="min-w-0 break-words">{meta}</span>}
            </p>
          )}
        </div>

        {(description || onEdit || onDelete) && (
          <div className="-me-1 flex shrink-0 items-center gap-0.5">
            {description && (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={`${headingId}-panel`}
                aria-label={t('details')}
                className={cn(
                  'inline-flex h-8 items-center gap-1 rounded-full px-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground',
                  isExpanded && 'text-foreground'
                )}
              >
                {/* Icon-only on the narrowest rows, labelled from `sm` up. */}
                <span className="hidden sm:inline">{t('details')}</span>
                <ChevronDown className={cn('size-4 transition-transform duration-300', isExpanded && 'rotate-180')} aria-hidden />
              </button>
            )}
            {onEdit && (
              <button type="button" onClick={onEdit} aria-label={t('edit')} className={iconButtonClass}>
                <PencilLine className="size-4" aria-hidden />
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={onDelete} aria-label={t('delete')} className={cn(iconButtonClass, 'hover:text-destructive')}>
                <Trash2 className="size-4" aria-hidden />
              </button>
            )}
          </div>
        )}
      </div>

      {description && (
        <div id={`${headingId}-panel`} role="region" aria-labelledby={headingId} inert={!isExpanded} data-open={isExpanded} className="disclosure">
          <div>
            <p className="whitespace-pre-line ps-12 pt-3 text-xs leading-relaxed text-muted-foreground sm:ps-[60px] sm:text-sm">{description}</p>
          </div>
        </div>
      )}
    </article>
  );
};
