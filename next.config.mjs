import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Vercel Blob storage (production image uploads).
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Local development uploads served from /public via NEXT_PUBLIC_SITE_URL.
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
  },
};

export default withNextIntl(nextConfig);
