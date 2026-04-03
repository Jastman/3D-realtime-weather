import { useState, useEffect, useRef, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { GlobeLabels } from './components/GlobeLabels'

import { AtmosphereScene } from './components/AtmosphereScene'
import { Globe } from './components/Globe'
import { WeatherClouds } from './components/WeatherClouds'
import { TurbulenceLayer } from './components/TurbulenceLayer'
import { FlightRoute } from './components/FlightRoute'
import { WeatherPanel } from './components/WeatherPanel'

import { useWeatherData } from './hooks/useWeatherData'
import { useTurbulence } from './hooks/useTurbulence'
import { useReverseGeocode } from './hooks/useReverseGeocode'
import { latLonToECEF, ecefToLatLon, computeGreatCircle, haversineDistanceKm } from './utils/greatCircle'

// Default location: New York City
const DEFAULT_LAT = 40.7128
const DEFAULT_LON = -74.006

// 1,000 ft in meters
const INITIAL_ALT = 305

// Earth radius (meters) for altitude calc
const EARTH_R = 6_371_000

// Hide volumetric clouds above this altitude (120 km = orbital view)
const CLOUD_MAX_ALT = 120_000

/**
 * Positions the camera at a 1,000-ft oblique view of the given location.
 * Fires once on mount (NYC default) and once more when geolocation resolves.
 */
function CameraSetup({ lat, lon, ready }) {
  const { camera } = useThree()
  const hasFlown = useRef(false)

  useEffect(() => {
    if (hasFlown.current) return
    if (ready) hasFlown.current = true

    // ~0.003° lat offset @ 305 m → ~30° oblique angle
    const camPos = latLonToECEF(lat + 0.003, lon + 0.002, INITIAL_ALT)
    const lookAt  = latLonToECEF(lat, lon, 0)
    camera.position.set(camPos.x, camPos.y, camPos.z)
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
  }, [lat, lon, camera, ready])

  return null
}

/**
 * Each frame, checks camera altitude above Earth surface.
 * Only triggers a React re-render when crossing the CLOUD_MAX_ALT threshold.
 */
function CameraTracker({ onCloudsVisible }) {
  const { camera } = useThree()
  const lastRef = useRef(null)

  useFrame(() => {
    const alt = camera.position.length() - EARTH_R
    const visible = alt < CLOUD_MAX_ALT
    if (visible !== lastRef.current) {
      lastRef.current = visible
      onCloudsVisible(visible)
    }
  })

  return null
}

export default function App() {
  // ── Location ─────────────────────────────────────────────────────────────
  const [location, setLocation] = useState({ lat: DEFAULT_LAT, lon: DEFAULT_LON })
  const [locationReady, setLocationReady] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) { setLocationReady(true); return }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setLocationReady(true)
      },
      () => setLocationReady(true),
      { timeout: 8000, maximumAge: 60_000 }
    )
  }, [])

  // ── Reverse geocode → city/state/country ─────────────────────────────────
  const locationName = useReverseGeocode(
    locationReady ? location.lat : null,
    locationReady ? location.lon : null
  )

  // ── Live date (drives sun position) ──────────────────────────────────────
  const [currentDate, setCurrentDate] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Weather ───────────────────────────────────────────────────────────────
  const { weather, loading: weatherLoading } = useWeatherData(
    locationReady ? location.lat : null,
    locationReady ? location.lon : null
  )
  const turbulenceData = useTurbulence(weather)

  // ── Label canvas ref (for 2D city labels overlay) ────────────────────────
  const labelCanvasRef = useRef()

  // ── App state ─────────────────────────────────────────────────────────────
  const [qualityPreset, setQualityPreset] = useState('high')
  const [appMode, setAppMode] = useState('weather')   // 'weather' | 'turbulence'
  const [tempUnit, setTempUnit] = useState('F')       // 'F' | 'C'
  const [cloudsVisible, setCloudsVisible] = useState(true)

  // ── Route state (used in turbulence mode) ────────────────────────────────
  const [routeOrigin, setRouteOrigin] = useState(null)
  const [routeDest, setRouteDest]     = useState(null)
  const [routePoints, setRoutePoints] = useState(null)
  const [routeDistKm, setRouteDistKm] = useState(null)

  // Globe-tap route mode (fallback: user taps two points on the globe)
  const [globeTapMode, setGlobeTapMode]   = useState(false)
  const [tapOrigin, setTapOrigin]         = useState(null)
  const [tapDest, setTapDest]             = useState(null)

  const handleGlobeClick = useCallback((ecefPoint) => {
    if (!globeTapMode) return
    const { lat, lon } = ecefToLatLon(ecefPoint)
    if (!tapOrigin) {
      setTapOrigin({ lat, lon })
    } else if (!tapDest) {
      setTapDest({ lat, lon })
      const pts = computeGreatCircle(tapOrigin.lat, tapOrigin.lon, lat, lon, 80, 10_500)
      const dist = haversineDistanceKm(tapOrigin.lat, tapOrigin.lon, lat, lon)
      setRoutePoints(pts)
      setRouteDistKm(dist)
      setGlobeTapMode(false)
    }
  }, [globeTapMode, tapOrigin, tapDest])

  // Called from WeatherPanel when user sets an airport route
  const handleAirportRoute = useCallback((orig, dest, pts, distKm) => {
    setRouteOrigin(orig)
    setRouteDest(dest)
    setRoutePoints(pts)
    setRouteDistKm(distKm)
    setTapOrigin(null)
    setTapDest(null)
  }, [])

  const clearRoute = useCallback(() => {
    setRouteOrigin(null); setRouteDest(null)
    setRoutePoints(null); setRouteDistKm(null)
    setTapOrigin(null);   setTapDest(null)
    setGlobeTapMode(false)
  }, [])

  // Prefer airport route; fall back to tap-drawn route
  const activeOrigin = routeOrigin || tapOrigin
  const activeDest   = routeDest   || tapDest

  return (
    <>
      <Canvas
        camera={{ far: 1e9, near: 1 }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100vw', height: '100dvh' }}
        onCreated={({ camera }) => {
          const camPos = latLonToECEF(DEFAULT_LAT + 0.003, DEFAULT_LON + 0.002, INITIAL_ALT)
          const lookAt  = latLonToECEF(DEFAULT_LAT, DEFAULT_LON, 0)
          camera.position.set(camPos.x, camPos.y, camPos.z)
          camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
        }}
      >
        <CameraSetup lat={location.lat} lon={location.lon} ready={locationReady} />
        <CameraTracker onCloudsVisible={setCloudsVisible} />

        {/* Ambient light ensures the globe is never fully black.
            The atmosphere's SunLight provides directional day/night shading on top. */}
        <ambientLight intensity={0.12} color="#334466" />

        <GlobeLabels canvasRef={labelCanvasRef} />

        <AtmosphereScene lat={location.lat} lon={location.lon} date={currentDate}>
          <Globe routeMode={globeTapMode} onGlobeClick={handleGlobeClick} />

          <TurbulenceLayer
            turbulence={turbulenceData.turbulence}
            visible={appMode === 'turbulence'}
          />

          {routePoints && (
            <FlightRoute
              arcPoints={routePoints}
              turbulence={turbulenceData.turbulence}
              distanceKm={routeDistKm}
              origin={activeOrigin}
              destination={activeDest}
            />
          )}

          {/* Volumetric clouds — only when camera is below 120 km */}
          {cloudsVisible && (
            <WeatherClouds
              coverage={turbulenceData.cloudCoverage}
              turbulenceDisplacement={turbulenceData.turbulenceDisplacement}
              windDriftX={turbulenceData.windDriftX}
              windDriftY={turbulenceData.windDriftY}
              qualityPreset={qualityPreset}
            />
          )}
        </AtmosphereScene>
      </Canvas>

      <WeatherPanel
        weather={weather}
        turbulence={turbulenceData.turbulence}
        turbulenceLabel={turbulenceData.label}
        turbulenceColor={turbulenceData.color}
        location={location}
        locationName={locationName}
        appMode={appMode}
        onAppModeChange={setAppMode}
        tempUnit={tempUnit}
        onTempUnitChange={setTempUnit}
        qualityPreset={qualityPreset}
        onQualityChange={setQualityPreset}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onAirportRoute={handleAirportRoute}
        hasRoute={!!(activeOrigin && activeDest)}
        onClearRoute={clearRoute}
        routeDistKm={routeDistKm}
        routeOrigin={routeOrigin}
        routeDest={routeDest}
        globeTapMode={globeTapMode}
        onGlobeTapMode={setGlobeTapMode}
      />

      {/* 2D canvas overlay for city/country labels (drawn by GlobeLabels via useFrame) */}
      <canvas
        ref={labelCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {weatherLoading && !weather && (
        <div className="loading-splash">
          <div className="loading-globe">🌍</div>
          <p>Loading weather data…</p>
        </div>
      )}
    </>
  )
}
