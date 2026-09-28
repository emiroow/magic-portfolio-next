import { routing } from '@/i18n/routing';

/**
 * Shared SEO constants and helpers.
 * `NEXT_PUBLIC_SITE_URL` drives canonical/OG URLs; in development we fall
 * back to `http://localhost:3000`, but never in production so broken
 * absolute URLs can't be shipped accidentally.
 */

const rawSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackSite = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined;

/** Canonical site origin without a trailing slash (may be undefined). */
export const site = (rawSite || fallbackSite || '').replace(/\/$/, '') || undefined;

/** Twitter/X handle including the leading `@` (optional). */
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '';

/** Dynamic Open Graph image endpoint (`app/api/og/route.tsx`). */
export const OG_IMAGE_URL = site ? `${site}/api/og` : '/api/og';

/** Turn a relative path into an absolute site URL (or echo it back). */
export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return site ? `${site}${p}` : p;
}

/** Canonical URL for a path within a specific locale. */
export function localeUrl(locale: string, path = '') {
  const p = path && !path.startsWith('/') ? `/${path}` : path;
  return absoluteUrl(`/${locale}${p}`);
}

/**
 * hreflang alternates for a localized path, e.g. `/blog` produces
 * `{ en: https://site/en/blog, fa: https://site/fa/blog, x-default: ... }`.
 */
export function languageAlternates(path = '') {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localeUrl(locale, path);
  }
  languages['x-default'] = localeUrl(routing.defaultLocale, path);
  return languages;
}
