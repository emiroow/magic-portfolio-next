import AppProviders from '@/providers/appProviders';
import { getMessages } from 'next-intl/server';

interface Props {
  children: React.ReactNode;
  locale?: string;
}

/**
 * Server entry point for the client provider tree.
 * Resolves translation messages for the active locale once, then hands
 * everything to `AppProviders`.
 */
const MainProvider = async ({ children, locale }: Props) => {
  const messages = await getMessages({ locale });

  return (
    <AppProviders locale={locale ?? 'en'} messages={messages}>
      {children}
    </AppProviders>
  );
};

export default MainProvider;
