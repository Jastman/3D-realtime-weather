'use client'
import { useState, useRef, KeyboardEvent } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { geocodeCity } from '@/hooks/useWeather'
import type { CameraControllerHandle } from '@/components/scene/CameraController'

function weatherIcon(code: number): string {
  if (code === 0) return '☀️'; if (code <= 2) return '🌤️'; if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'; if (code <= 79) return '❄️'; if (code <= 82) return '🌦️'
  if (code <= 99) return '⛈️'; return '🌡️'
}

export function TopBar({ cameraRef }: { cameraRef: React.RefObject<CameraControllerHandle | null> }) {
  const { location, weather, tempUnit, setLocation, setTempUnit } = useAppStore()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    const q = query.trim(); if (!q) return
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
      pos => { setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Current Location', country: '' }); cameraRef.current?.flyTo(0, 0, 300); setLoading(false) },
      () => { setError('Location denied'); setLoading(false) }
    )
  }

  const tempC = weather?.temp ?? null
  const tempF = tempC !== null ? tempC * 9/5 + 32 : null
  const displayTemp = tempUnit === 'F' ? (tempF !== null ? `${Math.round(tempF)}\u00b0F` : '\u2014') : (tempC !== null ? `${Math.round(tempC)}\u00b0C` : '\u2014')

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 bg-black/40 backdrop-blur-md border-b border-white/10">
      <span className="text-white font-bold text-lg tracking-tight shrink-0">\u26c5 WeatherViz</span>
      <div className="flex flex-1 max-w-md items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5 border border-white/20">
        <input className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none" placeholder="Search city\u2026" value={query}
          onChange={e => { setQuery(e.target.value); setError(null) }}
          onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && search()} />
        <button onClick={search} disabled={loading} className="text-white/70 hover:text-white text-sm px-2 transition-colors">{loading ? '\u2026' : '\ud83d\udd0d'}</button>
      </div>
      <button onClick={geolocate} title="Use my location" className="text-white/70 hover:text-white text-lg transition-colors">\ud83d\udccd</button>
      {weather && (
        <div className="flex items-center gap-3 ml-auto text-white/90 text-sm">
          <span className="text-xl">{weatherIcon(weather.weatherCode)}</span>
          <div>
            <div className="font-semibold leading-none">{displayTemp}</div>
            <div className="text-white/60 text-xs">{location.city}{location.country ? `, ${location.country}` : ''}</div>
          </div>
          <div className="hidden sm:block text-white/60 text-xs">
            <div>\ud83d\udca8 {Math.round(weather.windSpeed)} km/h</div>
            <div>\ud83d\udca7 {weather.humidity}%</div>
          </div>
          <div className="text-white/50 text-xs">{weather.description}</div>
        </div>
      )}
      <button onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')} className="text-white/60 hover:text-white text-xs border border-white/20 rounded px-2 py-1 transition-colors">\u00b0{tempUnit === 'C' ? 'F' : 'C'}</button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
