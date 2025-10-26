"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider, useTheme } from "next-themes"; // Add this import if you use next-themes
import React from "react";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, string>;
}

const AuthProvider = ({ children, locale, messages }: Props) => {
  const queryClient = new QueryClient();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <ThemedContent locale={locale}>{children}</ThemedContent>
            </TooltipProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextIntlClientProvider>
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

export default AuthProvider;
