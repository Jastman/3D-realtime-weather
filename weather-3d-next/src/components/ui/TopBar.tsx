'use client'
import { useState, KeyboardEvent } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { geocodeCity } from '@/hooks/useWeather'
import type { CameraControllerHandle } from '@/components/scene/CameraController'
import type { WeatherSpotlight } from '@/utils/weatherHunter'

function weatherIcon(code: number): string {
  if (code === 0) return String.fromCodePoint(0x2600, 0xFE0F)
  if (code <= 2)  return String.fromCodePoint(0x1F324, 0xFE0F)
  if (code <= 49) return String.fromCodePoint(0x1F32B, 0xFE0F)
  if (code <= 69) return String.fromCodePoint(0x1F327, 0xFE0F)
  if (code <= 79) return String.fromCodePoint(0x2744, 0xFE0F)
  if (code <= 82) return String.fromCodePoint(0x1F326, 0xFE0F)
  if (code <= 99) return String.fromCodePoint(0x26C8, 0xFE0F)
  return String.fromCodePoint(0x1F321, 0xFE0F)
}

interface TopBarProps {
  cameraRef: React.RefObject<CameraControllerHandle | null>
  onWildWeather: () => Promise<WeatherSpotlight | null>
}

export function TopBar({ cameraRef, onWildWeather }: TopBarProps) {
  const { location, weather, tempUnit, setLocation, setTempUnit } = useAppStore()
  const [query,       setQuery]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [wildLoading, setWildLoading] = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  async function search() {
    const q = query.trim()
    if (!q) return
    setLoading(true); setError(null)
    try {
      const result = await geocodeCity(q)
      if (!result) { setError('City not found'); return }
      setLocation({ lat: result.lat, lon: result.lon, city: result.city, country: result.country })
      cameraRef.current?.flyTo(0, 0, 300)
    } catch { setError('Search failed') }
    finally { setLoading(false); setQuery('') }
  }

  function geolocate() {
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Current Location', country: '' })
        cameraRef.current?.flyTo(0, 0, 300)
        setLoading(false)
      },
      () => { setError('Location denied'); setLoading(false) }
    )
  }

  async function handleWildWeather() {
    setWildLoading(true); setError(null)
    try {
      await onWildWeather()
      cameraRef.current?.flyTo(0, 0, 500)
    } catch { setError('Wild weather failed') }
    finally { setWildLoading(false) }
  }

  const tempC = weather?.temp ?? null
  const tempF = tempC !== null ? tempC * 9/5 + 32 : null
  const displayTemp = tempUnit === 'F'
    ? (tempF !== null ? `${Math.round(tempF)}\u00b0F` : '\u2014')
    : (tempC !== null ? `${Math.round(tempC)}\u00b0C` : '\u2014')

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md border-b border-white/10">
      <span className="text-white font-bold text-lg tracking-tight shrink-0">
        {String.fromCodePoint(0x26C5)} WeatherViz
      </span>

      <div className="flex flex-1 max-w-md items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
        <input
          className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
          placeholder="Search city..."
          value={query}
          onChange={e => { setQuery(e.target.value); setError(null) }}
          onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && search()}
        />
        <button onClick={search} disabled={loading} className="text-white/70 hover:text-white text-sm px-2 transition-colors">
          {loading ? '...' : String.fromCodePoint(0x1F50D)}
        </button>
      </div>

      <button onClick={geolocate} title="Use my location" className="text-white/70 hover:text-white text-lg transition-colors">
        {String.fromCodePoint(0x1F4CD)}
      </button>

      <button
        onClick={handleWildWeather}
        disabled={wildLoading}
        title="Find most dramatic weather happening right now"
        className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500/90 hover:to-blue-500/90 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 transition-all whitespace-nowrap"
      >
        {wildLoading ? '...' : `${String.fromCodePoint(0x1F32A, 0xFE0F)} Wild Weather`}
      </button>

      {weather && (
        <div className="flex items-center gap-3 ml-auto text-white/90 text-sm">
          <span className="text-xl">{weatherIcon(weather.weatherCode)}</span>
          <div>
            <div className="font-semibold leading-none">{displayTemp}</div>
            <div className="text-white/60 text-xs">
              {location.city}{location.country ? `, ${location.country}` : ''}
            </div>
          </div>
          <div className="hidden sm:block text-white/60 text-xs">
            <div>{String.fromCodePoint(0x1F4A8)} {Math.round(weather.windSpeed)} km/h</div>
            <div>{String.fromCodePoint(0x1F4A7)} {weather.humidity}%</div>
          </div>
          <div className="text-white/50 text-xs">{weather.description}</div>
        </div>
      )}

      <button
        onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
        className="text-white/60 hover:text-white text-xs border border-white/20 rounded px-2 py-1 transition-colors"
      >
        {'\u00b0'}{tempUnit === 'C' ? 'F' : 'C'}
      </button>

      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
