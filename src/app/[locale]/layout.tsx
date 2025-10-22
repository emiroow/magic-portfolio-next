import { getPathname, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import MainProvider from "@/providers/mainProvider";
import type { Metadata } from "next";
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
        `bg-background antialiased ${
          locale === "en" ? "font-robotRegular" : "font-estedadRegular"
        } `
      )}
    >
      {/* Global providers needed on both client and server paths */}
      <MainProvider>{children}</MainProvider>
    </div>
  );
}

// Provide sensible defaults for SEO across all localized routes
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const currentFa = getPathname({ href: "/", locale: "fa" });
  const currentEn = getPathname({ href: "/", locale: "en" });

  return {
    metadataBase: site ? new URL(site) : undefined,
    alternates: {
      canonical: getPathname({ href: "/", locale }),
      languages: {
        fa: currentFa,
        en: currentEn,
        "x-default": getPathname({ href: "/", locale }),
      },
    },
    openGraph: {
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
  } satisfies Metadata;
}
