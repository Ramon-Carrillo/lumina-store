import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strip the X-Powered-By header
  poweredByHeader: false,

  // Enable gzip/brotli compression on responses
  compress: true,

  // Strict mode catches subtle React bugs early (dev only cost)
  reactStrictMode: true,

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
      // Lorem Picsum — reliable photo placeholders for seeded data
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],

    // Ship modern formats by default
    formats: ['image/avif', 'image/webp'],

    // Cache optimised images for 7 days
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
}

export default nextConfig
