// Geographic / tile math utilities

/** Earth's circumference in meters (at equator, Web Mercator) */
export const EARTH_CIRCUMFERENCE = 40_075_016.686

/** Meters per pixel at zoom level 0 (tile = 256px) */
export const METERS_PER_PIXEL_Z0 = EARTH_CIRCUMFERENCE / 256

/** Convert lat/lon to XYZ tile indices */
export function latLonToTile(lat: number, lon: number, zoom: number) {
  const n = Math.pow(2, zoom)
  const x = Math.floor((lon + 180) / 360 * n)
  const latRad = (lat * Math.PI) / 180
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)), z: zoom }
}

/** Get lat/lon bounds of a tile */
export function tileBounds(x: number, y: number, z: number) {
  const n = Math.pow(2, z)
  const west  = (x / n) * 360 - 180
  const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * (180 / Math.PI)
  const east  = ((x + 1) / n) * 360 - 180
  const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * (180 / Math.PI)
  return { west, north, east, south }
}

/** Get center lat/lon of a tile */
export function tileCenterLatLon(x: number, y: number, z: number) {
  const { west, north, east, south } = tileBounds(x, y, z)
  return { lat: (north + south) / 2, lon: (west + east) / 2 }
}

/** Ground resolution in meters/pixel at given latitude and zoom */
export function groundResolution(lat: number, zoom: number) {
  return (Math.cos((lat * Math.PI) / 180) * EARTH_CIRCUMFERENCE) / (256 * Math.pow(2, zoom))
}

/** Width of one tile in world-space meters at given zoom and latitude */
export function tileSizeMeters(lat: number, zoom: number) {
  return groundResolution(lat, zoom) * 256
}

/**
 * Convert lat/lon to flat-earth X/Z world coordinates in meters,
 * relative to a reference lat/lon (the map center).
 */
export function latLonToWorld(
  lat: number, lon: number,
  refLat: number, refLon: number
): { x: number; z: number } {
  const metersPerDegLat = 111_132
  const metersPerDegLon = 111_132 * Math.cos((refLat * Math.PI) / 180)
  return {
    x: (lon - refLon) * metersPerDegLon,
    z: -(lat - refLat) * metersPerDegLat,   // negative Z = north in Three.js
  }
}

/** Determine best zoom level from camera altitude (meters above ground) */
export function altitudeToZoom(altMeters: number): number {
  if (altMeters > 80_000) return 6
  if (altMeters > 40_000) return 7
  if (altMeters > 20_000) return 8
  if (altMeters > 10_000) return 9
  if (altMeters > 5_000)  return 10
  if (altMeters > 2_500)  return 11
  if (altMeters > 1_200)  return 12
  if (altMeters > 600)    return 13
  if (altMeters > 300)    return 14
  if (altMeters > 150)    return 15
  if (altMeters > 75)     return 16
  return 17
}

/** Sun elevation angle from time and location (simplified) */
export function sunPosition(
  date: Date,
  lat: number,
  lon: number
): { elevation: number; azimuth: number } {
  const now = date
  const utcH = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600

  // Solar declination (approximate)
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getUTCFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const declination = -23.45 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365)

  // Solar hour angle
  const solarNoon = 12 - lon / 15
  const hourAngle = 15 * (utcH - solarNoon)

  const latRad  = (lat * Math.PI) / 180
  const decRad  = (declination * Math.PI) / 180
  const haRad   = (hourAngle * Math.PI) / 180

  // Elevation
  const sinEl =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinEl))) * (180 / Math.PI)

  // Azimuth
  const cosAz =
    (Math.sin(decRad) - Math.sin(latRad) * sinEl) /
    (Math.cos(latRad) * Math.cos(Math.asin(sinEl)))
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) * (180 / Math.PI)
  if (hourAngle > 0) azimuth = 360 - azimuth

  return { elevation, azimuth }
}
