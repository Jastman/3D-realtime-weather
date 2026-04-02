import { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'

import { AtmosphereScene } from './components/AtmosphereScene'
import { Globe } from './components/Globe'
import { WeatherClouds } from './components/WeatherClouds'
import { TurbulenceLayer } from './components/TurbulenceLayer'
import { FlightRoute } from './components/FlightRoute'
import { WeatherPanel } from './components/WeatherPanel'

import { useWeatherData } from './hooks/useWeatherData'
import { useTurbulence } from './hooks/useTurbulence'
import { useFlightRoute } from './hooks/useFlightRoute'

// Default location: New York City
const DEFAULT_LAT = 40.7128
const DEFAULT_LON = -74.006

export default function App() {
  // ── Location: try geolocation, fall back to NYC ──────────────────────────
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON })
  const [locationReady, setLocationReady] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationReady(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLocationReady(true)
      },
      () => {
        // Permission denied or error → use NYC default
        setLocationReady(true)
      },
      { timeout: 8000, maximumAge: 60_000 }
    )
  }, [])

  // ── Live date (drives sun position) ──────────────────────────────────────
  const [currentDate, setCurrentDate] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Weather data from Open-Meteo ──────────────────────────────────────────
  const { weather, loading: weatherLoading } = useWeatherData(
    locationReady ? location.lat : null,
    locationReady ? location.lon : null
  )

  // ── Derived turbulence + cloud params ────────────────────────────────────
  const turbulenceData = useTurbulence(weather)

  // ── UI state ──────────────────────────────────────────────────────────────
  const [qualityPreset, setQualityPreset] = useState('high')
  const [showTurbulenceLayer, setShowTurbulenceLayer] = useState(false)

  // ── Flight route state ────────────────────────────────────────────────────
  const {
    routeMode,
    toggleRouteMode,
    origin,
    destination,
    arcPoints,
    distanceKm,
    handleGlobeClick,
    clearRoute,
  } = useFlightRoute()

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 2e7], far: 1e9, near: 100 }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100vw', height: '100dvh' }}
      >
        <AtmosphereScene lat={location.lat} lon={location.lon} date={currentDate}>
          <Globe routeMode={routeMode} onGlobeClick={handleGlobeClick} />

          <TurbulenceLayer
            turbulence={turbulenceData.turbulence}
            visible={showTurbulenceLayer}
          />

          {arcPoints && (
            <FlightRoute
              arcPoints={arcPoints}
              turbulence={turbulenceData.turbulence}
              distanceKm={distanceKm}
              origin={origin}
              destination={destination}
            />
          )}

          <WeatherClouds
            coverage={turbulenceData.cloudCoverage}
            turbulenceDisplacement={turbulenceData.turbulenceDisplacement}
            windDriftX={turbulenceData.windDriftX}
            windDriftY={turbulenceData.windDriftY}
            qualityPreset={qualityPreset}
          />
        </AtmosphereScene>
      </Canvas>

      {/* DOM overlay — outside Canvas */}
      <WeatherPanel
        weather={weather}
        turbulence={turbulenceData.turbulence}
        turbulenceLabel={turbulenceData.label}
        turbulenceColor={turbulenceData.color}
        location={location}
        showTurbulenceLayer={showTurbulenceLayer}
        onToggleTurbulenceLayer={() => setShowTurbulenceLayer(v => !v)}
        routeMode={routeMode}
        onToggleRouteMode={toggleRouteMode}
        hasRoute={!!(origin && destination)}
        onClearRoute={clearRoute}
        distanceKm={distanceKm}
        qualityPreset={qualityPreset}
        onQualityChange={setQualityPreset}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      {/* Loading splash */}
      {weatherLoading && !weather && (
        <div className="loading-splash">
          <div className="loading-globe">🌍</div>
          <p>Loading weather data…</p>
        </div>
      )}
    </>
  )
}
