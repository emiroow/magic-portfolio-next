'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown, PencilLine, Trash2 } from 'lucide-react';
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

/**
 * Timeline entry shared by the public site (work / education) and the
 * dashboard lists. The description is disclosed through an explicit toggle
 * so an entry can link out *and* expand without the two gestures colliding.
 * Direction-agnostic: every inset uses CSS logical properties.
 */
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  variant = 'card',
  description,
  onDelete,
  onEdit,
  isExpanded: isExpandedOuter,
  onToggle,
}: ResumeCardProps) => {
  const [isExpandedInner, setIsExpandedInner] = React.useState(false);
  const isExpanded = Boolean(isExpandedOuter) || isExpandedInner;
  const panelId = React.useId();
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
          ? 'p-4 transition-colors hover:bg-muted/40 sm:px-5'
          : 'rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-foreground/30 sm:px-5'
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
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3 className="min-w-0 text-sm font-semibold leading-snug sm:text-[15px]">
              {href ? (
                <Link
                  href={href}
                  {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="transition-colors hover:underline"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
              {badges && badges.length > 0 && (
                <span className="ms-2 inline-flex flex-wrap gap-1 align-middle">
                  {badges.map((badge, index) => (
                    <Badge variant="secondary" className="px-2 py-0 text-[10px] font-normal" key={index}>
                      {badge}
                    </Badge>
                  ))}
                </span>
              )}
            </h3>
            {period && (
              <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground sm:text-xs">{period}</span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
        </div>

        {(description || onEdit || onDelete) && (
          <div className="-me-1.5 -mt-1 flex shrink-0 items-center gap-0.5">
            {description && (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-label={t('details')}
                className={iconButtonClass}
              >
                <ChevronDown className={cn('size-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
              </button>
            )}
            {onEdit && (
              <button type="button" onClick={onEdit} aria-label={t('edit')} className={iconButtonClass}>
                <PencilLine className="size-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                aria-label={t('delete')}
                className={cn(iconButtonClass, 'hover:text-destructive')}
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {description && (
        <motion.div
          id={panelId}
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="whitespace-pre-line ps-12 pt-3 text-xs leading-relaxed text-muted-foreground sm:ps-[60px] sm:text-sm">
            {description}
          </p>
        </motion.div>
      )}
    </article>
  );
};
