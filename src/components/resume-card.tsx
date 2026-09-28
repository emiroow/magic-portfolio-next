'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight, PencilLine, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface ResumeCardProps {
  logoUrl?: string;
  altText?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  /** Dashboard mode: expansion is controlled externally. */
  isExpanded?: boolean;
  description?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: () => void;
}

/**
 * Timeline entry card shared by the public site (work/education) and
 * the dashboard list views. Expands to reveal the description when one
 * exists; direction-agnostic via CSS logical properties.
 */
export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  onDelete,
  onEdit,
  isExpanded: isExpandedOuter,
  onToggle,
}: ResumeCardProps) => {
  const [isExpandedInner, setIsExpandedInner] = React.useState(false);
  const isExpanded = isExpandedOuter || isExpandedInner;
  const locale = useLocale();
  const t = useTranslations('dashboard');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (description) {
      e.preventDefault();
      if (isExpandedOuter) onToggle?.();
      else setIsExpandedInner(!isExpandedInner);
    }
  };

  return (
    <Card className="flex w-full items-center gap-2 p-3 transition-colors hover:border-foreground/30 sm:p-4">
      <Link href={href || '#'} className="flex w-full items-center" onClick={handleClick}>
        {logoUrl && (
          <div className="flex-none">
            <Avatar className="size-10 border sm:size-12">
              <AvatarImage src={logoUrl} alt={altText ?? ''} className="object-contain" />
              <AvatarFallback>{altText?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="group ms-3 flex grow flex-col items-start">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between gap-x-2 text-base">
              <h3
                className={cn(
                  'inline-flex items-center justify-center gap-2 text-xs font-semibold leading-none sm:text-sm',
                  !description && 'group-hover:underline'
                )}
              >
                {title}
                {badges && badges.length > 0 && (
                  <span className="inline-flex gap-1">
                    {badges.map((badge, index) => (
                      <Badge variant="secondary" className="align-middle text-xs" key={index}>
                        {badge}
                      </Badge>
                    ))}
                  </span>
                )}
                {description && (
                  <ChevronRight
                    className={cn(
                      'size-4 transform text-muted-foreground opacity-0 transition-all duration-300 ease-out group-hover:opacity-100',
                      isExpanded ? 'rotate-90' : locale === 'fa' ? 'rotate-180' : 'rotate-0'
                    )}
                  />
                )}
              </h3>
              <div className="ms-3 text-[11px] font-normal text-muted-foreground sm:text-xs">{period}</div>
            </div>
            {subtitle && <div className="mt-1 text-xs">{subtitle}</div>}
          </CardHeader>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
            >
              {description}
            </motion.div>
          )}
        </div>
      </Link>

      {(onEdit || onDelete) && (
        <div className="z-50 flex flex-col gap-2">
          {onEdit && (
            <button type="button" className="rounded p-1 transition-colors hover:text-primary" onClick={onEdit} aria-label={t('edit')}>
              <PencilLine className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
          {onDelete && (
            <button type="button" className="rounded p-1 transition-colors" onClick={onDelete} aria-label={t('delete')}>
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
