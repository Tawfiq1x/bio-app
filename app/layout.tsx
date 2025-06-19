import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bio-app | Showcase Yourself',
  description: 'Create your personalized bio page with badges, customizations, and more.',
  metadataBase: new URL('https://bio-app.vercel.app'),
  openGraph: {
    title: 'bio-app',
    description: 'Create your personalized bio page with badges, customizations, and more.',
    url: 'https://bio-app.vercel.app',
    siteName: 'bio-app',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'bio-app',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bio-app',
    description: 'Create your personalized bio page with badges, customizations, and more.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        {children}
      </body>
    </html>
  )
}
