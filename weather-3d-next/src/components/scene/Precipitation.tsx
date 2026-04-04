'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

const RAIN_COUNT = 4000, SNOW_COUNT = 2000, SPAWN_RANGE = 300, RAIN_HEIGHT = 400, SNOW_HEIGHT = 300

function makeRainTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 4; canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, 32)
  g.addColorStop(0,   'rgba(180,210,255,0)')
  g.addColorStop(0.3, 'rgba(180,210,255,0.9)')
  g.addColorStop(1,   'rgba(180,210,255,0.2)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 4, 32)
  return new THREE.CanvasTexture(canvas)
}

export function Rain({ params }: { params: SceneParams }) {
  const intensity = params.rainIntensity
  const meshRef   = useRef<THREE.InstancedMesh>(null)
  const dummy     = useMemo(() => new THREE.Object3D(), [])
  const rainTex   = useMemo(() => makeRainTexture(), [])
  const { camera } = useThree()
  const positions = useMemo(() => Array.from({ length: RAIN_COUNT }, () => ({
    x: (Math.random() - 0.5) * SPAWN_RANGE * 2,
    y: Math.random() * RAIN_HEIGHT,
    z: (Math.random() - 0.5) * SPAWN_RANGE * 2,
    spd: 80 + Math.random() * 40,
  })), [])

  useFrame((_, delta) => {
    if (!meshRef.current || intensity < 0.01) return
    const tilt = new THREE.Euler(Math.atan2(params.windZ, 80) * 0.5, 0, -Math.atan2(params.windX, 80) * 0.5)
    positions.forEach((p, i) => {
      p.y -= p.spd * delta; p.x += params.windX * delta * 0.3; p.z += params.windZ * delta * 0.3
      if (p.y < 0) { p.y = RAIN_HEIGHT; p.x = camera.position.x + (Math.random() - 0.5) * SPAWN_RANGE * 2; p.z = camera.position.z + (Math.random() - 0.5) * SPAWN_RANGE * 2 }
      dummy.position.set(p.x, p.y, p.z); dummy.rotation.copy(tilt); dummy.scale.set(0.15, 4, 0.15); dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.count = Math.round(RAIN_COUNT * intensity)
  })

  if (intensity < 0.01) return null
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={rainTex} transparent opacity={0.5 * intensity} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} side={THREE.DoubleSide} />
    </instancedMesh>
  )
}

function makeSnowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, 'rgba(240,248,255,1)'); g.addColorStop(0.5, 'rgba(230,240,255,0.8)'); g.addColorStop(1, 'rgba(220,235,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
}

export function Snow({ params }: { params: SceneParams }) {
  const intensity = params.snowIntensity
  const meshRef   = useRef<THREE.InstancedMesh>(null)
  const dummy     = useMemo(() => new THREE.Object3D(), [])
  const snowTex   = useMemo(() => makeSnowTexture(), [])
  const { camera } = useThree()
  const particles = useMemo(() => Array.from({ length: SNOW_COUNT }, () => ({
    x: (Math.random() - 0.5) * SPAWN_RANGE * 2, y: Math.random() * SNOW_HEIGHT,
    z: (Math.random() - 0.5) * SPAWN_RANGE * 2, spd: 3 + Math.random() * 4,
    wobble: Math.random() * Math.PI * 2, sz: 3 + Math.random() * 6,
  })), [])

  useFrame((_, delta) => {
    if (!meshRef.current || intensity < 0.01) return
    particles.forEach((p, i) => {
      p.y -= p.spd * delta; p.wobble += delta * 0.8
      p.x += Math.sin(p.wobble) * 0.5 * delta + params.windX * delta * 0.1
      p.z += Math.cos(p.wobble) * 0.5 * delta + params.windZ * delta * 0.1
      if (p.y < 0) { p.y = SNOW_HEIGHT; p.x = camera.position.x + (Math.random() - 0.5) * SPAWN_RANGE * 2; p.z = camera.position.z + (Math.random() - 0.5) * SPAWN_RANGE * 2 }
      dummy.position.set(p.x, p.y, p.z); dummy.scale.setScalar(p.sz); dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.count = Math.round(SNOW_COUNT * intensity)
  })

  if (intensity < 0.01) return null
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={snowTex} transparent opacity={0.8 * intensity} depthWrite={false} side={THREE.DoubleSide} fog={false} />
    </instancedMesh>
  )
}
