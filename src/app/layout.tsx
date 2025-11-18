import "@/app/globals.css";
import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";

// Base SEO metadata applied across the app
const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE || "Portfolio";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Personal portfolio website";
const AUTHOR = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Amir";
const TWITTER = process.env.NEXT_PUBLIC_TWITTER_HANDLE || ""; // include @ if desired
const OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE ||
  (site ? `${site}/favicon.ico` : "/favicon.ico");

export const metadata: Metadata = {
  // Setting a metadataBase ensures canonical/alternate links are absolute
  metadataBase: site ? new URL(site) : undefined,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_TITLE,
  referrer: "origin-when-cross-origin",
  keywords: ["portfolio", "developer", "projects", "resume"],
  authors: [{ name: AUTHOR }],
  creator: AUTHOR,
  publisher: AUTHOR,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: site || undefined,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER || undefined,
    creator: TWITTER || undefined,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon.png",
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
