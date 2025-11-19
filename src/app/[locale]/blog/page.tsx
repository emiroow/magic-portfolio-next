import BlogListClient from '@/components/blog/BlogListClient';
import BlurFade from '@/components/magicui/blur-fade';
import Navbar from '@/components/navbar';
import { routing } from '@/i18n/routing';
import type { IBlog } from '@/interface/IBlog';
import { absoluteUrl, getAlternates, getCanonical, metadataBase } from '@/lib/seo';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'blogPage',
  });
  const title = t('title');
  const description = t('description');
  const slugBase = `/${params.locale}/blog`;
  const canonical = getCanonical('/blog', params.locale);
  const alternates = getAlternates('/blog');
  alternates.canonical = canonical;
  return {
    metadataBase: metadataBase(),
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) notFound();
  const base = absoluteUrl('') || '';
  const res = await fetch(`${base}/api/${locale}/blog`, { cache: 'no-store' });
  const posts = (await res.json()) as IBlog[];

  const t = await getTranslations({ locale, namespace: 'blogPage' });

  return (
    <section>
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
