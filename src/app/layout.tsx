import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import { estedad, roboto } from '@/lib/fonts';
import { site } from '@/lib/seo';
import '@/app/globals.css';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import GoogleAnalytics from './analytics';

/**
 * Root metadata. Page-level `generateMetadata` overrides these per locale.
 */
export const metadata: Metadata = {
  metadataBase: site ? new URL(site) : undefined,
  title: {
    default: 'Magic Portfolio',
    template: '%s | Magic Portfolio',
  },
  description: 'Minimal, bilingual developer portfolio with blog and admin dashboard.',
  applicationName: 'Magic Portfolio',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Use the active locale to set correct html lang, direction and font.
  const locale = await getLocale();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${locale === 'fa' ? estedad.className : roboto.className} bg-background text-foreground antialiased`}>
        {/* Subtle decorative grid at the top of every localized page */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100px] overflow-hidden">
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
        {children}
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
