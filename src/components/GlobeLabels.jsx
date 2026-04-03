/**
 * GlobeLabels — Google Maps-style city labels rendered on a 2D canvas overlay.
 *
 * Runs inside the R3F Canvas via useFrame, projects 3D positions to screen
 * space, and draws text directly onto an external <canvas> element.
 *
 * Features:
 *   • Zoom-level tiers: fewer labels when far away, more when zoomed in
 *   • Horizon culling: hides cities on the back side of the globe
 *   • Frustum culling: hides cities outside the viewport
 *   • Font scales with altitude (bigger when closer)
 *   • Retina-display aware (devicePixelRatio)
 */
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { latLonToECEF, EARTH_RADIUS } from '../utils/greatCircle'

// ── City / capital database ───────────────────────────────────────────────────
// s: size tier  3 = megacity/capital  2 = major city  1 = regional city
const CITIES = [
  // Americas
  { n: 'New York',      lat: 40.71, lon: -74.01,  s: 3 },
  { n: 'Los Angeles',   lat: 34.05, lon: -118.24, s: 3 },
  { n: 'Chicago',       lat: 41.88, lon: -87.63,  s: 2 },
  { n: 'Miami',         lat: 25.77, lon: -80.19,  s: 2 },
  { n: 'Houston',       lat: 29.76, lon: -95.37,  s: 2 },
  { n: 'Seattle',       lat: 47.61, lon: -122.33, s: 1 },
  { n: 'Toronto',       lat: 43.65, lon: -79.38,  s: 2 },
  { n: 'Vancouver',     lat: 49.25, lon: -123.12, s: 1 },
  { n: 'Mexico City',   lat: 19.43, lon: -99.13,  s: 3 },
  { n: 'São Paulo',     lat: -23.55, lon: -46.63, s: 3 },
  { n: 'Rio de Janeiro',lat: -22.91, lon: -43.17, s: 2 },
  { n: 'Buenos Aires',  lat: -34.60, lon: -58.38, s: 3 },
  { n: 'Bogotá',        lat: 4.71,  lon: -74.07,  s: 2 },
  { n: 'Lima',          lat: -12.05, lon: -77.04, s: 2 },
  // Europe
  { n: 'London',        lat: 51.51, lon: -0.13,   s: 3 },
  { n: 'Paris',         lat: 48.85, lon: 2.35,    s: 3 },
  { n: 'Berlin',        lat: 52.52, lon: 13.41,   s: 2 },
  { n: 'Madrid',        lat: 40.42, lon: -3.70,   s: 2 },
  { n: 'Rome',          lat: 41.90, lon: 12.50,   s: 2 },
  { n: 'Moscow',        lat: 55.75, lon: 37.62,   s: 3 },
  { n: 'Amsterdam',     lat: 52.37, lon: 4.90,    s: 2 },
  { n: 'Vienna',        lat: 48.21, lon: 16.37,   s: 1 },
  { n: 'Zurich',        lat: 47.38, lon: 8.54,    s: 1 },
  { n: 'Stockholm',     lat: 59.33, lon: 18.07,   s: 1 },
  { n: 'Warsaw',        lat: 52.23, lon: 21.01,   s: 1 },
  // Middle East / Africa
  { n: 'Dubai',         lat: 25.20, lon: 55.27,   s: 3 },
  { n: 'Istanbul',      lat: 41.01, lon: 28.96,   s: 3 },
  { n: 'Cairo',         lat: 30.04, lon: 31.24,   s: 3 },
  { n: 'Riyadh',        lat: 24.69, lon: 46.72,   s: 2 },
  { n: 'Nairobi',       lat: -1.29, lon: 36.82,   s: 2 },
  { n: 'Lagos',         lat: 6.52,  lon: 3.38,    s: 3 },
  { n: 'Johannesburg',  lat: -26.20, lon: 28.04,  s: 2 },
  { n: 'Cape Town',     lat: -33.92, lon: 18.42,  s: 1 },
  // Asia
  { n: 'Beijing',       lat: 39.91, lon: 116.39,  s: 3 },
  { n: 'Shanghai',      lat: 31.23, lon: 121.47,  s: 3 },
  { n: 'Tokyo',         lat: 35.69, lon: 139.69,  s: 3 },
  { n: 'Seoul',         lat: 37.57, lon: 126.98,  s: 3 },
  { n: 'Hong Kong',     lat: 22.32, lon: 114.17,  s: 2 },
  { n: 'Singapore',     lat: 1.35,  lon: 103.82,  s: 3 },
  { n: 'Mumbai',        lat: 19.08, lon: 72.88,   s: 3 },
  { n: 'New Delhi',     lat: 28.61, lon: 77.21,   s: 3 },
  { n: 'Bangalore',     lat: 12.97, lon: 77.59,   s: 2 },
  { n: 'Bangkok',       lat: 13.75, lon: 100.50,  s: 3 },
  { n: 'Jakarta',       lat: -6.21, lon: 106.85,  s: 3 },
  { n: 'Manila',        lat: 14.60, lon: 120.98,  s: 2 },
  { n: 'Taipei',        lat: 25.03, lon: 121.57,  s: 2 },
  { n: 'Kuala Lumpur',  lat: 3.14,  lon: 101.69,  s: 2 },
  // Oceania
  { n: 'Sydney',        lat: -33.87, lon: 151.21, s: 3 },
  { n: 'Melbourne',     lat: -37.81, lon: 144.96, s: 2 },
  { n: 'Auckland',      lat: -36.86, lon: 174.77, s: 1 },
]

