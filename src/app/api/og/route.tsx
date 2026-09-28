import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/data';
import { site } from '@/lib/seo';

/**
 * Dynamic Open Graph image endpoint (`GET /api/og?title=...`).
 * Falls back to the owner name from the profile when no title is
 * provided, so every share card looks intentional without extra config.
 */
const SIZE = { width: 1200, height: 630 };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const profile = await getProfile('en');

  const title = url.searchParams.get('title')?.slice(0, 120) || profile?.fullName || 'Magic Portfolio';
  const subtitle = profile?.jobTitle || (site ? site.replace(/^https?:\/\//, '') : '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2, display: 'flex' }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, color: '#a3a3a3', display: 'flex' }}>{subtitle}</div>
      </div>
    ),
    { ...SIZE }
  );
}
