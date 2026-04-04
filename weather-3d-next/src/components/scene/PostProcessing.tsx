'use client'
import { useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, BrightnessContrast, HueSaturation, ChromaticAberration, SSAO } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

function BaseEffects({ params }: { params: SceneParams }) {
  return (
    <>
      <Bloom intensity={params.bloomStrength} kernelSize={KernelSize.MEDIUM} luminanceThreshold={0.8} luminanceSmoothing={0.2} blendFunction={BlendFunction.ADD} />
      <Vignette offset={params.vignetteIntensity * 0.3 + 0.3} darkness={params.vignetteIntensity * 0.5 + 0.3} blendFunction={BlendFunction.NORMAL} />
      <BrightnessContrast brightness={params.brightness - 1} contrast={0} />
      <HueSaturation hue={0} saturation={params.saturation - 1} />
    </>
  )
}

function LowQuality({ params }: { params: SceneParams }) {
  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={params.bloomStrength} kernelSize={KernelSize.SMALL} luminanceThreshold={0.8} luminanceSmoothing={0.2} blendFunction={BlendFunction.ADD} />
      <Vignette offset={params.vignetteIntensity * 0.3 + 0.3} darkness={params.vignetteIntensity * 0.5 + 0.3} blendFunction={BlendFunction.NORMAL} />
      <BrightnessContrast brightness={params.brightness - 1} contrast={0} />
      <HueSaturation hue={0} saturation={params.saturation - 1} />
    </EffectComposer>
  )
}

function MediumQuality({ params }: { params: SceneParams }) {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])
  return (
    <EffectComposer multisampling={0}>
      <BaseEffects params={params} />
      <ChromaticAberration offset={aberrationOffset} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

function HighQuality({ params }: { params: SceneParams }) {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0005, 0.0005), [])
  const ssaoColor = useMemo(() => new THREE.Color('black'), [])
  return (
    <EffectComposer multisampling={4}>
      <SSAO blendFunction={BlendFunction.MULTIPLY} samples={16} radius={0.05} intensity={1.0} luminanceInfluence={0.6} color={ssaoColor} worldDistanceThreshold={0.97} worldDistanceFalloff={0.03} worldProximityThreshold={0.0005} worldProximityFalloff={0.001} />
      <BaseEffects params={params} />
      <ChromaticAberration offset={aberrationOffset} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}

export function PostProcessing({ params, quality }: { params: SceneParams; quality: 'low' | 'medium' | 'high' }) {
  if (quality === 'high')   return <HighQuality   params={params} />
  if (quality === 'medium') return <MediumQuality params={params} />
  return <LowQuality params={params} />
}
