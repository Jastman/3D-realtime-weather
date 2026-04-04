'use client'
/**
 * PostProcessing — composable post-process effects driven by scene params.
 *
 * High quality uses 4x MSAA + chromatic aberration (SSAO removed — requires
 * NormalPass setup that conflicts with the forward-rendering satellite tiles).
 * Medium: standard bloom/vignette + chromatic aberration.
 * Low: lightweight bloom/vignette only.
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
  const aberration = useMemo(() => new THREE.Vector2(0.0004, 0.0004), [])

  if (quality === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <CoreEffects params={params} kernelSize={KernelSize.SMALL} />
      </EffectComposer>
    )
  }

  if (quality === 'medium') {
    return (
      <EffectComposer multisampling={0}>
        <CoreEffects params={params} kernelSize={KernelSize.MEDIUM} />
        <ChromaticAberration offset={aberration} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    )
  }

  // High — 4x MSAA + larger bloom kernel + chromatic aberration
  return (
    <EffectComposer multisampling={4}>
      <CoreEffects params={params} kernelSize={KernelSize.LARGE} />
      <ChromaticAberration offset={aberration} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}
