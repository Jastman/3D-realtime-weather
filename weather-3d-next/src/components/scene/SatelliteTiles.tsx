'use client'
/**
 * SatelliteTiles - geo-registered satellite imagery with 3D terrain elevation.
 *
 * Satellite: ESRI World Imagery (free) or Google Maps Tile API v1.
 * Elevation:  AWS Terrain Tiles / Terrarium format (free, CORS-enabled).
 *   elevation_m = (R * 256 + G + B / 256) - 32768
 *
 * Each tile uses 32x32 mesh segments so terrain features render smoothly.
 */
import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { latLonToTile, tileBounds, tileSizeMeters, altitudeToZoom, latLonToWorld } from '@/utils/geo'

const GRID_RADIUS       = 4    // 9x9 = 81 tiles
const TERRAIN_SEGMENTS  = 32   // (33x33) vertices per tile
const VERT_EXAGGERATION = 1.5  // visual height scale multiplier

function esriTileUrl(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
}
function googleTileUrl(x: number, y: number, z: number, session: string, key: string) {
  return `https://tile.googleapis.com/v1/2dtiles/${z}/${x}/${y}?session=${session}&key=${key}`
}
function terrainUrl(x: number, y: number, z: number) {
  return `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`
}

const texCache:    Map<string, THREE.Texture>  = new Map()
const heightCache: Map<string, Float32Array>   = new Map()
const texLoader = new THREE.TextureLoader()

function loadSatTile(url: string): Promise<THREE.Texture> {
  if (texCache.has(url)) return Promise.resolve(texCache.get(url)!)
  return new Promise((resolve, reject) =>
    texLoader.load(url, tex => {
      tex.colorSpace     = THREE.SRGBColorSpace
      tex.anisotropy     = 16
      tex.minFilter      = THREE.LinearMipmapLinearFilter
      tex.generateMipmaps = true
      texCache.set(url, tex)
      resolve(tex)
    }, undefined, reject)
  )
}

async function loadTerrainHeights(x: number, y: number, z: number): Promise<Float32Array | null> {
  if (z < 10) return null
  const key = `${z}/${x}/${y}`
  if (heightCache.has(key)) return heightCache.get(key)!
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.crossOrigin = 'anonymous'
      el.onload  = () => resolve(el)
      el.onerror = reject
      el.src = terrainUrl(x, y, z)
    })
    const verts  = TERRAIN_SEGMENTS + 1
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = verts
    const ctx    = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, verts, verts)
    const pixels  = ctx.getImageData(0, 0, verts, verts).data
    const heights = new Float32Array(verts * verts)
    for (let i = 0; i < heights.length; i++) {
      const r = pixels[i * 4], g = pixels[i * 4 + 1], b = pixels[i * 4 + 2]
      const elev = r * 256 + g + b / 256 - 32768
      heights[i] = Math.max(0, elev) * VERT_EXAGGERATION
    }
    heightCache.set(key, heights)
    return heights
  } catch {
    return null
  }
}

interface TileProps {
  tileX: number; tileY: number; zoom: number
  refLat: number; refLon: number; googleSession: string | null
}

function Tile({ tileX, tileY, zoom, refLat, refLon, googleSession }: TileProps) {
  const meshRef        = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [heights, setHeights] = useState<Float32Array | null>(null)
  const heightsApplied = useRef(false)

  const apiKey    = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''
  const useGoogle = !!(apiKey && googleSession)

  const satUrl = useMemo(() =>
    useGoogle
      ? googleTileUrl(tileX, tileY, zoom, googleSession!, apiKey)
      : esriTileUrl(tileX, tileY, zoom)
  , [tileX, tileY, zoom, useGoogle, googleSession, apiKey])

  useEffect(() => {
    let alive = true
    heightsApplied.current = false
    loadSatTile(satUrl)
      .then(tex => { if (alive) setTexture(tex) })
      .catch(() => {})
    loadTerrainHeights(tileX, tileY, zoom)
      .then(h   => { if (alive) setHeights(h) })
      .catch(() => {})
    return () => { alive = false }
  }, [satUrl, tileX, tileY, zoom])

  useEffect(() => {
    if (!meshRef.current || !heights || heightsApplied.current) return
    const geo  = meshRef.current.geometry as THREE.PlaneGeometry
    const pos  = geo.attributes.position as THREE.BufferAttribute
    const verts = TERRAIN_SEGMENTS + 1
    for (let row = 0; row < verts; row++) {
      for (let col = 0; col < verts; col++) {
        pos.setZ(row * verts + col, heights[row * verts + col])
      }
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    heightsApplied.current = true
  }, [heights])

  const { position, size } = useMemo(() => {
    const bounds    = tileBounds(tileX, tileY, zoom)
    const centerLat = (bounds.north + bounds.south) / 2
    const centerLon = (bounds.west  + bounds.east)  / 2
    const { x, z }  = latLonToWorld(centerLat, centerLon, refLat, refLon)
    return { position: [x, 0, z] as [number, number, number], size: tileSizeMeters(refLat, zoom) }
  }, [tileX, tileY, zoom, refLat, refLon])

  if (!texture) return null

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, TERRAIN_SEGMENTS, TERRAIN_SEGMENTS]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} envMapIntensity={0.2} />
    </mesh>
  )
}

interface SatelliteTilesProps {
  lat: number; lon: number; googleSession: string | null
}

export function SatelliteTiles({ lat, lon, googleSession }: SatelliteTilesProps) {
  const { camera } = useThree()
  const [zoom, setZoom] = useState(14)
  const prevAlt = useRef(0)

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
          tileX={x} tileY={y} zoom={zoom}
          refLat={lat} refLon={lon}
          googleSession={googleSession}
        />
      ))}
    </group>
  )
}
