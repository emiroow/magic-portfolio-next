import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider, useTheme } from "next-themes";
import { Fragment } from "react";
import { Toaster } from "sonner";

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
          <TooltipProvider>
            <ThemedContent locale={locale}>{children}</ThemedContent>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </Fragment>
  );
};

const ThemedContent = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  const { theme } = useTheme();

  return (
    <>
      <main>{children}</main>
      <Toaster
        toastOptions={{
          style: {
            direction: locale === "fa" ? "rtl" : "ltr",
            background: theme === "dark" ? "black" : "white",
            color: theme === "dark" ? "white" : "black",
            border: theme === "dark" ? "1px solid black" : "1px solid white",
          },
        }}
        theme={theme as "light" | "dark" | undefined}
        position="top-center"
      />
    </>
  );
};

export default ClientProvider;
