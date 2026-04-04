// ── Weather data ─────────────────────────────────────────────────────────────

export interface WeatherData {
  temp: number            // °C
  feelsLike: number       // °C
  cloudCover: number      // 0–100 %
  windSpeed: number       // km/h
  windDirection: number   // degrees meteorological
  precipitation: number   // mm/h
  humidity: number        // %
  visibility: number      // km
  weatherCode: number     // WMO code
  description: string
  isDay: boolean
  fetchedAt: Date
}

export interface HourlyForecast {
  time: Date
  temp: number
  weatherCode: number
  precipitation: number
  windSpeed: number
}

// ── Location ─────────────────────────────────────────────────────────────────

export interface GeoLocation {
  lat: number
  lon: number
  city?: string
  country?: string
  timezone?: string
}

// ── Scene parameters (driven by weather data or manual sliders) ──────────────

export interface SceneParams {
  // Sky / atmosphere
  sunElevation: number        // 0–90 degrees
  sunAzimuth: number          // 0–360 degrees
  turbidity: number           // sky haze amount 1–20
  rayleigh: number            // atmosphere scatter 0–4

  // Clouds
  cloudCoverage: number       // 0–1
  cloudAltitude: number       // meters above terrain
  cloudSpeed: number          // animation speed multiplier
  cloudType: 'cumulus' | 'stratus' | 'cirrus' | 'storm'

  // Precipitation
  rainIntensity: number       // 0–1
  snowIntensity: number       // 0–1
  windX: number               // m/s, affects drift
  windZ: number               // m/s, affects drift

  // Lighting
  ambientIntensity: number
  sunIntensity: number
  fogDensity: number
  fogColor: string

  // Post-processing
  bloomStrength: number
  bloomRadius: number
  vignetteIntensity: number
  saturation: number
  brightness: number
}

// ── App state ────────────────────────────────────────────────────────────────

export type WeatherMode = 'real' | 'manual'

export interface AppState {
  location: GeoLocation
  weather: WeatherData | null
  forecast: HourlyForecast[]
  sceneParams: SceneParams
  mode: WeatherMode
  isLoading: boolean
  error: string | null
  googleMapsSession: string | null
  tempUnit: 'C' | 'F'
}
