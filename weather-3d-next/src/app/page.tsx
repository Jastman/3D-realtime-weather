'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAppStore } from '@/store/useAppStore'
import { useWeather } from '@/hooks/useWeather'
import { TopBar } from '@/components/ui/TopBar'
import { WeatherSidebar } from '@/components/ui/WeatherSidebar'
import { ControlPanel } from '@/components/ui/ControlPanel'
import type { CameraControllerHandle } from '@/components/scene/CameraController'

const WeatherScene = dynamic(
  () => import('@/components/scene/WeatherScene').then(m => m.WeatherScene),
  { ssr: false }
)

async function fetchGoogleSession(apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(`https://tile.googleapis.com/v1/createSession?key=${apiKey}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mapType: 'satellite', language: 'en-US', region: 'US' }),
    })
    if (!res.ok) return null
    return (await res.json()).session ?? null
  } catch { return null }
}

export default function Home() {
  const { setLocation } = useAppStore()
  const cameraRef = useRef<CameraControllerHandle>(null)
  const [googleSession, setGoogleSession] = useState<string | null>(null)
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium')

  useWeather()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Current Location', country: '' }),
        () => setLocation({ lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' }),
        { timeout: 5000 }
      )
    } else {
      setLocation({ lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' })
    }
  }, [setLocation])

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (key) fetchGoogleSession(key).then(setGoogleSession)
  }, [])

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a1a' }}>
      <WeatherScene ref={cameraRef} googleSession={googleSession} quality={quality} />
      <TopBar cameraRef={cameraRef} />
      <WeatherSidebar />
      <ControlPanel quality={quality} onQualityChange={setQuality} />
    </main>
  )
}
