'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

interface SkyAtmosphereProps { params: SceneParams }

export function SkyAtmosphere({ params }: SkyAtmosphereProps) {
  const sunLightRef = useRef<THREE.DirectionalLight>(null)
  const ambientRef  = useRef<THREE.AmbientLight>(null)

  const elRad = (params.sunElevation * Math.PI) / 180
  const azRad = (params.sunAzimuth   * Math.PI) / 180
  const sunX = Math.cos(elRad) * Math.sin(azRad)
  const sunY = Math.sin(elRad)
  const sunZ = Math.cos(elRad) * Math.cos(azRad)
  const phi   = Math.PI / 2 - elRad
  const theta = azRad

  const horizonFactor = Math.max(0, 1 - Math.abs(params.sunElevation) / 20)
  const sunColor = new THREE.Color().setHSL(
    0.08 - horizonFactor * 0.04,
    0.8 - params.sunElevation / 90 * 0.6,
    0.5 + params.sunElevation / 90 * 0.4
  )

  useFrame(() => {
    if (sunLightRef.current) {
      sunLightRef.current.intensity = params.sunIntensity * Math.max(0, sunY) * 3
      sunLightRef.current.color.copy(sunColor)
      sunLightRef.current.position.set(sunX * 1000, sunY * 1000, sunZ * 1000)
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = params.ambientIntensity
      const nightBlue = new THREE.Color(0.05, 0.05, 0.15)
      const dayWarm   = new THREE.Color(0.9, 0.85, 0.8)
      ambientRef.current.color.lerpColors(nightBlue, dayWarm, Math.max(0, sunY))
    }
  })

  const isNight = sunY < -0.05
  const isDusk  = sunY > -0.05 && sunY < 0.1

  return (
    <>
      <Sky
        distance={450_000}
        sunPosition={[sunX, sunY, sunZ]}
        inclination={phi / Math.PI}
        azimuth={theta / (2 * Math.PI)}
        turbidity={params.turbidity}
        rayleigh={params.rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      {(isNight || isDusk) && (
        <Stars radius={200} depth={50} count={3000} factor={isDusk ? 2 : 4} saturation={0} fade speed={0.3} />
      )}
      <directionalLight
        ref={sunLightRef}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={3000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-bias={-0.001}
      />
      <ambientLight ref={ambientRef} />
      <fogExp2 attach="fog" args={[params.fogColor, params.fogDensity]} />
    </>
  )
}
