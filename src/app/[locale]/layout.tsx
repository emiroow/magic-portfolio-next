import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import MainProvider from '@/providers/mainProvider';
import { notFound } from 'next/navigation';

/**
 * Locale layout: wraps all localized routes with direction and font classes.
 * Note: <html> and <body> are defined only in the root layout (app/layout.tsx).
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  // Guard against unknown locales early
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div dir={direction} className={cn(`relative bg-background antialiased ${locale === 'en' ? 'font-robotRegular' : 'font-estedadRegular'} `)}>
      <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
        <FlickeringGrid
          className="h-full w-full"
          squareSize={2}
          gridGap={2}
          style={{
            maskImage: 'linear-gradient(to bottom, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        />
      </div>
      <MainProvider locale={locale}>{children}</MainProvider>
    </div>
  );
}
