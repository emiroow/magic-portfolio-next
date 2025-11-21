import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.emiroow.ir", "localhost", "127.0.0.1", "your-vercel-blob-domain", siteUrl],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.blob.vercel-storage.com",
    },
  ],
};

export default withNextIntl(nextConfig);
