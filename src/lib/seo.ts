// Shared SEO constants and helpers used across layouts/pages.
// We avoid falling back to localhost in production so bad canonical/OG URLs don't get shipped.
const rawSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const fallbackSite = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined;
export const site = (rawSite || fallbackSite || '').replace(/\/$/, '') || undefined;

export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE || 'Portfolio';
export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Welcome to my personal portfolio website';
export const AUTHOR = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Amir';
export const TWITTER = process.env.NEXT_PUBLIC_TWITTER_HANDLE || '';

// Use a predictable, absolute OG image.
const defaultOg = site ? `${site}/avatar/avatarImage.jpg` : '/avatar/avatarImage.jpg';
export const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || defaultOg;

export function requireSite(message?: string) {
  if (!site) {
    throw new Error(message || 'NEXT_PUBLIC_SITE_URL must be defined for SEO assets.');
  }
  return site;
}

export function metadataBase() {
  return site ? new URL(site) : undefined;
}

export function absoluteUrl(path = '/') {
  const p = path.startsWith('/') ? path : `/${path}`;
  return site ? `${site}${p}`.replace(/\/$/, '') : undefined;
}

export function getCanonical(path = '/', locale?: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (locale) return absoluteUrl(`/${locale}${p}`) ?? `/${locale}${p}`;
  return absoluteUrl(p) ?? p;
}

export function getAlternates(path = '/') {
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'fa';
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  const build = (locale: string) => absoluteUrl(`/${locale}${cleaned}`)?.replace(/\/$/, '');

  return {
    canonical: getCanonical(path),
    languages: {
      en: build('en'),
      fa: build('fa'),
      'x-default': build(defaultLocale),
    },
  };
}

export function absoluteImage(url?: string) {
  if (!url) return OG_IMAGE;

  try {
    const u = new URL(url);
    return u.href;
  } catch {
    const prefixed = url.startsWith('/') ? url : `/${url}`;
    return absoluteUrl(prefixed) ?? prefixed;
  }
}

export default {
  site,
  SITE_TITLE,
  SITE_DESCRIPTION,
  AUTHOR,
  TWITTER,
  OG_IMAGE,
  getCanonical,
  getAlternates,
  absoluteImage,
  requireSite,
  metadataBase,
  absoluteUrl,
};