// Pre-compute 3D positions (slightly above surface to avoid z-fighting)
const CITY_POSITIONS = CITIES.map(c => ({
  ...c,
  pos: latLonToECEF(c.lat, c.lon, 8_000),
}))

const _frustum   = new THREE.Frustum()
const _projMat   = new THREE.Matrix4()
const _ndc       = new THREE.Vector3()
const _camDir    = new THREE.Vector3()
const _cityDir   = new THREE.Vector3()

export function GlobeLabels({ canvasRef }) {
  const { camera, size } = useThree()

  useFrame(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = size.width
    const H = size.height

    // Resize canvas to viewport (retina-aware)
    const tw = Math.round(W * dpr)
    const th = Math.round(H * dpr)
    if (canvas.width !== tw || canvas.height !== th) {
      canvas.width  = tw
      canvas.height = th
    }

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    // Update frustum for this frame
    _projMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    _frustum.setFromProjectionMatrix(_projMat)

    const camAlt = camera.position.length() - EARTH_RADIUS
    _camDir.copy(camera.position).normalize()

    // Altitude tiers — fewer cities when far away
    const minTier = camAlt > 4_000_000 ? 3 : camAlt > 800_000 ? 2 : 1

    for (const city of CITY_POSITIONS) {
      if (city.s < minTier) continue

      // Horizon cull: skip cities behind the globe
      _cityDir.copy(city.pos).normalize()
      const dot = _cityDir.dot(_camDir)
      if (dot < 0.08) continue

      // Frustum cull
      if (!_frustum.containsPoint(city.pos)) continue

      // Project to NDC → screen pixels
      _ndc.copy(city.pos).project(camera)
      const sx = (_ndc.x + 1) / 2 * W
      const sy = (-_ndc.y + 1) / 2 * H

      // Extra margin guard
      if (sx < -60 || sx > W + 60 || sy < -20 || sy > H + 20) continue

      // Font size scales inversely with altitude
      const scale = Math.max(0.35, Math.min(2.8, 650_000 / Math.max(1, camAlt)))
      const basePx = city.s >= 3 ? 13 : city.s >= 2 ? 11 : 9
      const fontSize = Math.round(basePx * scale)
      if (fontSize < 6) continue

      const weight = city.s >= 3 ? '700' : '500'
      ctx.font = `${weight} ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Dot for small distant cities
      if (fontSize <= 8) {
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.beginPath()
        ctx.arc(sx, sy, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      const yOff = fontSize <= 8 ? 7 : 0

      // Drop shadow pass
      ctx.shadowColor  = 'rgba(0,0,0,0.95)'
      ctx.shadowBlur   = 4
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fillStyle = city.s >= 3 ? '#ffffff' : 'rgba(235,242,255,0.88)'
      ctx.fillText(city.n, sx, sy + yOff)
      ctx.shadowBlur = 0
    }
  })

  return null
}
