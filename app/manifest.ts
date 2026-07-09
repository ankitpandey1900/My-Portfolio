import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ankit Pandey',
    short_name: 'Ankit Pandey',
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
