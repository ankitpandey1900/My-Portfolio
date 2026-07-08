import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Solar Portfolio',
    short_name: 'Solar Portfolio',
    description: 'Immersive 3D Space Exploration Game and Professional Developer Portfolio.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030305',
    theme_color: '#ff6a00',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
