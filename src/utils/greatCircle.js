import * as THREE from 'three'

// WGS84 mean radius in meters
export const EARTH_RADIUS = 6371000

/**
 * Convert geographic coordinates (degrees) to ECEF (Earth-Centered, Earth-Fixed) meters.
 * Coordinate convention used by 3d-tiles-renderer:
 *   X → (lat=0, lon=0)
 *   Y → (lat=0, lon=90°E)
 *   Z → north pole
 */
export function latLonToECEF(lat, lon, altitudeMeters = 0) {
  const phi = (lat * Math.PI) / 180
  const lambda = (lon * Math.PI) / 180
  const r = EARTH_RADIUS + altitudeMeters
  return new THREE.Vector3(
    r * Math.cos(phi) * Math.cos(lambda),
    r * Math.cos(phi) * Math.sin(lambda),
    r * Math.sin(phi)
  )
}

/**
 * Convert an ECEF position back to geographic lat/lon (degrees).
 */
export function ecefToLatLon(point) {
  const r = point.length()
  const lat = Math.asin(Math.max(-1, Math.min(1, point.z / r))) * (180 / Math.PI)
  const lon = Math.atan2(point.y, point.x) * (180 / Math.PI)
  return { lat, lon }
}

/**
 * Spherical linear interpolation between two unit vectors.
 */
function slerp(a, b, t) {
  const angle = a.angleTo(b)
  if (angle < 1e-6) return a.clone().lerp(b, t).normalize()
  const sinAngle = Math.sin(angle)
  const factorA = Math.sin((1 - t) * angle) / sinAngle
  const factorB = Math.sin(t * angle) / sinAngle
  return new THREE.Vector3()
    .addScaledVector(a, factorA)
    .addScaledVector(b, factorB)
}

/**
 * Compute numPoints+1 points along the great-circle arc between
 * (lat1, lon1) and (lat2, lon2) at a given altitude above sea level.
 * Returns an array of THREE.Vector3 in ECEF meters.
 */
export function computeGreatCircle(lat1, lon1, lat2, lon2, numPoints = 50, altitudeMeters = 10000) {
  const r = EARTH_RADIUS + altitudeMeters

  const p1 = latLonToECEF(lat1, lon1).normalize()
  const p2 = latLonToECEF(lat2, lon2).normalize()

  const points = []
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const pt = slerp(p1, p2, t).multiplyScalar(r)
    points.push(pt)
  }
  return points
}

/**
 * Haversine distance in km between two lat/lon points.
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
