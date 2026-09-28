import { getBlogList } from '@/lib/data';
import { site } from '@/lib/seo';
import type { AppLocale } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

/** Escape text for XML feed content. */
function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'fa' && locale !== 'en') {
    return new NextResponse('Not Found', { status: 404 });
  }

  const base = site ?? '';
  const posts = await getBlogList(locale as AppLocale);

  const items = posts
    .map(post => {
      const link = `${base}/${locale}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.createdAt ?? Date.now()).toUTCString()}</pubDate>
      ${post.summary ? `<description><![CDATA[${post.summary}]]></description>` : ''}
    </item>`;
    })
    .join('\n');

  const title = locale === 'fa' ? 'وبلاگ' : 'Blog';
  const description = locale === 'fa' ? 'آخرین مقالات وبلاگ' : 'Latest blog posts';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${base}/${locale}/blog</link>
    <description>${description}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
    },
  });
}
