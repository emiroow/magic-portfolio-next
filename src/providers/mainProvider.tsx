import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
interface Props {
  children: React.ReactNode;
  locale?: string;
}

const MainProvider = async ({ children, locale }: Props) => {
  // getMessages will pick messages for the current route if locale is omitted,
  // but when we receive an explicit `locale` from the layout we prefer that.
  const messages = locale ? await getMessages({ locale }) : await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
};

export default MainProvider;
