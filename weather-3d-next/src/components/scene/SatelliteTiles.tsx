'use client'
/**
 * SatelliteTiles — loads satellite map tiles as textured PlaneGeometry meshes.
 *
 * Tile sources (priority order):
 *   1. Google Maps Tile API v1 (requires NEXT_PUBLIC_GOOGLE_MAPS_KEY + session)
 *   2. ESRI World Imagery (free, no key, looks identical for most purposes)
 *
 * The grid is centred on refLat/refLon. Camera altitude drives the zoom level
 * so tile resolution automatically improves as you fly closer.
 */
import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { latLonToTile, tileBounds, tileSizeMeters, altitudeToZoom, latLonToWorld } from '@/utils/geo'

const TILE_SIZE_PX   = 256
const GRID_RADIUS    = 3   // tiles in each direction from centre
const EARTH_RADIUS_M = 6_371_000

// Tile URL helpers

function esriTileUrl(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
}

function googleTileUrl(x: number, y: number, z: number, session: string, apiKey: string) {
  return `https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}?session=${session}&key=${apiKey}`
}

// Texture cache

const textureCache = new Map<string, THREE.Texture>()
const loader = new THREE.TextureLoader()

function loadTile(url: string): Promise<THREE.Texture> {
  if (textureCache.has(url)) return Promise.resolve(textureCache.get(url)!)
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 16
        tex.minFilter  = THREE.LinearMipmapLinearFilter
        tex.generateMipmaps = true
        textureCache.set(url, tex)
        resolve(tex)
      },
      undefined,
      reject
    )
  })
}

// Single tile mesh

interface TileProps {
  tileX: number
  tileY: number
  zoom: number
  refLat: number
  refLon: number
  googleSession: string | null
}

function Tile({ tileX, tileY, zoom, refLat, refLon, googleSession }: TileProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''
  const useGoogle = !!(apiKey && googleSession)

  const url = useMemo(() => {
    return useGoogle
      ? googleTileUrl(tileX, tileY, zoom, googleSession!, apiKey)
      : esriTileUrl(tileX, tileY, zoom)
  }, [tileX, tileY, zoom, useGoogle, googleSession, apiKey])

  useEffect(() => {
    let alive = true
    loadTile(url).then(tex => { if (alive) setTexture(tex) }).catch(() => {})
    return () => { alive = false }
  }, [url])

  // Compute world-space position and size
  const { position, size } = useMemo(() => {
    const bounds = tileBounds(tileX, tileY, zoom)
    const centerLat = (bounds.north + bounds.south) / 2
    const centerLon = (bounds.west + bounds.east) / 2
    const { x, z } = latLonToWorld(centerLat, centerLon, refLat, refLon)
    const s = tileSizeMeters(refLat, zoom)
    return { position: [x, 0, z] as [number, number, number], size: s }
  }, [tileX, tileY, zoom, refLat, refLon])

  if (!texture) return null

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 8, 8]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.95}
        metalness={0}
        envMapIntensity={0.1}
      />
    </mesh>
  )
}

// Tile grid

interface SatelliteTilesProps {
  lat: number
  lon: number
  googleSession: string | null
}

export function SatelliteTiles({ lat, lon, googleSession }: SatelliteTilesProps) {
  const { camera } = useThree()
  const [zoom, setZoom] = useState(14)
  const prevAlt = useRef(0)

  // Update zoom level from camera altitude
  useFrame(() => {
    const alt = Math.max(50, camera.position.y)
    if (Math.abs(alt - prevAlt.current) > 50) {
      prevAlt.current = alt
      setZoom(altitudeToZoom(alt))
    }
  })

  const tiles = useMemo(() => {
    const centre = latLonToTile(lat, lon, zoom)
    const result: { x: number; y: number }[] = []
    const n = Math.pow(2, zoom)
    for (let dy = -GRID_RADIUS; dy <= GRID_RADIUS; dy++) {
      for (let dx = -GRID_RADIUS; dx <= GRID_RADIUS; dx++) {
        const x = ((centre.x + dx) % n + n) % n
        const y = ((centre.y + dy) % n + n) % n
        result.push({ x, y })
      }
    }
    return result
  }, [lat, lon, zoom])

  return (
    <group>
      {tiles.map(({ x, y }) => (
        <Tile
          key={`${zoom}-${x}-${y}`}
          tileX={x}
          tileY={y}
          zoom={zoom}
          refLat={lat}
          refLon={lon}
          googleSession={googleSession}
        />
      ))}
    </group>
  )
}
