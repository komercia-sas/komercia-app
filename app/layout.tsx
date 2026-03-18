import type React from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Komercia',
    template: '%s | Komercia',
  },
  description: 'Mobiliario y soluciones para oficina y espacios de trabajo.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Komercia',
    description: 'Mobiliario y soluciones para oficina y espacios de trabajo.',
    type: 'website',
    siteName: 'Komercia',
    locale: 'es_CO',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Komercia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komercia',
    description: 'Mobiliario y soluciones para oficina y espacios de trabajo.',
    images: ['/og-default.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' className='antialiased'>
      <body className='font-sans'>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
