import BlogListClient from '@/components/blog/BlogListClient';
import { JsonLd } from '@/components/JsonLd';
import BlurFade from '@/components/magicui/blur-fade';
import Navbar from '@/components/navbar';
import { getBlogList, getSocials } from '@/lib/data';
import { OG_IMAGE_URL, languageAlternates, localeUrl } from '@/lib/seo';
import type { AppLocale } from '@/types';
import { Rss } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

/** Blog listing refreshes every 5 minutes. */
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

function asLocale(locale: string): AppLocale {
  return locale === 'fa' ? 'fa' : 'en';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blogPage' });

  const title = t('title');
  const description = t('description');
  const url = localeUrl(locale, '/blog');

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates('/blog'),
      types: { 'application/rss+xml': localeUrl(locale, '/blog/rss.xml') },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      images: [{ url: `${OG_IMAGE_URL}?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const lang = asLocale(locale);

  const [t, posts, socials] = await Promise.all([
    getTranslations({ locale, namespace: 'blogPage' }),
    getBlogList(lang),
    getSocials(lang),
  ]);
  const url = localeUrl(locale, '/blog');

  return (
    <section aria-labelledby="blog-heading" className="pb-24">
      {/* Structured data: blog + breadcrumbs */}
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: t('title'),
          description: t('description'),
          url,
          inLanguage: locale,
        }}
      />

      <BlurFade delay={0.04}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{t('eyebrow')}</p>
            <h1 id="blog-heading" className="mt-1 text-2xl font-bold tracking-tighter sm:text-3xl">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t('description')}</p>
          </div>
          <Link
            href={`/${locale}/blog/rss.xml`}
            className="shrink-0 rounded-full border p-2 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            aria-label={t('rss')}
            prefetch={false}
          >
            <Rss className="h-4 w-4" />
          </Link>
        </div>
      </BlurFade>

      <BlogListClient posts={posts} locale={locale} />

      <Navbar socials={socials} />
    </section>
  );
}
