import { getServerAuthSession } from '@/config/auth';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });
  // Admin area must never be indexed.
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

/**
 * Dashboard layout: enforces an admin session and constrains width.
 * Providers and locale validation are handled by `[locale]/layout.tsx`.
 */
export default async function DashboardLayout({
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

  const session = await getServerAuthSession();
  if (!session) {
    const callback = encodeURIComponent(`/${locale}/dashboard`);
    redirect(`/${locale}/auth?callbackUrl=${callback}`);
  }

  return <div className="mx-auto min-h-screen w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:py-12">{children}</div>;
}
