// Update the import path to the correct location of get-query-client
"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider, useTheme } from "next-themes"; // Add this import if you use next-themes
import React, { Fragment } from "react";
import { Toaster } from "sonner";

interface Props {
  children: React.ReactNode;
  locale?: string;
  messages: Record<string, string>;
}

const DashboardProvider = async ({ children, locale, messages }: Props) => {
  const queryClient = new QueryClient();

  const { theme } = useTheme(); // Get the current theme
  return (
    <Fragment>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <main>{children}</main>
            </TooltipProvider>
            <Toaster theme={theme as "light" | "dark" | "system" | undefined} />
            <ReactQueryDevtools />
          </QueryClientProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </Fragment>
  );
};

export default DashboardProvider;
