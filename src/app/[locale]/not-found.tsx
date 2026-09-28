import BlurFade from '@/components/magicui/blur-fade';
import { Button } from '@/components/ui/button';
import { Compass, Home } from 'lucide-react';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'NotFoundPage' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

/** Minimal monochrome 404 page shared by localized and unknown routes. */
export default async function NotFoundPage() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'NotFoundPage' });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <BlurFade>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Error 404</p>
      </BlurFade>
      <BlurFade delay={0.08}>
        <h1 className="mt-2 text-3xl font-bold tracking-tighter sm:text-4xl">{t('title')}</h1>
      </BlurFade>
      <BlurFade delay={0.16}>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">{t('description')}</p>
      </BlurFade>
      <BlurFade delay={0.24}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={`/${locale}`}>
              <Home className="me-2 h-4 w-4" />
              {t('goHome')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/blog`}>
              <Compass className="me-2 h-4 w-4" />
              {t('browse')}
            </Link>
          </Button>
        </div>
      </BlurFade>
    </main>
  );
}
