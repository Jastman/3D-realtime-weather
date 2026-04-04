'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

function makeCloudTexture(size = 256): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0,   'rgba(255,255,255,0.95)')
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.85)')
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.5)')
  gradient.addColorStop(0.85,'rgba(255,255,255,0.15)')
  gradient.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  ctx.globalAlpha = 0.3
  for (let i = 0; i < 8; i++) {
    const x = size * (0.2 + Math.random() * 0.6)
    const y = size * (0.2 + Math.random() * 0.6)
    const r = size * (0.1 + Math.random() * 0.2)
    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r)
    g2.addColorStop(0, 'rgba(255,255,255,0.6)')
    g2.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g2
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

interface CloudLayerConfig {
  count: number; altitude: number; spread: number
  scale: [number, number]; opacity: number
}

function getLayerConfigs(params: SceneParams): CloudLayerConfig[] {
  const cov = params.cloudCoverage
  if (cov < 0.05) return []
  const baseCount = Math.round(cov * 80)
  if (params.cloudType === 'cirrus') return [{ count: baseCount, altitude: params.cloudAltitude * 1.5, spread: 8000, scale: [1200, 3000], opacity: cov * 0.4 }]
  if (params.cloudType === 'stratus') return [{ count: Math.round(cov * 40), altitude: params.cloudAltitude, spread: 6000, scale: [800, 2500], opacity: cov * 0.85 }]
  const layers: CloudLayerConfig[] = [{ count: Math.round(baseCount * 0.7), altitude: params.cloudAltitude, spread: 7000, scale: [400, 1200], opacity: cov * 0.9 }]
  if (cov > 0.4) layers.push({ count: Math.round(baseCount * 0.3), altitude: params.cloudAltitude * 1.3, spread: 5000, scale: [600, 1800], opacity: cov * 0.6 })
  return layers
}

function CloudLayer({ config, params, cloudTex }: { config: CloudLayerConfig; params: SceneParams; cloudTex: THREE.Texture }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const timeRef = useRef(0)
  const instances = useMemo(() => Array.from({ length: config.count }, () => ({
    x: (Math.random() - 0.5) * config.spread * 2,
    z: (Math.random() - 0.5) * config.spread * 2,
    scale: config.scale[0] + Math.random() * (config.scale[1] - config.scale[0]),
    speed: 0.5 + Math.random() * 0.5,
  })), [config])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const windX = params.windX * params.cloudSpeed
    const windZ = params.windZ * params.cloudSpeed
    instances.forEach((inst, i) => {
      const drift = timeRef.current * inst.speed
      const x = ((inst.x + windX * drift * 0.3) % config.spread + config.spread) % config.spread - config.spread / 2
      const z = ((inst.z + windZ * drift * 0.3) % config.spread + config.spread) % config.spread - config.spread / 2
      dummy.position.set(x, config.altitude, z)
      dummy.scale.setScalar(inst.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, config.count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={cloudTex} transparent opacity={config.opacity} depthWrite={false} side={THREE.DoubleSide} fog={false} blending={THREE.NormalBlending} />
    </instancedMesh>
  )
}

export function CloudSystem({ params }: { params: SceneParams }) {
  const cloudTex = useMemo(() => makeCloudTexture(256), [])
  const layers = useMemo(() => getLayerConfigs(params), [params.cloudCoverage, params.cloudType, params.cloudAltitude])
  return (
    <group>
      {layers.map((cfg, i) => <CloudLayer key={i} config={cfg} params={params} cloudTex={cloudTex} />)}
    </group>
  )
}
