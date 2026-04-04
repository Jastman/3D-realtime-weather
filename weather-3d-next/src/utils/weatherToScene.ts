import type { WeatherData, SceneParams } from '@/types'
import { sunPosition } from './geo'

export function weatherDescription(code: number): string {
  if (code === 0)  return 'Clear Sky'
  if (code <= 3)   return 'Partly Cloudy'
  if (code <= 19)  return 'Fog'
  if (code <= 49)  return 'Drizzle'
  if (code <= 59)  return 'Drizzle'
  if (code <= 69)  return 'Rain'
  if (code <= 79)  return 'Snow'
  if (code <= 84)  return 'Rain Showers'
  if (code <= 86)  return 'Snow Showers'
  if (code <= 99)  return 'Thunderstorm'
  return 'Unknown'
}

function cloudTypeFromCode(code: number): SceneParams['cloudType'] {
  if (code <= 1)  return 'cumulus'
  if (code <= 3)  return 'cumulus'
  if (code <= 49) return 'stratus'
  if (code >= 95) return 'storm'
  return 'cumulus'
}

export function weatherToScene(
  weather: WeatherData,
  lat: number,
  lon: number,
  date: Date = new Date()
): SceneParams {
  const { elevation, azimuth } = sunPosition(date, lat, lon)

  const isStormy  = weather.weatherCode >= 80
  const isRaining = weather.weatherCode >= 51 && weather.weatherCode < 80
  const isSnowing = weather.weatherCode >= 70 && weather.weatherCode < 80
  const isFoggy   = (weather.weatherCode >= 10 && weather.weatherCode < 20) ||
                    (weather.weatherCode >= 40 && weather.weatherCode < 50)

  const overcastFactor = weather.cloudCover / 100

  const turbidity = 2 + overcastFactor * 4 + (isStormy ? 3 : 0) + (isFoggy ? 5 : 0)
  const rayleigh  = 1.0 + overcastFactor * 0.3

  const dayFactor        = Math.max(0, Math.sin((elevation * Math.PI) / 180))
  const sunIntensity     = dayFactor * (1 - overcastFactor * 0.7) * (isStormy ? 0.25 : 1)
  // Higher ambient base so terrain is clearly visible (was 0.12)
  const ambientIntensity = 0.30 + overcastFactor * 0.35 + (isStormy ? 0.1 : 0)

  const fogDensity = isFoggy
    ? 0.0015 + overcastFactor * 0.001
    : isStormy
    ? 0.0008
    : overcastFactor * 0.00008
  const fogColor = isStormy ? '#4a5568' : overcastFactor > 0.7 ? '#8fa0b4' : '#c8d8e8'

  const cloudCoverage = weather.cloudCover / 100
  const cloudSpeed    = 0.3 + (weather.windSpeed / 50) * 2 + (isStormy ? 1.5 : 0)
  const cloudAltitude = isStormy ? 600 : overcastFactor > 0.7 ? 500 : 800

  const rainIntensity = isRaining
    ? Math.min(1, weather.precipitation * 0.5 + 0.3)
    : isStormy ? 0.8 : 0
  const snowIntensity = isSnowing ? Math.min(1, weather.precipitation * 0.6 + 0.2) : 0

  const windRad = ((weather.windDirection - 180) * Math.PI) / 180
  const windX   = Math.sin(windRad) * weather.windSpeed / 3.6
  const windZ   = Math.cos(windRad) * weather.windSpeed / 3.6

  const bloomStrength     = 0.15 + dayFactor * (isStormy ? 0.05 : 0.3)
  const vignetteIntensity = isStormy ? 0.5 : overcastFactor * 0.2 + 0.1
  const saturation        = isStormy ? 0.75 : isFoggy ? 0.88 : 1.05
  const brightness        = 0.85 + dayFactor * 0.25 - overcastFactor * 0.12

  return {
    sunElevation: elevation,
    sunAzimuth: azimuth,
    turbidity: Math.min(16, turbidity),
    rayleigh,
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
