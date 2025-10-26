import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

interface Props {
  children: React.ReactNode;
  locale?: string;
}

const MainProvider = async ({ children }: Props) => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

export default MainProvider;
