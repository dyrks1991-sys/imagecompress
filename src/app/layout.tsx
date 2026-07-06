import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://imagecompress-jet.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ImageCompress — Free Image Compressor. No Upload.',
    template: '%s | ImageCompress',
  },
  description:
    'Compress JPEG, PNG, and WebP images instantly in your browser. Reduce file size by up to 90% — free, private, no account needed. Your files never leave your device.',
  keywords: [
    'image compressor',
    'compress image online',
    'image optimizer',
    'reduce image size',
    'jpeg compressor',
    'png optimizer',
    'webp converter',
    'free image compression',
    'no upload image compressor',
    'browser image compression',
  ],
  authors: [{ name: 'ImageCompress' }],
  creator: 'ImageCompress',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'ImageCompress',
    title: 'ImageCompress — Free Image Compressor. No Upload.',
    description:
      'Compress JPEG, PNG, and WebP images instantly in your browser. No upload, no account, 100% private.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ImageCompress — Compress images up to 90% smaller, right in your browser.',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageCompress — Free Image Compressor. No Upload.',
    description:
      'Compress JPEG, PNG, and WebP images instantly in your browser. No upload, 100% private.',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ImageCompress',
    url: BASE_URL,
    description: 'Free, private, browser-based image compression tool.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'JPEG compression',
      'PNG optimization',
      'WebP conversion',
      'No upload required',
      'Client-side processing',
      'Before/after preview',
    ],
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
