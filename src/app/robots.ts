import type { MetadataRoute } from 'next';

/**
 * Crawler policy:
 * - Production: index public pages; block API, dashboard and auth.
 * - Preview/development: disallow everything so staging never ranks.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');

  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/dashboard', '/auth'],
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
    host: base,
  };
}
