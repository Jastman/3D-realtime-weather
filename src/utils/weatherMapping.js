/**
 * WMO Weather Interpretation Code mappings.
 * https://open-meteo.com/en/docs#weathervariables
 */

export const WMO_DESCRIPTIONS = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

export const WMO_ICONS = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌨️',
  67: '🌨️',
  71: '🌨️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

/**
 * Map weather code bonus turbulence (0–1).
 */
const CODE_TURBULENCE_BONUS = {
  0: 0.0,
  1: 0.0,
  2: 0.02,
  3: 0.05,
  45: 0.05,
  48: 0.05,
  51: 0.15,
  53: 0.2,
  55: 0.25,
  56: 0.2,
  57: 0.3,
  61: 0.2,
  63: 0.3,
  65: 0.4,
  66: 0.3,
  67: 0.4,
  71: 0.2,
  73: 0.25,
  75: 0.3,
  77: 0.2,
  80: 0.35,
  81: 0.45,
  82: 0.6,
  85: 0.3,
  86: 0.4,
  95: 0.8,
  96: 0.9,
  99: 1.0,
}

/**
 * Map WMO code to a base cloud coverage modifier (0–1).
 */
const CODE_COVERAGE = {
  0: 0.05,
  1: 0.15,
  2: 0.3,
  3: 0.75,
  45: 0.6,
  48: 0.65,
  51: 0.55,
  53: 0.65,
  55: 0.75,
  56: 0.6,
  57: 0.7,
  61: 0.65,
  63: 0.75,
  65: 0.85,
  66: 0.7,
  67: 0.8,
  71: 0.7,
  73: 0.8,
  75: 0.9,
  77: 0.75,
  80: 0.7,
  81: 0.8,
  82: 0.9,
  85: 0.75,
  86: 0.85,
  95: 0.95,
  96: 0.95,
  99: 1.0,
}

/**
 * Derive turbulence intensity (0–1) from wind speed (km/h) and weather code.
 */
export function calculateTurbulence(windSpeedKmh, weatherCode) {
  const windFactor = Math.min(windSpeedKmh / 80, 1.0) * 0.6
  const codeFactor = CODE_TURBULENCE_BONUS[weatherCode] ?? 0.05
  return Math.min(windFactor + codeFactor, 1.0)
}

/**
 * Map a numeric turbulence value (0–1) to a human label and color.
 */
export function turbulenceLabel(t) {
  if (t < 0.15) return { label: 'Calm', color: '#22c55e' }
  if (t < 0.35) return { label: 'Light', color: '#86efac' }
  if (t < 0.55) return { label: 'Moderate', color: '#facc15' }
  if (t < 0.75) return { label: 'Severe', color: '#f97316' }
  return { label: 'Extreme', color: '#ef4444' }
}

/**
 * Derive cloud coverage (0–1) from raw cloudCover % and weather code.
 */
export function mapCloudCoverage(cloudCoverPct, weatherCode) {
  const raw = cloudCoverPct / 100
  const codeBase = CODE_COVERAGE[weatherCode] ?? raw
  // Blend actual measurement with code-based estimate
  return Math.min((raw * 0.7 + codeBase * 0.3), 1.0)
}

export function getWeatherDescription(code) {
  return WMO_DESCRIPTIONS[code] ?? 'Unknown'
}

export function getWeatherIcon(code) {
  return WMO_ICONS[code] ?? '🌡️'
}

export function windDirectionLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}
