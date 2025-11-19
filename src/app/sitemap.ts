import { connectDB } from '@/config/dbConnection';
import { routing } from '@/i18n/routing';
import type { IBlog } from '@/interface/IBlog';
import { blogModel } from '@/models/blog';
import type { MetadataRoute } from 'next';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
type SupportedLocale = (typeof routing)['locales'][number];

type UrlBuilder = ReturnType<typeof createUrlBuilder>;

interface BlogSnapshot {
  slug: string;
  locale: SupportedLocale;
  lastModified: Date;
}

const STATIC_LOCALE_ROUTES: ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}> = [
  { path: '', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/auth', priority: 0.2, changeFrequency: 'yearly' },
];

const BLOG_INDEX_PRIORITY = 0.75;
const BLOG_POST_PRIORITY = 0.6;
const BLOG_FEED_PRIORITY = 0.4;

/**
 * Builds a localized, content-aware sitemap for both static and dynamic routes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (!baseUrl) {
    console.warn('sitemap: NEXT_PUBLIC_SITE_URL is not defined; returning an empty sitemap.');
    return [];
  }

  const builder = createUrlBuilder(baseUrl);
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [buildDefaultLocaleEntry(builder, now), ...buildStaticLocalizedEntries(builder, now)];

  entries.push(...(await buildBlogEntries(builder, now)));

  return entries;
}

function buildDefaultLocaleEntry(builder: UrlBuilder, lastModified: Date): MetadataRoute.Sitemap[number] {
  return {
    url: builder.absolute(),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: { languages: builder.languageAlternates('', routing.locales) },
  };
}

function buildStaticLocalizedEntries(builder: UrlBuilder, lastModified: Date): MetadataRoute.Sitemap {
  const localizedEntries: MetadataRoute.Sitemap = [];
  const locales = routing.locales;

  for (const { path, changeFrequency, priority } of STATIC_LOCALE_ROUTES) {
    for (const locale of locales) {
      localizedEntries.push({
        url: builder.absolute(locale, path),
        lastModified,
        changeFrequency,
        priority,
        alternates: { languages: builder.languageAlternates(path, locales) },
      });
    }
  }

  return localizedEntries;
}

async function buildBlogEntries(builder: UrlBuilder, fallbackDate: Date): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB();
    const docs = (await blogModel.find({}, 'slug lang updatedAt createdAt', { lean: true }).sort({ updatedAt: -1 })) as unknown as Array<
      Pick<IBlog, 'slug' | 'lang' | 'updatedAt' | 'createdAt'>
    >;

    return composeBlogEntries(builder, docs, fallbackDate);
  } catch (error) {
    console.error('sitemap: Failed to load blog entries', error);
    return composeBlogEntries(builder, [], fallbackDate);
  }
}

function composeBlogEntries(
  builder: UrlBuilder,
  docs: Array<Pick<IBlog, 'slug' | 'lang' | 'updatedAt' | 'createdAt'>>,
  fallbackDate: Date
): MetadataRoute.Sitemap {
  const latestByLocale = new Map<SupportedLocale, Date>();
  const postsBySlug = new Map<string, Map<SupportedLocale, BlogSnapshot>>();

  for (const doc of docs) {
    if (!doc.slug || !doc.lang) continue;
    if (!routing.locales.includes(doc.lang as SupportedLocale)) continue;

    const locale = doc.lang as SupportedLocale;
    const lastModified = toDate(doc.updatedAt) ?? toDate(doc.createdAt) ?? fallbackDate;

    const currentLatest = latestByLocale.get(locale);
    if (!currentLatest || lastModified > currentLatest) {
      latestByLocale.set(locale, lastModified);
    }

    const localizedMap = postsBySlug.get(doc.slug) ?? new Map<SupportedLocale, BlogSnapshot>();
    localizedMap.set(locale, { slug: doc.slug, locale, lastModified });
    postsBySlug.set(doc.slug, localizedMap);
  }

  return [
    ...buildBlogIndexEntries(builder, latestByLocale, fallbackDate),
    ...buildBlogFeedEntries(builder, latestByLocale, fallbackDate),
    ...buildBlogPostEntries(builder, postsBySlug, fallbackDate),
  ];
}

function buildBlogIndexEntries(builder: UrlBuilder, latestByLocale: Map<SupportedLocale, Date>, fallbackDate: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const locales = routing.locales;

  for (const locale of locales) {
    const lastModified = latestByLocale.get(locale as SupportedLocale) ?? fallbackDate;
    entries.push({
      url: builder.absolute(locale, '/blog'),
      lastModified,
      changeFrequency: getChangeFrequency(lastModified),
      priority: BLOG_INDEX_PRIORITY,
      alternates: { languages: builder.languageAlternates('/blog', locales) },
    });
  }

  return entries;
}

function buildBlogFeedEntries(builder: UrlBuilder, latestByLocale: Map<SupportedLocale, Date>, fallbackDate: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const locales = routing.locales;

  for (const locale of locales) {
    const lastModified = latestByLocale.get(locale as SupportedLocale) ?? fallbackDate;
    entries.push({
      url: builder.absolute(locale, '/blog/rss.xml'),
      lastModified,
      changeFrequency: getChangeFrequency(lastModified),
      priority: BLOG_FEED_PRIORITY,
      alternates: { languages: builder.languageAlternates('/blog/rss.xml', locales) },
    });
  }

  return entries;
}

function buildBlogPostEntries(
  builder: UrlBuilder,
  postsBySlug: Map<string, Map<SupportedLocale, BlogSnapshot>>,
  fallbackDate: Date
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  postsBySlug.forEach((localized, slug) => {
    const locales = Array.from(localized.keys()) as SupportedLocale[];
    if (!locales.length) return;

    for (const locale of locales) {
      const snapshot = localized.get(locale);
      const lastModified = snapshot?.lastModified ?? fallbackDate;

      entries.push({
        url: builder.absolute(locale, `/blog/${slug}`),
        lastModified,
        changeFrequency: getChangeFrequency(lastModified),
        priority: BLOG_POST_PRIORITY,
        alternates: { languages: builder.languageAlternates(`/blog/${slug}`, locales) },
      });
    }
  });

  return entries;
}

function createUrlBuilder(baseUrl: string) {
  const origin = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const defaultLocale = routing.defaultLocale ?? routing.locales[0];

  const normalize = (path = ''): string => {
    if (!path || path === '/') return '';
    return path.replace(/^\/+/, '');
  };

  const absolute = (locale?: string, path = ''): string => {
    const segments: string[] = [];
    // Do not prefix the default locale so the site's root stays canonical
    // (e.g. `https://example.com` instead of `https://example.com/fa`).
    if (locale && locale !== defaultLocale) segments.push(locale);
    const normalizedPath = normalize(path);
    if (normalizedPath) segments.push(normalizedPath);
    const relative = segments.join('/');
    if (!relative) return baseUrl;

    const url = new URL(relative, origin).toString();
    return url.endsWith('/') ? url.slice(0, -1) : url;
  };

  const languageAlternates = (path: string, localesInput: Iterable<string>) => {
    const languages: Record<string, string> = {};
    const locales = Array.from(new Set(localesInput));

    for (const locale of locales) {
      languages[locale] = absolute(locale, path);
    }

    const fallbackLocale = locales.includes(defaultLocale) ? defaultLocale : locales[0];
    if (fallbackLocale) {
      languages['x-default'] = absolute(fallbackLocale, path);
    }

    return languages;
  };

  return { absolute, languageAlternates };
}

function toDate(value?: string | Date | null): Date | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getChangeFrequency(lastModified: Date): ChangeFrequency {
  const days = Math.max(0, Math.floor((Date.now() - lastModified.getTime()) / 86_400_000));
  if (days <= 7) return 'daily';
  if (days <= 30) return 'weekly';
  if (days <= 120) return 'monthly';
  return 'yearly';
}
