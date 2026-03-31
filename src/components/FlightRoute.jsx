import { useMemo } from 'react'
import * as THREE from 'three'
import { EARTH_RADIUS, latLonToECEF } from '../utils/greatCircle'
import { turbulenceLabel } from '../utils/weatherMapping'

const CRUISE_ALTITUDE = 10_500 // meters — typical commercial cruise altitude
const PIN_HEIGHT = 300_000     // meters — height of the location pin above surface

/**
 * Renders the flight route arc and endpoint pins on the globe.
 *
 * arcPoints: THREE.Vector3[] from computeGreatCircle() at cruise altitude
 * turbulence: 0–1 used to color-code the arc
 * distanceKm: numeric distance for the stats display
 * origin / destination: { lat, lon } objects for the pins
 */
export function FlightRoute({ arcPoints, turbulence = 0, distanceKm, origin, destination }) {
  const { color } = turbulenceLabel(turbulence)

  // Build the tube geometry from the great-circle arc points
  const tubeGeometry = useMemo(() => {
    if (!arcPoints || arcPoints.length < 2) return null
    const curve = new THREE.CatmullRomCurve3(arcPoints, false, 'catmullrom', 0.5)
    return new THREE.TubeGeometry(curve, arcPoints.length * 2, 15_000, 8, false)
  }, [arcPoints])

  const arcColor = useMemo(() => new THREE.Color(color), [color])

  if (!arcPoints) return null

  return (
    <group>
      {/* Route arc */}
      {tubeGeometry && (
        <mesh geometry={tubeGeometry}>
          <meshBasicMaterial
            color={arcColor}
            transparent
            opacity={0.75}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Origin pin */}
      {origin && <LocationPin lat={origin.lat} lon={origin.lon} color="#22c55e" label="A" />}

      {/* Destination pin */}
      {destination && <LocationPin lat={destination.lat} lon={destination.lon} color="#ef4444" label="B" />}
    </group>
  )
}

/**
 * A glowing sphere pin at a lat/lon position on the globe.
 */
function LocationPin({ lat, lon, color }) {
  const position = useMemo(
    () => latLonToECEF(lat, lon, 0).toArray(),
    [lat, lon]
  )

  const pinColor = useMemo(() => new THREE.Color(color), [color])

  return (
    <group position={position}>
      {/* Ground dot */}
      <mesh>
        <sphereGeometry args={[80_000, 16, 16]} />
        <meshBasicMaterial color={pinColor} />
      </mesh>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[160_000, 16, 16]} />
        <meshBasicMaterial
          color={pinColor}
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
