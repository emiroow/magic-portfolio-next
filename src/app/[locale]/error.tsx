'use client'; // Error boundaries must be Client Components

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Locale-level error boundary: catches render/data failures for every
 * page under `/{locale}` and offers retry + home actions.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('ErrorPage');
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale || 'en';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-muted-foreground" aria-hidden />
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t('description')}</p>
      <div className="mt-2 flex items-center gap-3">
        <Button variant="outline" onClick={reset}>
          {t('tryAgain')}
        </Button>
        <Button asChild>
          <a href={`/${locale}`}>{t('goHome')}</a>
        </Button>
      </div>
    </main>
  );
}
