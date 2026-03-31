import { useState, useEffect, useRef } from 'react'

const POLL_INTERVAL_MS = 60_000

/**
 * Fetches current weather from Open-Meteo (no API key required).
 * Polls every 60 seconds. Returns null until first successful fetch.
 */
export function useWeatherData(lat, lon) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (lat == null || lon == null) return

    async function fetchWeather() {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setLoading(true)
      try {
        const url = new URL('https://api.open-meteo.com/v1/forecast')
        url.searchParams.set('latitude', lat.toFixed(4))
        url.searchParams.set('longitude', lon.toFixed(4))
        url.searchParams.set(
          'current',
          'temperature_2m,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation,weather_code'
        )
        url.searchParams.set('timezone', 'auto')

        const res = await fetch(url.toString(), { signal: controller.signal })
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)

        const data = await res.json()
        const c = data.current

        setWeather({
          temp: c.temperature_2m,
          cloudCover: c.cloud_cover,        // 0–100 %
          windSpeed: c.wind_speed_10m,      // km/h
          windDir: c.wind_direction_10m,    // degrees meteorological
          precipitation: c.precipitation,   // mm
          weatherCode: c.weather_code,
          timezone: data.timezone,
          fetchedAt: new Date(),
        })
        setError(null)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, POLL_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [lat, lon])

  return { weather, loading, error }
}
