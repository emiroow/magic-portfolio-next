import BlogListClient from '@/components/blog/BlogListClient';
import { JsonLd } from '@/components/JsonLd';
import BlurFade from '@/components/magicui/blur-fade';
import Navbar from '@/components/navbar';
import { routing } from '@/i18n/routing';
import type { IBlog } from '@/interface/IBlog';
import { absoluteUrl } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const site = process.env.NEXT_PUBLIC_SITE_URL as string;
  const url = `${site}/${locale}/blog`;

  const title = locale === 'fa' ? 'وبلاگ | مقالات برنامه‌نویسی' : 'Blog | Programming Articles';

  const description =
    locale === 'fa'
      ? 'لیست مقالات برنامه‌نویسی در حوزه فرانت‌اند، React، Next.js، تجربه‌های کاری و آموزش‌ها'
      : 'List of programming articles about front-end, React, Next.js, case studies and tutorials.';

  const ogImage = `${site}/og/blog-list.png`; // اگر تصویر پیش‌فرض داری

  return {
    metadataBase: new URL(site),
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      locale,
      type: 'website',
      siteName: title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const base = absoluteUrl('') || '';
  const res = await fetch(`${base}/api/${locale}/blog`, { cache: 'no-store' });
  const posts = (await res.json()) as IBlog[];

  const t = await getTranslations({ locale, namespace: 'blogPage' });

  return (
    <section>
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: t('title'),
          url: `${SITE_URL}/${locale}/blog`,
          inLanguage: locale,
          headline: locale === 'fa' ? 'لیست مقالات برنامه‌نویسی' : 'Programming Blog Articles',
          description:
            locale === 'fa'
              ? 'مجموعه‌ای از مقالات تخصصی در حوزه توسعه وب، فرانت‌اند و بک اند .'
              : 'A collection of articles about front-end, back-end development.',
        }}
      />
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: locale === 'fa' ? 'صفحه اصلی' : 'Home',
              item: `${SITE_URL}/${locale}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: locale === 'fa' ? 'بلاگ' : 'Blog',
              item: `${SITE_URL}/${locale}/blog`,
            },
          ],
        }}
      />
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-2xl mb-8 tracking-tighter">{t('title')}</h1>
          <Link href={`/${locale}/blog/rss.xml`} className="text-xs text-muted-foreground hover:underline" prefetch={false}>
            RSS
          </Link>
        </div>
      </BlurFade>
      <BlogListClient posts={posts} locale={locale} />
      <Navbar socials={[]} />
    </section>
  );
}
