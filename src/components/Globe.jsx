import { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import {
  TilesRenderer,
  TilesPlugin,
  TilesRendererContext,
  GlobeControls,
  TilesAttributionOverlay,
} from '3d-tiles-renderer/r3f'
import {
  CesiumIonAuthPlugin,
  QuantizedMeshPlugin,
  GLTFExtensionsPlugin,
  XYZTilesPlugin,
} from '3d-tiles-renderer/three/plugins'
import { EARTH_RADIUS, latLonToECEF } from '../utils/greatCircle'

const ION_TOKEN =
  import.meta.env.VITE_CESIUM_ION_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGEzMmI5Yy0xYjkyLTQxYWYtYTQ0ZS1jZGZiNGJlZThmNDQiLCJpZCI6Mzg2MjQ2LCJpYXQiOjE3NzQ5ODA2NDV9.Ea5FeqRaQkC-iJs7Dp-6uxoc8YYmi6ewNyiQ8bRBxoQ'

// CDN Earth textures (no API key, served by unpkg)
const DAY_TEXTURE_URL   = 'https://unpkg.com/three-globe/example/img/earth-day.jpg'
const NIGHT_TEXTURE_URL = 'https://unpkg.com/three-globe/example/img/earth-night.jpg'

// Natural Earth country outlines — GeoJSON, ~500 KB
const BORDERS_URL =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson'

// OpenStreetMap tile URL for imagery drape on Cesium terrain
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// ── City labels ──────────────────────────────────────────────────────────────
// s: size tier 1=small 2=medium 3=large (capitals / megacities)
const CITIES = [
  { n: 'New York',      lat: 40.71, lon: -74.01, s: 3 },
  { n: 'Los Angeles',   lat: 34.05, lon: -118.24, s: 2 },
  { n: 'Chicago',       lat: 41.88, lon: -87.63,  s: 2 },
  { n: 'Toronto',       lat: 43.65, lon: -79.38,  s: 2 },
  { n: 'Mexico City',   lat: 19.43, lon: -99.13,  s: 3 },
  { n: 'São Paulo',     lat: -23.55, lon: -46.63, s: 3 },
  { n: 'Buenos Aires',  lat: -34.60, lon: -58.38, s: 2 },
  { n: 'Bogotá',        lat: 4.71,  lon: -74.07,  s: 1 },
  { n: 'London',        lat: 51.51, lon: -0.13,   s: 3 },
  { n: 'Paris',         lat: 48.85, lon: 2.35,    s: 3 },
  { n: 'Berlin',        lat: 52.52, lon: 13.41,   s: 2 },
  { n: 'Madrid',        lat: 40.42, lon: -3.70,   s: 2 },
  { n: 'Rome',          lat: 41.90, lon: 12.50,   s: 2 },
  { n: 'Moscow',        lat: 55.75, lon: 37.62,   s: 3 },
  { n: 'Amsterdam',     lat: 52.37, lon: 4.90,    s: 2 },
  { n: 'Dubai',         lat: 25.20, lon: 55.27,   s: 2 },
  { n: 'Istanbul',      lat: 41.01, lon: 28.96,   s: 2 },
  { n: 'Cairo',         lat: 30.04, lon: 31.24,   s: 2 },
  { n: 'Nairobi',       lat: -1.29, lon: 36.82,   s: 1 },
  { n: 'Lagos',         lat: 6.52,  lon: 3.38,    s: 2 },
  { n: 'Johannesburg',  lat: -26.20, lon: 28.04,  s: 1 },
  { n: 'Beijing',       lat: 39.91, lon: 116.39,  s: 3 },
  { n: 'Shanghai',      lat: 31.23, lon: 121.47,  s: 3 },
  { n: 'Tokyo',         lat: 35.69, lon: 139.69,  s: 3 },
  { n: 'Seoul',         lat: 37.57, lon: 126.98,  s: 2 },
  { n: 'Singapore',     lat: 1.35,  lon: 103.82,  s: 2 },
  { n: 'Mumbai',        lat: 19.08, lon: 72.88,   s: 2 },
  { n: 'New Delhi',     lat: 28.61, lon: 77.21,   s: 2 },
  { n: 'Bangkok',       lat: 13.75, lon: 100.50,  s: 2 },
  { n: 'Sydney',        lat: -33.87, lon: 151.21, s: 2 },
  { n: 'Melbourne',     lat: -37.81, lon: 144.96, s: 1 },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function processRing(coords, out, altM = 12_000) {
  for (let i = 0; i < coords.length - 1; i++) {
    const [lon0, lat0] = coords[i]
    const [lon1, lat1] = coords[i + 1]
    const p0 = latLonToECEF(lat0, lon0, altM)
    const p1 = latLonToECEF(lat1, lon1, altM)
    out.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
  }
}

function geojsonToSegments(geojson) {
  const pos = []
  for (const f of (geojson.features || [])) {
    const g = f.geometry
    if (!g) continue
    if (g.type === 'Polygon') {
      for (const ring of g.coordinates) processRing(ring, pos)
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates)
        for (const ring of poly) processRing(ring, pos)
    }
  }
  return new Float32Array(pos)
}

// ── Country border lines ─────────────────────────────────────────────────────

function CountryBorders() {
  const [geo, setGeo] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetch(BORDERS_URL)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        const arr = geojsonToSegments(data)
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
        setGeo(g)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!geo) return null
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#c8d8ff" opacity={0.4} transparent depthWrite={false} />
    </lineSegments>
  )
}

