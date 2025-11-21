import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.emiroow.ir",
      "localhost",
      "127.0.0.1",
      "your-vercel-blob-domain",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
