import { JsonLd } from '@/components/JsonLd';
import BlurFade from '@/components/magicui/blur-fade';
import Navbar from '@/components/navbar';
import { eyebrowClass } from '@/components/sections/section-header';
import { getBlogBySlug, getBlogList, getProfile, getSocials } from '@/lib/data';
import { OG_IMAGE_URL, languageAlternates, localeUrl } from '@/lib/seo';
import { cn, formatYearMonthLocal, readingTime } from '@/lib/utils';
import type { AppLocale } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <main>
      <article>
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
            className="-ms-1 mb-6 inline-flex items-center gap-1.5 rounded-full px-1 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 rtl:-scale-x-100" aria-hidden />
            {t('backToBlog')}
          </Link>
        </BlurFade>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <time dateTime={post.createdAt} className={eyebrowClass}>
              {formatYearMonthLocal(post.createdAt, asLocale(locale))}
            </time>
            {minutes > 0 && (
              <>
                <span aria-hidden className="text-border">
                  |
                </span>
                <span className="text-[11px] tabular-nums">{t('readingTime', { minutes })}</span>
              </>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-bold leading-tight ltr:tracking-tight sm:text-3xl md:text-4xl">{post.title}</h1>
          {post.summary && (
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground rtl:leading-[1.9] sm:text-base">{post.summary}</p>
          )}
          <div aria-hidden className="rule-fade mt-6" />
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
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-sm shadow-sm transition-colors hover:border-foreground/40"
              >
                <ArrowLeft
                  className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className={cn(eyebrowClass, 'block')}>{t('previous')}</span>
                  <span className="mt-1 line-clamp-1 block font-medium">{prev.title}</span>
                </span>
              </Link>
            )}
            {next && (
              <Link
                href={`/${locale}/blog/${next.slug}`}
                className={cn(
                  'group flex items-center justify-end gap-3 rounded-xl border bg-card p-4 text-end text-sm shadow-sm transition-colors hover:border-foreground/40',
                  !prev && 'sm:col-start-2'
                )}
              >
                <span className="min-w-0">
                  <span className={cn(eyebrowClass, 'block')}>{t('next')}</span>
                  <span className="mt-1 line-clamp-1 block font-medium">{next.title}</span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground rtl:-scale-x-100"
                  aria-hidden
                />
              </Link>
            )}
          </nav>
        )}

        <Navbar socials={socials} />
      </article>
    </main>
  );
}
