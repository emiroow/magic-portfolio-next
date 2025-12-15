import '@/app/globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import GoogleAnalytics from './analytics';

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
