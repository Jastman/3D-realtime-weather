import type { NextConfig } from 'next'

// On GitHub Actions the basePath must match the repo name so assets load correctly
const isGHPages = process.env.GITHUB_ACTIONS === 'true'
const basePath  = isGHPages ? '/3d-realtime-weather' : ''

const nextConfig: NextConfig = {
  output: 'export',         // static HTML — required for GitHub Pages
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,

  images: {
    unoptimized: true,      // next/image optimisation not available on static hosts
  },
}

export default nextConfig
