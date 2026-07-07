import type { Metadata } from 'next';
import { Geist, Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// Configure Outfit font for Titles and Headings (as per 09_Design_System.md)
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// Configure Inter font for Core UI elements (as per 09_Design_System.md)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Configure JetBrains Mono for Telemetry and Data displays (as per 09_Design_System.md)
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Enforce modern Edge API and SEO layout configurations
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Solar Portfolio',
    template: '%s | Solar Portfolio',
  },
  description: 'Immersive 3D Space Exploration Game and Professional Developer Portfolio.',
  openGraph: {
    title: 'Solar Portfolio',
    description: 'Immersive 3D Space Exploration Game and Professional Developer Portfolio.',
    url: '/',
    siteName: 'Solar Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Portfolio',
    description: 'Immersive 3D Space Exploration Game and Professional Developer Portfolio.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        outfit.variable,
        inter.variable,
        jetbrainsMono.variable,
        'font-sans',
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-space-black text-slate-200 selection:bg-hud-teal/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
