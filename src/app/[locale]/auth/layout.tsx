import { getServerAuthSession } from '@/config/auth';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import AuthProvider from '@/providers/authProvider';
import type { Metadata } from 'next';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('auth.login');
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const canonical = site ? `${site}/${locale}/auth` : undefined;

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical,
      languages: {
        fa: site ? `${site}/fa/auth` : undefined,
        en: site ? `${site}/en/auth` : undefined,
        'x-default': canonical,
      },
    },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: canonical,
      siteName: t('title'),
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      type: 'website',
    },
  };
}

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const direction = locale === 'fa' ? 'rtl' : 'ltr';
  const messages: any = await getMessages();

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Require authentication
  const session = await getServerAuthSession();
  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div dir={direction} className={cn(`bg-background antialiased ${locale === 'en' ? 'font-robotRegular' : 'font-estedadRegular'} `)}>
      <AuthProvider locale={locale} messages={messages}>
        {children}
      </AuthProvider>
    </div>
  );
}
