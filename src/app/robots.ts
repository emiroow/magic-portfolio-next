import type { MetadataRoute } from 'next';

// Environment-aware robots generator tailored for this project.
// - In non-production (preview/development) it disallows all crawlers.
// - In production it exposes a conservative, bot-friendly policy:
//   * allows public pages and locale roots
//   * disallows private/admin/dashboard/API/_next/static paths
//   * provides sitemap when NEXT_PUBLIC_SITE_URL is set
export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

  // Production rules: allow public site and language roots, block internal routes.
  const commonAllow = ['/', '/en', '/fa', '/projects', '/blog', '/about', '/contact'];
  const commonDisallow = ['/api', '/api/*', '/dashboard', '/dashboard/*', '/admin', '/_next', '/_next/*', '/static', '/static/*'];

  return {
    // Specify separate rules for major crawlers and a fallback '*' rule.
    rules: [
      {
        userAgent: 'Googlebot',
        allow: commonAllow,
        disallow: commonDisallow,
        // Google ignores crawl-delay; we omit it specifically for Google.
      },
      {
        userAgent: 'Bingbot',
        allow: commonAllow,
        disallow: commonDisallow,
        // Bing respects crawl-delay; set a gentle value to reduce server load.
        crawlDelay: 5,
      },
      {
        userAgent: '*',
        allow: commonAllow,
        disallow: commonDisallow,
        // A small crawl delay for generic bots (not Google).
        crawlDelay: 10,
      },
    ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
