import { Suspense, useContext, useEffect, useRef, useState } from 'react'
import { useTexture } from '@react-three/drei'
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

// CDN Earth textures — jsDelivr (backed by multiple CDNs globally, fast on mobile)
const DAY_TEXTURE_URL   = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg'
const NIGHT_TEXTURE_URL = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg'

// Natural Earth country outlines — GeoJSON, ~500 KB
const BORDERS_URL =
  'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson'

// OpenStreetMap tile URL for imagery drape on Cesium terrain
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

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

// ── Placeholder while texture loads (meshBasicMaterial = no lighting needed) ──

function SimpleEarth({ routeMode, onGlobeClick }) {
  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }
  return (
    <>
      {/* Ocean */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS - 100, 64, 32]} />
        <meshBasicMaterial color="#1a3a6e" />
      </mesh>
      {/* Land — slightly larger so ocean shows at edges */}
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 32]} />
        <meshBasicMaterial color="#2d5a27" />
      </mesh>
    </>
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
