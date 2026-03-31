import { useState, useCallback } from 'react'
import { ecefToLatLon, haversineDistanceKm, computeGreatCircle } from '../utils/greatCircle'

/**
 * Manages the user's flight route drawn by tapping two points on the globe.
 *
 * Usage in route mode:
 *  1. First click → sets origin pin
 *  2. Second click → sets destination pin, draws arc
 *  3. "Clear Route" → resets
 */
export function useFlightRoute() {
  const [routeMode, setRouteMode] = useState(false)
  // Each point: { lat, lon, ecef: THREE.Vector3 }
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)

  // Computed arc points (THREE.Vector3[]) at cruise altitude
  const arcPoints = origin && destination
    ? computeGreatCircle(origin.lat, origin.lon, destination.lat, destination.lon, 80, 10500)
    : null

  const distanceKm = origin && destination
    ? haversineDistanceKm(origin.lat, origin.lon, destination.lat, destination.lon)
    : null

  /**
   * Called when user clicks the globe in route mode.
   * @param {THREE.Vector3} ecefPoint  Hit point in world / ECEF space.
   */
  const handleGlobeClick = useCallback((ecefPoint) => {
    if (!routeMode) return

    const { lat, lon } = ecefToLatLon(ecefPoint)
    const point = { lat, lon, ecef: ecefPoint.clone() }

    if (!origin) {
      setOrigin(point)
    } else if (!destination) {
      setDestination(point)
    }
    // If both already set, ignore until user clears
  }, [routeMode, origin, destination])

  const clearRoute = useCallback(() => {
    setOrigin(null)
    setDestination(null)
  }, [])

  const toggleRouteMode = useCallback(() => {
    setRouteMode(prev => {
      if (prev) {
        // Leaving route mode → clear route
        setOrigin(null)
        setDestination(null)
      }
      return !prev
    })
  }, [])

  return {
    routeMode,
    toggleRouteMode,
    origin,
    destination,
    arcPoints,
    distanceKm,
    handleGlobeClick,
    clearRoute,
  }
}
