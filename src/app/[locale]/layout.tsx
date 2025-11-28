import { getPathname, routing } from '@/i18n/routing';
import { getSiteMeta } from '@/lib/getSiteDefultMetaData';
import { cn } from '@/lib/utils';
import MainProvider from '@/providers/mainProvider';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Locale layout: wraps all localized routes with direction and font classes.
 * Note: <html> and <body> are defined only in the root layout (app/layout.tsx).
 */
export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  // Guard against unknown locales early
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div dir={direction} className={cn(`bg-background antialiased ${locale === 'en' ? 'font-robotRegular' : 'font-estedadRegular'} `)}>
      {/* Global providers needed on both client and server paths */}
      <MainProvider locale={locale}>{children}</MainProvider>
    </div>
  );
}

// Provide sensible defaults for SEO across all localized routes
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const { title, description, author, twitter, siteUrl } = getSiteMeta(locale as 'fa' | 'en');
  const test = getSiteMeta(locale as 'fa' | 'en');
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const SITE_TITLE = title || 'Portfolio';
  const SITE_DESCRIPTION = description || 'Personal portfolio website';
  const TWITTER = twitter || '';
  const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || (site ? `${site}/favicon.ico` : '/favicon.ico');
  const AUTHOR = author || '';
  const currentFa = getPathname({ href: '/', locale: 'fa' });
  const currentEn = getPathname({ href: '/', locale: 'en' });

  return {
    metadataBase: site ? new URL(site) : undefined,
    title: {
      default: SITE_TITLE,
      template: `%s | ${SITE_TITLE}`,
    },
    authors: AUTHOR ? [{ name: AUTHOR }] : undefined,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: getPathname({ href: '/', locale }),
      languages: {
        fa: currentFa,
        en: currentEn,
        'x-default': getPathname({ href: '/', locale }),
      },
    },
    openGraph: {
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: site ? `${site}/${locale}` : undefined,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER || undefined,
      creator: TWITTER || undefined,
    },
  } satisfies Metadata;
}
