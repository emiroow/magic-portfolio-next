import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import MainProvider from "@/providers/mainProvider";
import { notFound } from "next/navigation";

/**
 * Locale layout: wraps all localized routes with direction and font classes.
 * Note: <html> and <body> are defined only in the root layout (app/layout.tsx).
 */
export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const direction = locale === "fa" ? "rtl" : "ltr";

  // Guard against unknown locales early
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <div
      dir={direction}
      className={cn(
        `min-h-screen bg-background antialiased max-w-2xl mx-auto ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      {/* Global providers needed on both client and server paths */}
      <MainProvider>{children}</MainProvider>
    </div>
  );
}
