import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ImageCompress — Free Client-Side Image Compression',
  description: 'Compress JPEG, PNG, and WebP images in your browser. Fast, private, no upload required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
