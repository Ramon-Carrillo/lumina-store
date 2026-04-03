import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { LenisProvider } from '@/components/providers/lenis-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ScrollProgress } from '@/components/shop/scroll-progress'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'Lumina Store',
    template: '%s | Lumina Store',
  },
  description: 'Premium wireless earbuds and audio accessories — crafted for audiophiles.',
  keywords: ['wireless earbuds', 'headphones', 'audio accessories', 'ANC', 'premium audio'],
  openGraph: {
    type: 'website',
    siteName: 'Lumina Store',
    title: 'Lumina Store — Premium Sound, Elevated',
    description: 'Premium wireless earbuds and audio accessories — crafted for audiophiles.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Lumina Store — Premium Sound, Elevated' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina Store — Premium Sound, Elevated',
    description: 'Premium wireless earbuds and audio accessories — crafted for audiophiles.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Viewport ─────────────────────────────────────────────────────────────────
//
// Exported separately from metadata per Next.js 15+ requirements.
// Sets the mobile viewport and PWA theme colour that browsers use for the
// address bar / tab strip.

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <LenisProvider>
            {/* Scroll progress sits above everything, including the navbar */}
            <ScrollProgress />

            <Navbar />

            {/*
              pt-16 offsets the fixed navbar height so page content
              starts below it instead of being hidden behind it.
            */}
            <main className="flex-1 pt-16">{children}</main>
            <Footer />

            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  border: '1px solid oklch(0 0 0 / 10%)',
                  color: 'var(--foreground)',
                },
              }}
            />
          </LenisProvider>
        </CartProvider>
      </body>
    </html>
  )
}
