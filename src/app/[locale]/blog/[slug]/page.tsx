import { JsonLd } from '@/components/JsonLd';
import BlurFade from '@/components/magicui/blur-fade';
import Navbar from '@/components/navbar';
import { getBlogBySlug, getBlogList, getProfile, getSocials } from '@/lib/data';
import { OG_IMAGE_URL, languageAlternates, localeUrl } from '@/lib/seo';
import { formatYearMonthLocal, readingTime } from '@/lib/utils';
import type { AppLocale } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

type Props = { params: Promise<{ locale: string; slug: string }> };

function asLocale(locale: string): AppLocale {
  return locale === 'fa' ? 'fa' : 'en';
}

/** Resolve params once; reuse for metadata and rendering. */
async function loadPost(params: Props['params']) {
  const { locale, slug } = await params;
  const post = await getBlogBySlug(asLocale(locale), decodeURIComponent(slug));
  return { locale, post };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, post } = await loadPost(params);

  if (!post) {
    // Localized titles without a DB round-trip on missing posts.
    const t = await getTranslations({ locale, namespace: 'blogPost' });
    return { title: t('notFound'), robots: { index: false, follow: false } };
  }

  const t = await getTranslations({ locale, namespace: 'blogPost' });
  const url = localeUrl(locale, `/blog/${post.slug}`);
  const description = post.summary || t('defaultDescription');
  const ogImage = `${OG_IMAGE_URL}?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, post } = await loadPost(params);
  if (!post) notFound();

  const [t, profile, all, socials] = await Promise.all([
    getTranslations({ locale, namespace: 'blogPost' }),
    getProfile(asLocale(locale)),
    getBlogList(asLocale(locale)),
    getSocials(asLocale(locale)),
  ]);

  // Previous/next computed from the recency-sorted list.
  const index = all.findIndex(p => p.slug === post.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  const minutes = readingTime(post.content);

  return (
    <article className="pb-16">
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: { '@type': 'WebPage', '@id': localeUrl(locale, `/blog/${post.slug}`) },
          headline: post.title,
          description: post.summary || undefined,
          datePublished: post.createdAt,
          dateModified: post.updatedAt || post.createdAt,
          inLanguage: locale,
          author: {
            '@type': 'Person',
            name: profile?.fullName || profile?.name || undefined,
          },
        }}
      />

      <BlurFade delay={0.04}>
        <Link
          href={`/${locale}/blog`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {locale === 'fa' ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {t('backToBlog')}
        </Link>
      </BlurFade>

      <header className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <time dateTime={post.createdAt}>{formatYearMonthLocal(post.createdAt, asLocale(locale))}</time>
          {minutes > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>
                {t('readingTime', { minutes })}
              </span>
            </>
          )}
        </div>
        {post.summary && <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{post.summary}</p>}
      </header>

      <BlurFade delay={0.1}>
        <div className="prose-article">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}>
            {post.content || ''}
          </ReactMarkdown>
        </div>
      </BlurFade>

      {(prev || next) && (
        <nav aria-label={t('pagination')} className="mt-12 grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev && (
            <Link
              href={`/${locale}/blog/${prev.slug}`}
              className="group flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:border-foreground"
            >
              <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <span className="line-clamp-1">{prev.title}</span>
            </Link>
          )}
          {next && (
            <Link
              href={`/${locale}/blog/${next.slug}`}
              className={`group flex items-center justify-end gap-2 rounded-lg border p-3 text-sm transition-colors hover:border-foreground ${prev ? '' : 'sm:col-start-2'}`}
            >
              <span className="line-clamp-1">{next.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            </Link>
          )}
        </nav>
      )}

      <Navbar socials={socials} />
    </article>
  );
}
