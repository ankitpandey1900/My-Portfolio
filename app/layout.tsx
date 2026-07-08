import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans, Syne } from 'next/font/google';
import './globals.css';
import { AnalyticsProvider } from '@/components/analytics/analytics-provider';
import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { cn } from '@/lib/utils';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Ankit Pandey | Solar Portfolio',
    template: '%s | Ankit Pandey',
  },
  description:
    'A cinematic solar-system portfolio for software engineering, product craft, and immersive web experiences.',
  openGraph: {
    title: 'Ankit Pandey | Solar Portfolio',
    description:
      'A cinematic solar-system portfolio for software engineering, product craft, and immersive web experiences.',
    url: '/',
    siteName: 'Ankit Pandey Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Ankit Pandey Solar Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankit Pandey | Solar Portfolio',
    description:
      'A cinematic solar-system portfolio for software engineering, product craft, and immersive web experiences.',
    images: ['/twitter-image'],
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
        'h-full antialiased font-sans',
        jakarta.variable,
        inter.variable,
        syne.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-space-black text-foreground selection:bg-gold-soft/25 selection:text-white">
        <AnalyticsProvider>
          <ServiceWorkerRegister />
          <CustomCursor />
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
