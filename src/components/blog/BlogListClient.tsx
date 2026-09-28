'use client';

import BlurFade from '@/components/magicui/blur-fade';
import { Input } from '@/components/ui/input';
import type { IBlog } from '@/types';
import { formatYearMonthLocal } from '@/lib/utils';
import { FileText, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface BlogListClientProps {
  posts: IBlog[];
  locale: string;
}

/**
 * Client-side blog list: instant search filter over title/summary plus
 * an empty state when nothing matches.
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
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="h-10 ps-9"
          />
        </div>
      )}

      {list.map((post, id) => (
        <BlurFade key={post.slug} delay={0.04 + id * 0.05} inView>
          <Link
            className="group block rounded-xl border bg-card p-5 transition-all hover:border-foreground/40 hover:shadow-sm"
            href={`/${locale}/blog/${post.slug}`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold leading-snug tracking-tight group-hover:underline">{post.title}</h2>
                <span className="shrink-0 text-xs text-muted-foreground">{formatYearMonthLocal(post.createdAt, lang)}</span>
              </div>
              {post.summary && <p className="line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>}
            </div>
          </Link>
        </BlurFade>
      ))}

      {list.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{query ? t('noResults') : t('empty')}</p>
        </div>
      )}
    </div>
  );
}
