import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ankit Pandey — Solar Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
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
          background: 'linear-gradient(145deg, #040506 0%, #0d1117 50%, #040506 100%)',
          color: '#f0e9dc',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#d8a24a' }}>
          Solar Portfolio
        </div>
        <div style={{ fontSize: 64, fontWeight: 500, marginTop: 24, lineHeight: 1.05 }}>
          Ankit Pandey
        </div>
        <div style={{ fontSize: 26, marginTop: 20, color: 'rgba(238, 230, 215, 0.65)' }}>
          Software engineering & immersive web experiences
        </div>
      </div>
    ),
    { ...size }
  );
}
