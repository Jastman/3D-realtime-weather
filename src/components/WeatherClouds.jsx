import { useRef, useEffect, useContext, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, EffectComposerContext } from '@react-three/postprocessing'
import { Clouds, CloudLayer } from '@takram/three-clouds/r3f'
import { AerialPerspective } from '@takram/three-atmosphere/r3f'
import { Data3DTexture, RedFormat, LinearFilter, RepeatWrapping, NoColorSpace } from 'three'

// Use locally bundled cloud assets to avoid GitHub LFS external fetches
const BASE = import.meta.env.BASE_URL
const LOCAL_WEATHER_URL = BASE + 'assets/clouds/local_weather.png'
const SHAPE_URL = BASE + 'assets/clouds/shape.bin'
const SHAPE_DETAIL_URL = BASE + 'assets/clouds/shape_detail.bin'
const TURBULENCE_URL = BASE + 'assets/clouds/turbulence.png'

// Generate a simple white-noise STBN fallback (128x128x64, R8).
// The real stbn.bin is spatially blue-distributed for better quality,
// but white noise avoids the banding/blocky artifacts from an empty texture.
function makeNoiseStbn() {
  const w = 128, h = 128, d = 64
  const data = new Uint8Array(w * h * d)
  // Use a simple LCG so the noise is deterministic
  let s = 0xdeadbeef
  for (let i = 0; i < data.length; i++) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    data[i] = s >>> 24
  }
  const tex = new Data3DTexture(data, w, h, d)
  tex.format = RedFormat
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.wrapR = RepeatWrapping
  tex.colorSpace = NoColorSpace
  tex.needsUpdate = true
  return tex
}

const fallbackStbn = makeNoiseStbn()

/**
 * Patch: with multisampling=0, the postprocessing RenderPass tries to blit
 * depth from inputBuffer to a "stable" copy, but fails in some WebGL
 * implementations with GL_INVALID_OPERATION (same attachment).
 *
 * Using useFrame at priority 0 ensures this runs EVERY frame before the
 * EffectComposer renders at priority 1, so the first frame is also covered.
 */
function DepthBugFix() {
  const { composer } = useContext(EffectComposerContext)

  // Priority 0 fires before EffectComposer's useFrame at priority 1
  useFrame(() => {
    if (!composer) return
    for (const pass of composer.passes) {
      if ('needsDepthBlit' in pass) {
        pass.needsDepthBlit = false
      }
    }
  }, 0)

  return null
}

/**
 * Volumetric cloud system driven by live weather data.
 *
 * CRITICAL: Clouds must appear BEFORE AerialPerspective in EffectComposer.
 * AerialPerspective composites atmospheric scattering over the cloud render,
 * so swapping the order breaks the atmosphere completely.
 *
 * Cloud layers:
 *   Channel 'r' → low clouds (stratus/cumulus), 750m–1400m
 *   Channel 'g' → mid clouds (altostratus), 3500m–6000m
 *   Channel 'b' → high cirrus, always present faintly at 9000m
 *
 * Cloud drift uses CloudsEffect.localWeatherVelocity which the library
 * integrates each frame to update localWeatherOffset automatically.
 */
export function WeatherClouds({
  coverage = 0.3,
  turbulenceDisplacement = 0,
  windDriftX = 0,
  windDriftY = 0,
  qualityPreset = 'high',
}) {
  const cloudsRef = useRef()

  // Set wind velocity on the CloudsEffect whenever wind data changes.
  // localWeatherVelocity is a Vector2 (UV/s) integrated by the library each frame.
  useEffect(() => {
    if (!cloudsRef.current) return
    cloudsRef.current.localWeatherVelocity.set(windDriftX, windDriftY)
  }, [windDriftX, windDriftY])

  return (
    <EffectComposer enableNormalPass={false} multisampling={0} stencilBuffer={false}>
      <DepthBugFix />
      <Clouds
        ref={cloudsRef}
        qualityPreset={qualityPreset}
        coverage={coverage}
        turbulenceDisplacement={turbulenceDisplacement}
        localWeatherTexture={LOCAL_WEATHER_URL}
        shapeTexture={SHAPE_URL}
        shapeDetailTexture={SHAPE_DETAIL_URL}
        turbulenceTexture={TURBULENCE_URL}
        stbnTexture={fallbackStbn}
        lightShafts
        haze
        disableDefaultLayers
      >
        {/* Low clouds: stratus / cumulus deck */}
        <CloudLayer
          channel="r"
          altitude={750}
          height={650}
          densityScale={0.22}
          shapeAmount={1}
          shapeDetailAmount={1}
          coverageFilterWidth={0.55}
          shadow
        />
        {/* Mid clouds: altostratus / altocumulus */}
        <CloudLayer
          channel="g"
          altitude={3500}
          height={2500}
          densityScale={0.15}
          shapeAmount={0.85}
          shapeDetailAmount={0.7}
          coverageFilterWidth={0.5}
          shadow
        />
        {/* High cirrus: always present, thin and wispy */}
        <CloudLayer
          channel="b"
          altitude={9000}
          height={500}
          densityScale={0.004}
          shapeAmount={0.4}
          shapeDetailAmount={0}
          coverageFilterWidth={0.4}
          weatherExponent={0.3}
        />
      </Clouds>

      {/* AerialPerspective MUST come after Clouds */}
      <AerialPerspective sky sunLight skyLight />
    </EffectComposer>
  )
}
