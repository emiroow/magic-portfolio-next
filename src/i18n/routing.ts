import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing.
 * English is the default (served at `/`); Persian is served at `/fa`.
 * next-intl's locale negotiation redirects Persian-preferring visitors
 * from `/` to `/fa` automatically based on the `Accept-Language` header.
 */
export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export type AppLocale = (typeof routing.locales)[number];
