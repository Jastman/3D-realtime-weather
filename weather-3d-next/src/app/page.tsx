'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/store/useAppStore'
import { useWeather } from '@/hooks/useWeather'
import { TopBar } from '@/components/ui/TopBar'
import { WeatherSidebar } from '@/components/ui/WeatherSidebar'
import { ControlPanel } from '@/components/ui/ControlPanel'
import { findInterestingWeather, type WeatherSpotlight } from '@/utils/weatherHunter'
import type { CameraControllerHandle } from '@/components/scene/CameraController'

const WeatherScene = dynamic(
  () => import('@/components/scene/WeatherScene').then(m => m.WeatherScene),
  { ssr: false }
)

async function fetchGoogleSession(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://tile.googleapis.com/v1/createSession?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapType: 'satellite', language: 'en-US', region: 'US' }) }
    )
    if (!res.ok) return null
    return (await res.json()).session ?? null
  } catch { return null }
}

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

export default function Home() {
  const { setLocation } = useAppStore()
  const cameraRef = useRef<CameraControllerHandle>(null)
  const [googleSession, setGoogleSession] = useState<string | null>(null)
  const [quality,       setQuality]       = useState<'low' | 'medium' | 'high'>('medium')
  const [spotlight,     setSpotlight]     = useState<WeatherSpotlight | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useWeather()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Current Location', country: '' }),
        ()  => setLocation({ lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' }),
        { timeout: 5000 }
      )
    } else {
      setLocation({ lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' })
    }
  }, [setLocation])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!key) return
    fetchGoogleSession(key).then(setGoogleSession)
  }, [])

  const handleWildWeather = useCallback(async (): Promise<WeatherSpotlight | null> => {
    const spot = await findInterestingWeather()
    setLocation({ lat: spot.lat, lon: spot.lon, city: spot.city, country: spot.country })
    setSpotlight(spot)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setSpotlight(null), 6000)
    return spot
  }, [setLocation])

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a1a' }}>
      <WeatherScene ref={cameraRef} googleSession={googleSession} quality={quality} />
      <TopBar cameraRef={cameraRef} onWildWeather={handleWildWeather} />
      <WeatherSidebar />
      <ControlPanel quality={quality} onQualityChange={setQuality} />

      {spotlight && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-black/80 backdrop-blur-xl text-white px-6 py-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 min-w-72">
            <span className="text-3xl">{weatherIcon(spotlight.weatherCode)}</span>
            <div>
              <div className="font-bold text-base leading-tight">{spotlight.label}</div>
              <div className="text-white/70 text-sm">{spotlight.city}, {spotlight.country}</div>
              <div className="text-white/50 text-xs mt-0.5">{spotlight.description}</div>
            </div>
            <button
              onClick={() => setSpotlight(null)}
              className="ml-auto text-white/40 hover:text-white text-xl leading-none pl-2"
            >
              {'\u00d7'}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
