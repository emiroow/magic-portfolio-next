import '@/app/globals.css';
import { AUTHOR, OG_IMAGE, SITE_DESCRIPTION, SITE_TITLE, TWITTER, getCanonical, metadataBase, site } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import GoogleAnalytics from './analytics';

export const metadata: Metadata = {
  // Setting a metadataBase ensures canonical/alternate links are absolute
  metadataBase: metadataBase(),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  referrer: 'origin-when-cross-origin',
  keywords: ['portfolio', 'developer', 'projects', 'resume'],
  authors: [{ name: AUTHOR }],
  creator: AUTHOR,
  publisher: AUTHOR,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: site || undefined,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: TWITTER || undefined,
    creator: TWITTER || undefined,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' }],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Keep canonical root; per-locale alternates are provided by locale layout/page metadata
  alternates: {
    canonical: getCanonical('/'),
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Use the active locale to set correct html lang and text direction
  const locale = await getLocale();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>
        {children}
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
