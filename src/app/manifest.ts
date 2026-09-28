import type { MetadataRoute } from 'next';

/** PWA manifest; name/description configurable via env. */
export default function manifest(): MetadataRoute.Manifest {
  const name = process.env.NEXT_PUBLIC_SITE_TITLE || 'Magic Portfolio';

  return {
    name,
    short_name: name,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Personal developer portfolio, blog and dashboard.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a0a0a',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
