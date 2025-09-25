import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Fragment } from "react";

interface Props {
  children: React.ReactNode;
  locale: string;
}

const ClientProvider = async ({ children, locale }: Props) => {
  const messages = await getMessages();

  return (
    <Fragment>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </Fragment>
  );
};

export default ClientProvider;