// ── City / capital labels ─────────────────────────────────────────────────────

function CityLabels() {
  return CITIES.map(city => (
    <Html
      key={city.n}
      position={latLonToECEF(city.lat, city.lon, 60_000).toArray()}
      center
      distanceFactor={3_500_000}
      occlude={false}
      zIndexRange={[0, 10]}
    >
      <span style={{
        color: city.s >= 3 ? '#fff' : 'rgba(255,255,255,0.8)',
        fontSize: `${8 + city.s * 2}px`,
        fontWeight: city.s >= 3 ? 700 : 500,
        textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        fontFamily: 'system-ui, sans-serif',
        letterSpacing: '0.2px',
      }}>
        {city.n}
      </span>
    </Html>
  ))
}

// ── Textured Earth sphere (inside Suspense) ───────────────────────────────────

function TexturedEarth({ routeMode, onGlobeClick }) {
  const [dayMap, nightMap] = useTexture([DAY_TEXTURE_URL, NIGHT_TEXTURE_URL])
  dayMap.colorSpace   = THREE.SRGBColorSpace
  nightMap.colorSpace = THREE.SRGBColorSpace

  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  return (
    <mesh onPointerDown={handlePointerDown}>
      <sphereGeometry args={[EARTH_RADIUS, 128, 64]} />
      <meshStandardMaterial
        map={dayMap}
        emissiveMap={nightMap}
        emissive={new THREE.Color(1, 1, 1)}
        emissiveIntensity={0.018}
        roughness={0.85}
        metalness={0.02}
      />
    </mesh>
  )
}

// ── Placeholder while texture loads ─────────────────────────────────────────

function SimpleEarth({ routeMode, onGlobeClick }) {
  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }
  return (
    <mesh onPointerDown={handlePointerDown}>
      <sphereGeometry args={[EARTH_RADIUS, 64, 32]} />
      <meshStandardMaterial color="#1a3a6e" roughness={0.9} metalness={0} />
    </mesh>
  )
}

// ── OSM imagery draped over Cesium terrain tiles ──────────────────────────────

function OSMImageryOverlay() {
  const tiles = useContext(TilesRendererContext)
  const ref   = useRef(null)

  useEffect(() => {
    if (!tiles) return
    const plugin = new XYZTilesPlugin({ url: OSM_TILE_URL, levels: 18 })
    ref.current = plugin
    tiles.registerPlugin(plugin)
    return () => {
      if (ref.current) { tiles.unregisterPlugin(ref.current); ref.current = null }
    }
  }, [tiles])

  return null
}

// ── Fallback globe (shown while Cesium tiles are loading / unavailable) ──────

function FallbackGlobe({ routeMode, onGlobeClick, showControls = true }) {
  return (
    <>
      <Suspense fallback={<SimpleEarth routeMode={routeMode} onGlobeClick={onGlobeClick} />}>
        <TexturedEarth routeMode={routeMode} onGlobeClick={onGlobeClick} />
      </Suspense>
      <CountryBorders />
      <CityLabels />
      {showControls && <GlobeControls enableDamping />}
    </>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export function Globe({ routeMode = false, onGlobeClick }) {
  const hitSphereRef = useRef()
  const [cesiumActive, setCesiumActive] = useState(false)
  const [cesiumError,  setCesiumError]  = useState(false)

  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  const useFallback = !ION_TOKEN ||
    ION_TOKEN === 'your_cesium_ion_token_here' ||
    cesiumError

  return (
    <>
      {(!cesiumActive || useFallback) && (
        <FallbackGlobe
          routeMode={routeMode}
          onGlobeClick={onGlobeClick}
          showControls={useFallback}
        />
      )}

      {!useFallback && (
        <>
          <TilesRenderer
            key={ION_TOKEN}
            onLoadModel={() => { if (!cesiumActive) setCesiumActive(true) }}
            onLoadError={e => { console.error('Cesium Ion error:', e); setCesiumError(true) }}
          >
            <TilesPlugin plugin={CesiumIonAuthPlugin} args={{ apiToken: ION_TOKEN, assetId: 1 }} />
            <TilesPlugin plugin={QuantizedMeshPlugin} />
            <TilesPlugin plugin={GLTFExtensionsPlugin} />
            <GlobeControls enableDamping />
            <TilesAttributionOverlay />
            <OSMImageryOverlay />
          </TilesRenderer>

          {routeMode && (
            <mesh ref={hitSphereRef} onPointerDown={handlePointerDown}>
              <sphereGeometry args={[EARTH_RADIUS + 1000, 64, 32]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          )}
        </>
      )}
    </>
  )
}
