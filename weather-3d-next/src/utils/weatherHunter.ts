import { weatherDescription } from './weatherToScene'

/** Curated weather-drama hotspots around the world */
const HOTSPOTS = [
  { lat:  64.14, lon:  -21.94, city: 'Reykjavik',      country: 'IS', label: 'Icelandic Storm' },
  { lat: -54.80, lon:  -68.30, city: 'Ushuaia',         country: 'AR', label: 'Patagonian Gale' },
  { lat:  61.22, lon: -149.89, city: 'Anchorage',       country: 'US', label: 'Alaskan Blizzard' },
  { lat:  12.37, lon:   -1.53, city: 'Ouagadougou',     country: 'BF', label: 'Sahel Thunderstorm' },
  { lat:  25.04, lon:  121.56, city: 'Taipei',          country: 'TW', label: 'Typhoon Zone' },
  { lat:  60.17, lon:   24.94, city: 'Helsinki',        country: 'FI', label: 'Nordic Winter' },
  { lat:  36.65, lon:  138.19, city: 'Nagano',          country: 'JP', label: 'Japan Snowfall' },
  { lat:  10.50, lon:  -66.92, city: 'Caracas',         country: 'VE', label: 'Tropical Downpour' },
  { lat:  28.64, lon:   77.22, city: 'New Delhi',       country: 'IN', label: 'Monsoon Season' },
  { lat:   1.35, lon:  103.82, city: 'Singapore',       country: 'SG', label: 'Equatorial Storm' },
  { lat:  47.61, lon: -122.33, city: 'Seattle',         country: 'US', label: 'Pacific Northwest Rain' },
  { lat:  18.48, lon:  -69.90, city: 'Santo Domingo',   country: 'DO', label: 'Caribbean Tempest' },
  { lat: -22.91, lon:  -43.17, city: 'Rio de Janeiro',  country: 'BR', label: 'Tropical Cloudburst' },
  { lat:  46.20, lon:    6.14, city: 'Geneva',          country: 'CH', label: 'Alpine Snowstorm' },
  { lat:  55.95, lon:   -3.19, city: 'Edinburgh',       country: 'GB', label: 'Scottish Tempest' },
  { lat: -41.29, lon:  174.78, city: 'Wellington',      country: 'NZ', label: 'Windy Wellington' },
  { lat:  30.04, lon:   31.24, city: 'Cairo',           country: 'EG', label: 'Desert Sandstorm' },
  { lat: -33.87, lon:  151.21, city: 'Sydney',          country: 'AU', label: 'Southern Squall' },
  { lat:  13.51, lon:    2.12, city: 'Niamey',          country: 'NE', label: 'Saharan Haboob' },
  { lat: -17.73, lon:  168.32, city: 'Port Vila',       country: 'VU', label: 'Pacific Cyclone' },
]

function dramScore(code: number, precip: number, wind: number): number {
  let base = 0
  if      (code >= 95) base = 10
  else if (code >= 85) base = 9
  else if (code >= 80) base = 8
  else if (code >= 71) base = 7
  else if (code >= 65) base = 7
  else if (code >= 55) base = 5
  else if (code >= 51) base = 4
  else if (code >= 40) base = 4
  else if (code >= 3)  base = 2
  return base + precip * 0.3 + wind * 0.04
}

export interface WeatherSpotlight {
  lat: number; lon: number
  city: string; country: string; label: string
  weatherCode: number; description: string; score: number
}

/**
 * Query Open-Meteo across all hotspots in one bulk request,
 * return the location with the most dramatic current weather.
 */
export async function findInterestingWeather(): Promise<WeatherSpotlight> {
  const lats = HOTSPOTS.map(h => h.lat).join(',')
  const lons = HOTSPOTS.map(h => h.lon).join(',')

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude',  lats)
  url.searchParams.set('longitude', lons)
  url.searchParams.set('current',   'weather_code,precipitation,wind_speed_10m')
  url.searchParams.set('timezone',  'auto')
  url.searchParams.set('forecast_days', '1')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Weather API error')
  const raw  = await res.json()
  const data: any[] = Array.isArray(raw) ? raw : [raw]

  let best: WeatherSpotlight | null = null

  data.forEach((d, i) => {
    if (i >= HOTSPOTS.length) return
    const spot  = HOTSPOTS[i]
    const code  = d.current?.weather_code  ?? 0
    const precip = d.current?.precipitation ?? 0
    const wind  = d.current?.wind_speed_10m ?? 0
    const score = dramScore(code, precip, wind)
    if (!best || score > best.score) {
      best = { lat: spot.lat, lon: spot.lon, city: spot.city, country: spot.country,
               label: spot.label, weatherCode: code, description: weatherDescription(code), score }
    }
  })

  if (!best) {
    const spot = HOTSPOTS[Math.floor(Math.random() * HOTSPOTS.length)]
    best = { ...spot, weatherCode: 0, description: 'Clear Sky', score: 0 }
  }

  return best
}
