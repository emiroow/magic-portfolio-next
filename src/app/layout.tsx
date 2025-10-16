import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";

// Base SEO metadata applied across the app
const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

export const metadata: Metadata = {
  // Setting a metadataBase ensures canonical/alternate links are absolute
  metadataBase: site ? new URL(site) : undefined,
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "Personal portfolio website",
  applicationName: "Portfolio",
  referrer: "origin-when-cross-origin",
  keywords: ["portfolio", "developer", "projects", "resume"],
  authors: [{ name: "Owner" }],
  creator: "Owner",
  publisher: "Owner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fa: "/fa",
      "x-default": "/fa",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the active locale to set correct html lang and text direction
  const locale = await getLocale();
  const dir = locale === "fa" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
