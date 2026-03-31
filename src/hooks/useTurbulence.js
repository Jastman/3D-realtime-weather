import { useMemo } from 'react'
import { calculateTurbulence, turbulenceLabel, mapCloudCoverage } from '../utils/weatherMapping'

/**
 * Derives turbulence and cloud parameters from live weather data.
 *
 * turbulence          0–1 intensity
 * turbulenceDisplacement  meters passed to <Clouds turbulenceDisplacement>
 * cloudCoverage       0–1 passed to <Clouds coverage>
 * windDriftX/Y        UV offset per second for cloud animation
 */
export function useTurbulence(weather) {
  return useMemo(() => {
    if (!weather) {
      return {
        turbulence: 0.1,
        turbulenceDisplacement: 20,
        cloudCoverage: 0.3,
        windDriftX: 0,
        windDriftY: 0,
        label: 'Calm',
        color: '#22c55e',
      }
    }

    const { windSpeed, windDir, cloudCover, weatherCode } = weather
    const turbulence = calculateTurbulence(windSpeed, weatherCode)
    const { label, color } = turbulenceLabel(turbulence)
    const cloudCoverage = mapCloudCoverage(cloudCover, weatherCode)

    // Turbulence displacement in meters: calm=0, extreme=250m
    const turbulenceDisplacement = turbulence * 250

    // Convert wind direction (meteorological: 0=from N, 90=from E) to UV drift.
    // Meteorological direction = where wind comes FROM, so clouds drift in the opposite direction.
    const windRadMath = ((270 - windDir) * Math.PI) / 180
    // UV drift per second (scaled for visual effect at cloud texture scale)
    const driftSpeed = (windSpeed / 3600) * 0.000004
    const windDriftX = Math.cos(windRadMath) * driftSpeed
    const windDriftY = Math.sin(windRadMath) * driftSpeed

    return {
      turbulence,
      turbulenceDisplacement,
      cloudCoverage,
      windDriftX,
      windDriftY,
      label,
      color,
    }
  }, [weather])
}
