import { useRef, useEffect } from 'react'
import { EffectComposer } from '@react-three/postprocessing'
import { Clouds, CloudLayer } from '@takram/three-clouds/r3f'
import { AerialPerspective } from '@takram/three-atmosphere/r3f'

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
    <EffectComposer enableNormalPass>
      <Clouds
        ref={cloudsRef}
        qualityPreset={qualityPreset}
        coverage={coverage}
        turbulenceDisplacement={turbulenceDisplacement}
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
