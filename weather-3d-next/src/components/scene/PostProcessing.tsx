'use client'
/**
 * PostProcessing - composable post-process effects driven by scene params.
 *
 * Low:    no effects at all (raw render, max performance)
 * Medium: bloom + vignette + subtle chromatic aberration
 * High:   4x MSAA + large bloom + strong chromatic aberration with radial modulation
 */
import { useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, BrightnessContrast, HueSaturation, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import type { SceneParams } from '@/types'

function CoreEffects({ params, kernelSize }: { params: SceneParams; kernelSize: KernelSize }) {
  return (
    <>
      <Bloom
        intensity={params.bloomStrength}
        kernelSize={kernelSize}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.15}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        offset={params.vignetteIntensity * 0.25 + 0.35}
        darkness={params.vignetteIntensity * 0.4 + 0.25}
        blendFunction={BlendFunction.NORMAL}
      />
      <BrightnessContrast brightness={params.brightness - 1} contrast={0.05} />
      <HueSaturation hue={0} saturation={params.saturation - 1} />
    </>
  )
}

export function PostProcessing({ params, quality }: { params: SceneParams; quality: 'low' | 'medium' | 'high' }) {
  const aberrationMed  = useMemo(() => new THREE.Vector2(0.0008, 0.0008), [])
  const aberrationHigh = useMemo(() => new THREE.Vector2(0.0022, 0.0022), [])

  if (quality === 'low') return null

  if (quality === 'medium') {
    return (
      <EffectComposer multisampling={0}>
        <CoreEffects params={params} kernelSize={KernelSize.MEDIUM} />
        <ChromaticAberration offset={aberrationMed} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={4}>
      <CoreEffects params={params} kernelSize={KernelSize.LARGE} />
      <ChromaticAberration offset={aberrationHigh} blendFunction={BlendFunction.NORMAL} radialModulation />
    </EffectComposer>
  )
}
