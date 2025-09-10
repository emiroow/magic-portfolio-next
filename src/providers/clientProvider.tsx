import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Fragment } from "react";

interface Props {
  children: React.ReactNode;
  locale?: string;
}

const ClientProvider = async ({ children, locale }: Props) => {
  const messages = await getMessages();

  return (
    <Fragment>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </Fragment>
  );
};

export default ClientProvider;
