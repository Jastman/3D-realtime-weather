import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow cross-origin requests for tile images (satellite + terrain)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tile.googleapis.com' },
      { protocol: 'https', hostname: 'server.arcgisonline.com' },
      { protocol: 'https', hostname: 'mt*.google.com' },
    ],
  },

  // Headers needed for SharedArrayBuffer (used by some Three.js features)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy',  value: 'require-corp' },
        ],
      },
    ]
  },
}

export default nextConfig
