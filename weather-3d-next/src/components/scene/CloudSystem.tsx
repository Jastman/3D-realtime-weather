'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

function makeCloudTexture(size = 256): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0,    'rgba(255,255,255,0.98)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.90)')
  gradient.addColorStop(0.5,  'rgba(255,255,255,0.65)')
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.25)')
  gradient.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  // Add wisps
  ctx.globalAlpha = 0.35
  for (let i = 0; i < 10; i++) {
    const x = size * (0.15 + Math.random() * 0.7)
    const y = size * (0.15 + Math.random() * 0.7)
    const r = size * (0.08 + Math.random() * 0.18)
    const g2 = ctx.createRadialGradient(x, y, 0, x, y, r)
    g2.addColorStop(0, 'rgba(255,255,255,0.7)')
    g2.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g2
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
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
  const baseCount = Math.round(cov * 60)
  if (params.cloudType === 'cirrus') return [{
    count: Math.max(10, baseCount),
    altitude: params.cloudAltitude * 1.5, spread: 8000,
    scale: [1500, 4000], opacity: Math.max(0.15, cov * 0.5),
  }]
  if (params.cloudType === 'stratus') return [{
    count: Math.max(8, Math.round(cov * 30)),
    altitude: params.cloudAltitude, spread: 6000,
    scale: [1000, 3000], opacity: Math.max(0.3, cov * 0.85),
  }]
  // cumulus / storm — multi-layer puffs
  const layers: CloudLayerConfig[] = [{
    count: Math.max(10, Math.round(baseCount * 0.7)),
    altitude: params.cloudAltitude, spread: 6000,
    scale: [500, 1500], opacity: Math.max(0.4, cov * 0.9),
  }]
  if (cov > 0.35) layers.push({
    count: Math.max(5, Math.round(baseCount * 0.3)),
    altitude: params.cloudAltitude * 1.4, spread: 4000,
    scale: [700, 2000], opacity: Math.max(0.25, cov * 0.65),
  })
  return layers
}

function CloudLayer({ config, params, cloudTex }: { config: CloudLayerConfig; params: SceneParams; cloudTex: THREE.Texture }) {
  const meshRef  = useRef<THREE.InstancedMesh>(null)
  const timeRef  = useRef(0)
  const { camera } = useThree()

  const instances = useMemo(() => Array.from({ length: config.count }, () => ({
    x:     (Math.random() - 0.5) * config.spread * 2,
    z:     (Math.random() - 0.5) * config.spread * 2,
    scale: config.scale[0] + Math.random() * (config.scale[1] - config.scale[0]),
    speed: 0.4 + Math.random() * 0.6,
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
      // Spherical billboard — always face camera so visible from any angle
      dummy.lookAt(camera.position)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, config.count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={cloudTex}
        transparent
        opacity={config.opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        fog={false}
        blending={THREE.NormalBlending}
      />
    </instancedMesh>
  )
}

export function CloudSystem({ params }: { params: SceneParams }) {
  const cloudTex = useMemo(() => makeCloudTexture(256), [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const layers = useMemo(() => getLayerConfigs(params), [params.cloudCoverage, params.cloudType, params.cloudAltitude])
  return (
    <group>
      {layers.map((cfg, i) => <CloudLayer key={i} config={cfg} params={params} cloudTex={cloudTex} />)}
    </group>
  )
}
