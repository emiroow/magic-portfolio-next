'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider, useLocale, type Messages } from 'next-intl';
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

/** The single client provider tree (session, theme, react-query, tooltips, toasts). */
export default function AppProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <HtmlDirection />
              {children}
              <ThemedToaster />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}

/** Sonner toaster that follows the active theme and text direction. */
function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();

  return <Toaster theme={resolvedTheme as 'light' | 'dark' | undefined} dir={locale === 'fa' ? 'rtl' : 'ltr'} position="top-center" />;
}

/** Keeps `<html lang/dir>` in sync after client-side locale switches. */
function HtmlDirection() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === 'fa' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
