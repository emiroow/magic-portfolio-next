'use client';

import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import React from 'react';

type LanguageToggleProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'>;

/**
 * Switches to the same page in the other locale while preserving the
 * current path. (Named `ThemeToggle` historically; it controls language.)
 */
const ThemeToggle = React.forwardRef<HTMLAnchorElement, LanguageToggleProps>(({ className, ...props }, ref) => {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const targetLocale = locale === 'fa' ? 'en' : 'fa';

  // Strip the current locale prefix so the target Link re-adds its own.
  const pathWithoutLocale = pathname.replace(/^\/(fa|en)/, '');
  const href = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

  return (
    <Link
      ref={ref}
      {...props}
      href={href}
      locale={targetLocale}
      className={cn('text-xs font-semibold', className)}
      aria-label={`Switch to ${targetLocale.toUpperCase()}`}
    >
      {targetLocale.toUpperCase()}
    </Link>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
