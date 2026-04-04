import type { WeatherData, SceneParams } from '@/types'
import { sunPosition } from './geo'

/** WMO weather code → human-readable description */
export function weatherDescription(code: number): string {
  if (code === 0)              return 'Clear Sky'
  if (code <= 3)               return 'Partly Cloudy'
  if (code <= 9)               return 'Variable Conditions'
  if (code <= 19)              return 'Fog'
  if (code <= 29)              return 'Drizzle'
  if (code <= 39)              return 'Fog'
  if (code <= 49)              return 'Drizzle'
  if (code <= 59)              return 'Drizzle'
  if (code <= 69)              return 'Rain'
  if (code <= 79)              return 'Snow'
  if (code <= 84)              return 'Rain Showers'
  if (code <= 86)              return 'Snow Showers'
  if (code <= 99)              return 'Thunderstorm'
  return 'Unknown'
}

/** Convert WMO code to cloud type for the scene */
function cloudTypeFromCode(code: number): SceneParams['cloudType'] {
  if (code <= 1)   return 'cumulus'
  if (code <= 3)   return 'cumulus'
  if (code <= 49)  return 'stratus'
  if (code >= 95)  return 'storm'
  return 'cumulus'
}

/**
 * Derive 3D scene parameters from live weather data.
 * These drive all the visual elements: sky, clouds, rain, fog, etc.
 */
export function weatherToScene(
  weather: WeatherData,
  lat: number,
  lon: number,
  date: Date = new Date()
): SceneParams {
  const { elevation, azimuth } = sunPosition(date, lat, lon)

  const isStormy   = weather.weatherCode >= 80
  const isRaining  = weather.weatherCode >= 51 && weather.weatherCode < 80
  const isSnowing  = weather.weatherCode >= 70 && weather.weatherCode < 80
  const isFoggy    = (weather.weatherCode >= 10 && weather.weatherCode < 20) ||
                     (weather.weatherCode >= 40 && weather.weatherCode < 50)

  const overcastFactor = weather.cloudCover / 100
  const turbidity = 2 + overcastFactor * 6 + (isStormy ? 4 : 0) + (isFoggy ? 6 : 0)

  const dayFactor    = Math.max(0, Math.sin((elevation * Math.PI) / 180))
  const sunIntensity = dayFactor * (1 - overcastFactor * 0.7) * (isStormy ? 0.2 : 1)
  const ambientIntensity = 0.1 + overcastFactor * 0.3 + (isStormy ? 0.15 : 0)

  const fogBase    = isFoggy ? 0.004 : 0.0008
  const fogDensity = fogBase + overcastFactor * 0.001 + (isStormy ? 0.003 : 0)
  const fogColor = isStormy ? '#4a5568' : overcastFactor > 0.7 ? '#8fa0b4' : '#b8d4e8'

  const cloudCoverage  = weather.cloudCover / 100
  const cloudSpeed     = 0.3 + (weather.windSpeed / 50) * 2 + (isStormy ? 2 : 0)
  const cloudAltitude  = isStormy ? 800 : overcastFactor > 0.7 ? 600 : 900

  const rainIntensity = isRaining
    ? Math.min(1, weather.precipitation * 0.5 + 0.3)
    : isStormy ? 0.8 : 0
  const snowIntensity = isSnowing ? Math.min(1, weather.precipitation * 0.6 + 0.2) : 0

  const windRad = ((weather.windDirection - 180) * Math.PI) / 180
  const windKmsToMs = 1 / 3.6
  const windX  = Math.sin(windRad) * weather.windSpeed * windKmsToMs
  const windZ  = Math.cos(windRad) * weather.windSpeed * windKmsToMs

  const bloomStrength   = dayFactor * (isStormy ? 0.1 : 0.4) + 0.1
  const vignetteIntensity = isStormy ? 0.6 : overcastFactor * 0.3 + 0.1
  const saturation = isStormy ? 0.7 : isFoggy ? 0.85 : 1.0
  const brightness = 0.8 + dayFactor * 0.3 - overcastFactor * 0.15

  return {
    sunElevation: elevation,
    sunAzimuth: azimuth,
    turbidity: Math.min(20, turbidity),
    rayleigh: 1.5 + overcastFactor * 0.5,
    cloudCoverage,
    cloudAltitude,
    cloudSpeed,
    cloudType: cloudTypeFromCode(weather.weatherCode),
    rainIntensity,
    snowIntensity,
    windX,
    windZ,
    ambientIntensity,
    sunIntensity,
    fogDensity,
    fogColor,
    bloomStrength,
    bloomRadius: 0.4,
    vignetteIntensity,
    saturation,
    brightness,
  }
}
