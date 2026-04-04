'use client'
import { create } from 'zustand'
import type { AppState, SceneParams, WeatherData, GeoLocation, HourlyForecast } from '@/types'
import { weatherToScene } from '@/utils/weatherToScene'

const DEFAULT_LOCATION: GeoLocation = { lat: 40.7128, lon: -74.006, city: 'New York', country: 'US' }

const DEFAULT_SCENE: SceneParams = {
  sunElevation: 45,
  sunAzimuth: 180,
  turbidity: 2.5,
  rayleigh: 1.0,
  cloudCoverage: 0.25,
  cloudAltitude: 800,
  cloudSpeed: 0.5,
  cloudType: 'cumulus',
  rainIntensity: 0,
  snowIntensity: 0,
  windX: 2,
  windZ: 1,
  ambientIntensity: 0.3,
  sunIntensity: 1.0,
  fogDensity: 0.00002,
  fogColor: '#c8d8e8',
  bloomStrength: 0.3,
  bloomRadius: 0.4,
  vignetteIntensity: 0.2,
  saturation: 1.0,
  brightness: 1.0,
}

interface AppStore extends AppState {
  setLocation: (loc: GeoLocation) => void
  setWeather: (w: WeatherData, forecast: HourlyForecast[]) => void
  setSceneParam: <K extends keyof SceneParams>(key: K, value: SceneParams[K]) => void
  setMode: (mode: 'real' | 'manual') => void
  setGoogleSession: (session: string | null) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  setTempUnit: (u: 'C' | 'F') => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  location: DEFAULT_LOCATION,
  weather: null,
  forecast: [],
  sceneParams: DEFAULT_SCENE,
  mode: 'real',
  isLoading: false,
  error: null,
  googleMapsSession: null,
  tempUnit: 'F',

  setLocation: (loc) => set({ location: loc }),

  setWeather: (weather, forecast) => {
    const { location, mode } = get()
    const sceneParams = mode === 'real'
      ? weatherToScene(weather, location.lat, location.lon)
      : get().sceneParams
    set({ weather, forecast, sceneParams, isLoading: false, error: null })
  },

  setSceneParam: (key, value) =>
    set(s => ({ sceneParams: { ...s.sceneParams, [key]: value } })),

  setMode: (mode) => {
    const { weather, location } = get()
    if (mode === 'real' && weather) {
      const sceneParams = weatherToScene(weather, location.lat, location.lon)
      set({ mode, sceneParams })
    } else {
      set({ mode })
    }
  },

  setGoogleSession: (googleMapsSession) => set({ googleMapsSession }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setTempUnit: (tempUnit) => set({ tempUnit }),
}))
