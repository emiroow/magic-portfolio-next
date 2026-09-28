import BlogListClient from '@/components/blog/BlogListClient';
import { JsonLd } from '@/components/JsonLd';
import Navbar from '@/components/navbar';
import { SectionHeader } from '@/components/sections/section-header';
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
    <main>
      <section aria-labelledby="blog-heading">
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

        <SectionHeader
          as="h1"
          id="blog-heading"
          label={t('eyebrow')}
          title={t('title')}
          description={t('description')}
          meta={posts.length ? t('count', { count: posts.length }) : undefined}
          action={
            <Link
              href={`/${locale}/blog/rss.xml`}
              prefetch={false}
              aria-label={t('rss')}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <Rss className="size-4" aria-hidden />
            </Link>
          }
          delay={0.04}
        />

        <BlogListClient posts={posts} locale={locale} />

        <Navbar socials={socials} />
      </section>
    </main>
  );
}
