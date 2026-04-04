import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WeatherViz 3D — Live Weather in Immersive 3D',
  description: 'Real-time weather in a photorealistic 3D scene with satellite imagery, volumetric clouds, and atmospheric effects.',
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
