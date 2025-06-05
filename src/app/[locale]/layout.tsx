import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

import "./globals.css";

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === "fa" ? "rtl" : "ltr";

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body
        className={cn(
          `min-h-screen bg-background ${
            locale === "en" ? "font-robotRegular" : "font-estedadRegular"
          } antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6`
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
