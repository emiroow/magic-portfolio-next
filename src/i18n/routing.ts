import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

/** Locale routing: English default at `/`, Persian at `/fa` (auto-redirected via Accept-Language). */
export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Navigation wrappers that respect the routing config.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export type AppLocale = (typeof routing.locales)[number];
