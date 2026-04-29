import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strip the X-Powered-By header
  poweredByHeader: false,

  // Enable gzip/brotli compression on responses
  compress: true,

  // Strict mode catches subtle React bugs early (dev only cost)
  reactStrictMode: true,

  // ── Bundle optimisation ───────────────────────────────────────────────
  // Without this, every file that imports from `lucide-react`,
  // `@base-ui/react`, or `react-icons` ships the entire package's bundle.
  // With it, Next rewrites the imports per-file at build time so only
  // the symbols actually used reach the browser. lucide-react alone
  // goes from ~600 KB unminified to a few KB on the homepage.
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@base-ui/react',
    ],
  },

  images: {
    // Allow images from common cloud storage / CDN providers.
    // Add / remove patterns to match your actual upload destinations.
    remotePatterns: [
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // AWS S3 (any region)
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      // Uploadthing
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      // Placeholder / dev images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Lorem Picsum is no longer used at runtime — product images are
      // served locally from `public/products/<id>.jpg`. Re-add this
      // pattern only if a future seed reverts to remote placeholders.
    ],

    // Ship modern formats by default
    formats: ['image/avif', 'image/webp'],

    // Cache optimised images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
}

export default nextConfig
