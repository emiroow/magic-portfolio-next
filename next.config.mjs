import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: { serverComponentsHmrCache: false, turbo: { caches: false } },
  images: {
    // domains: ["api.emiroow.ir"],
  },
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
