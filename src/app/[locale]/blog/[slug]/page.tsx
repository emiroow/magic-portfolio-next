import type { IBlog } from '@/interface/IBlog';
import { formatYearMonthLocal } from '@/lib/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

import { JsonLd } from '@/components/JsonLd';
import { routing } from '@/i18n/routing';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';

// Dynamic route; we fetch data at request time from API/DB

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata | undefined> {
  const { locale, slug } = await params;

  // Fetch post from API / DB
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
  const res = await fetch(`${base}/api/${locale}/blog/${slug}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    return {
      title: locale === 'fa' ? 'مقاله یافت نشد' : 'Article not found',
    };
  }

  const post = (await res.json());

  const site = process.env.NEXT_PUBLIC_SITE_URL as string;
  const url = `${site}/${locale}/blog/${slug}`;
  const ogImage = post.ogImage || `${site}/api/og/blog?slug=${slug}`;
  const title = post.title;
  const description = post.excerpt || post.description || title;

  return {
    metadataBase: new URL(site),
    title,
    description,
    keywords: post.tags || [],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: 'article',
      locale,
      siteName: 'Blog',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.authorName],
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
      site: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
  const res = await fetch(`${base}/api/${locale}/blog/${slug}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }
  const post = (await res.json()) ;
  // Fetch all posts in same locale to compute prev/next and related
  const allRes = await fetch(`${base}/api/${locale}/blog`, {
    cache: 'no-store',
  });

  const all = (allRes.ok ? ((await allRes.json()) as IBlog[]) : []).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  const index = all.findIndex(p => p.slug === post.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <section id="blog">
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.createdAt,
          dateModified: post.updatedAt || post.createdAt,
          description: post.summary,
          image: `${SITE_URL}/og?title=${encodeURIComponent(post.title)}`,
          url: `${SITE_URL}/${locale}/blog/${post.slug}`,
          author: { '@type': 'Person' },
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
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: `${SITE_URL}/${locale}/blog/${post.slug}`,
            },
          ],
        }}
      />

      <Link href={`/${locale}/blog`} className="sm:hidden absolute top-5 left-4">
        <IoIosArrowBack className="text-2xl" />
      </Link>

      <h1 className="title font-semibold text-2xl tracking-tighter max-w-[650px]">{post.title}</h1>
      <div className="flex flex-col gap-1 mt-2 mb-4 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-neutral-600 dark:text-neutral-400">{formatYearMonthLocal(post.createdAt || '', locale as any)}</p>
        </Suspense>
      </div>

      <h2>{post.summary}</h2>
      <article className="prose dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}>
          {post.content || ''}
        </ReactMarkdown>
      </article>

      {(prev || next) && (
        <nav className="mt-10 flex items-center justify-between text-sm">
          {next ? (
            <Link href={`/${locale}/blog/${next.slug}`} className="hover:underline">
              → {next.title}
            </Link>
          ) : (
            <span />
          )}
          {prev ? (
            <Link href={`/${locale}/blog/${prev.slug}`} className="hover:underline">
              {prev.title} ←
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </section>
  );
}
