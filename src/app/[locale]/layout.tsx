import { routing } from '@/i18n/routing';
import { estedad, roboto } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import MainProvider from '@/providers/mainProvider';
import { notFound } from 'next/navigation';

/**
 * Locale layout: validates the `[locale]` segment, mounts the single
 * client provider tree and — critically — applies direction and font on
 * a wrapper element. (The root layout's `<html dir>` only reflects the
 * first render; a wrapper updates correctly on client-side locale
 * switches too.)
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
