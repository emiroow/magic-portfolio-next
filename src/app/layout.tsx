import "@/app/globals.css";
import type { Metadata, Viewport } from "next";

// Base SEO metadata applied across the app
export const metadata: Metadata = {
  metadataBase: undefined, // Consider setting this from env in production for absolute URLs
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
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
