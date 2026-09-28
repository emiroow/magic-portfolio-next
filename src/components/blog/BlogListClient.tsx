'use client';

import BlurFade from '@/components/magicui/blur-fade';
import { Stack } from '@/components/sections/stack';
import { Input } from '@/components/ui/input';
import type { IBlog } from '@/types';
import { formatYearMonthLocal } from '@/lib/utils';
import { FileText, Search, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface BlogListClientProps {
  posts: IBlog[];
  locale: string;
}

/**
 * Client-side blog list: instant search over title/summary, rows sharing the
 * divided-surface language of the home page timelines.
 */
export default function BlogListClient({ posts, locale }: BlogListClientProps) {
  const t = useTranslations('blogPage');
  const currentLocale = useLocale();
  const lang: 'fa' | 'en' = currentLocale === 'fa' ? 'fa' : 'en';
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    if (!query.trim()) return posts;
    const needle = query.trim().toLowerCase();
    return posts.filter(p => (p.title || '').toLowerCase().includes(needle) || (p.summary || '').toLowerCase().includes(needle));
  }, [posts, query]);

  return (
    <div className="flex flex-col gap-4">
      {posts.length > 0 && (
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="h-10 rounded-full pe-10 ps-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('clearSearch')}
              className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      )}

      {list.length > 0 && (
        <Stack>
          {list.map((post, id) => (
            <BlurFade key={post.slug} delay={0.04 + id * 0.04} inView>
              <Link href={`/${locale}/blog/${post.slug}`} className="group block p-4 transition-colors hover:bg-muted/40 sm:px-5 sm:py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="min-w-0 text-sm font-semibold leading-snug transition-colors group-hover:underline sm:text-base">
                    {post.title}
                  </h2>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {formatYearMonthLocal(post.createdAt, lang)}
                  </span>
                </div>
                {post.summary && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{post.summary}</p>
                )}
              </Link>
            </BlurFade>
          ))}
        </Stack>
      )}

      {list.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full border" aria-hidden>
            <FileText className="size-5 text-muted-foreground" />
          </span>
          <p className="text-sm text-muted-foreground">{query ? t('noResults') : t('empty')}</p>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              {t('clearSearch')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
