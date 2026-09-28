import Footer from '@/components/dashboard/footer';
import Tab from '@/components/dashboard/tab';
import { getTranslations } from 'next-intl/server';

/** Admin dashboard: section switcher + floating dock. */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return (
    <main className="relative w-full">
      <h1 className="mt-4 text-center text-3xl font-bold tracking-tighter sm:text-4xl">{t('title')}</h1>
      <Tab />
      <Footer />
    </main>
  );
}
