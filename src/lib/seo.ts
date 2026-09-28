import { routing } from '@/i18n/routing';
import type { AppLocale, IProfile } from '@/types';

/**
 * Shared SEO constants and helpers.
 * `NEXT_PUBLIC_SITE_URL` drives canonical/OG URLs; in development we fall
 * back to `http://localhost:3000`, but never in production so broken
 * absolute URLs can't be shipped accidentally.
 */

/** Localized site suffix appended to every brand title. */
const SITE_SUFFIX: Record<AppLocale, string> = {
  en: 'Portfolio',
  fa: 'سایت شخصی',
};

/** Localized fallback meta description when the profile has no summary. */
export const SITE_DESCRIPTION: Record<AppLocale, string> = {
  en: 'Personal developer portfolio: projects, experience, skills and blog.',
  fa: 'سایت شخصی توسعه‌دهنده: پروژه‌ها، تجربیات، مهارت‌ها و وبلاگ.',
};

/**
 * Canonical brand title: `Name | Job Title | <suffix>`, derived purely from
 * the profile document (the dashboard is the single source of truth — no env
 * fallbacks). The suffix is localized: `Portfolio` in English, `سایت شخصی`
 * in Persian. When the profile is unavailable, only the localized suffix
 * remains.
 */
export function brandedTitle(profile: IProfile | null, locale: AppLocale = 'en'): string {
  const name = profile?.fullName?.trim() || profile?.name?.trim();
  const job = profile?.jobTitle?.trim();

  return [name, job, SITE_SUFFIX[locale]].filter(Boolean).join(' | ');
}

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
