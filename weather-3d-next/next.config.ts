import type { NextConfig } from 'next'

// GitHub Pages project sites are served at /REPO-NAME/ — must match exact case of the repo
const isGHPages = process.env.GITHUB_ACTIONS === 'true'
const basePath  = isGHPages ? '/3D-realtime-weather' : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
