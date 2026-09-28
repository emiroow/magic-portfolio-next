import { routing } from '@/i18n/routing';
import { estedad, roboto } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import MainProvider from '@/providers/mainProvider';
import { notFound } from 'next/navigation';

/**
 * Locale layout: validates `[locale]` and applies direction/font on a wrapper
 * (updates correctly on client-side locale switches, unlike `<html dir>`).
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <div
      dir={direction}
      className={cn('min-h-screen bg-background text-foreground antialiased', locale === 'fa' ? estedad.className : roboto.className)}
    >
      <MainProvider locale={locale}>{children}</MainProvider>
    </div>
  );
}
