'use client'
import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { WeatherData, HourlyForecast } from '@/types'
import { weatherDescription } from '@/utils/weatherToScene'

/** Fetch current + hourly forecast from Open-Meteo (free, no key) */
export function useWeather() {
  const { location, setWeather, setLoading, setError } = useAppStore()

  const fetch_ = useCallback(async () => {
    if (!location.lat || !location.lon) return
    setLoading(true)

    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast')
      url.searchParams.set('latitude',  location.lat.toFixed(4))
      url.searchParams.set('longitude', location.lon.toFixed(4))
      url.searchParams.set('current', [
        'temperature_2m', 'apparent_temperature', 'cloud_cover',
        'wind_speed_10m', 'wind_direction_10m', 'precipitation',
        'relative_humidity_2m', 'visibility', 'weather_code', 'is_day',
      ].join(','))
      url.searchParams.set('hourly', [
        'temperature_2m', 'weather_code', 'precipitation', 'wind_speed_10m',
      ].join(','))
      url.searchParams.set('forecast_days', '2')
      url.searchParams.set('timezone', 'auto')

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)
      const data = await res.json()
      const c = data.current

      const weather: WeatherData = {
        temp:          c.temperature_2m,
        feelsLike:     c.apparent_temperature,
        cloudCover:    c.cloud_cover,
        windSpeed:     c.wind_speed_10m,
        windDirection: c.wind_direction_10m,
        precipitation: c.precipitation,
        humidity:      c.relative_humidity_2m,
        visibility:    (c.visibility ?? 10_000) / 1000,
        weatherCode:   c.weather_code,
        description:   weatherDescription(c.weather_code),
        isDay:         c.is_day === 1,
        fetchedAt:     new Date(),
      }

      const h = data.hourly
      const now = Date.now()
      const forecast: HourlyForecast[] = (h.time as string[])
        .map((t, i) => ({
          time:        new Date(t),
          temp:        h.temperature_2m[i] as number,
          weatherCode: h.weather_code[i] as number,
          precipitation: h.precipitation[i] as number,
          windSpeed:   h.wind_speed_10m[i] as number,
        }))
        .filter(f => f.time.getTime() >= now - 3_600_000)
        .slice(0, 24)

      setWeather(weather, forecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Weather fetch failed')
    }
  }, [location.lat, location.lon, setWeather, setLoading, setError])

  useEffect(() => {
    fetch_()
    const interval = setInterval(fetch_, 60_000)
    return () => clearInterval(interval)
  }, [fetch_])

  return { refetch: fetch_ }
}

/** City geocoding using Nominatim (free) */
export async function geocodeCity(query: string): Promise<{ lat: number; lon: number; city: string; country: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    if (!data.length) return null
    const r = data[0]
    return {
      lat:     parseFloat(r.lat),
      lon:     parseFloat(r.lon),
      city:    r.name ?? query,
      country: r.address?.country_code?.toUpperCase() ?? '',
    }
  } catch {
    return null
  }
}
