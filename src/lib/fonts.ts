import localFont from 'next/font/local';

/**
 * Self-hosted fonts (no external requests, works offline / on Vercel edge).
 * Applied per-locale so English and Persian pages always get the right face,
 * even during client-side locale switches.
 */
export const estedad = localFont({
  src: '../../public/fonts/Estedad-Regular.ttf',
  variable: '--font-estedad',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const roboto = localFont({
  src: [
    { path: '../../public/fonts/Roboto-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Roboto-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-roboto',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
