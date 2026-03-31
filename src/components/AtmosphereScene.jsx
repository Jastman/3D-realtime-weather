import { useEffect, useRef, useMemo } from 'react'
import { MathUtils, Vector3 } from 'three'
import { Atmosphere, Sky, SunLight, SkyLight } from '@takram/three-atmosphere/r3f'
import { Ellipsoid, Geodetic } from '@takram/three-geospatial'
import { latLonToECEF } from '../utils/greatCircle'

/**
 * Wraps the scene in Takram's atmospheric rendering context.
 *
 * Sets the worldToECEFMatrix on the Atmosphere so that clouds, sky, and sun
 * are aligned with the real Earth surface at the given lat/lon.
 *
 * The matrix must be set after the Atmosphere ref is available, and updated
 * whenever the scene's geographic center changes.
 */
export function AtmosphereScene({ lat, lon, date, children }) {
  const atmosphereRef = useRef()

  // ECEF position of the scene's geographic center (in meters)
  const ecefPosition = useMemo(() => {
    return latLonToECEF(lat, lon, 0)
  }, [lat, lon])

  // Update the worldToECEFMatrix whenever lat/lon changes.
  // This tells the atmosphere/cloud shaders how scene space maps to Earth space.
  useEffect(() => {
    if (!atmosphereRef.current) return

    const geodetic = new Geodetic(
      MathUtils.degToRad(lon),
      MathUtils.degToRad(lat),
      0
    )
    const ecefPos = geodetic.toECEF()

    // getNorthUpEastFrame: X=north, Y=up (away from surface), Z=east
    Ellipsoid.WGS84.getNorthUpEastFrame(
      ecefPos,
      atmosphereRef.current.worldToECEFMatrix
    )
  }, [lat, lon])

  return (
    <Atmosphere ref={atmosphereRef} date={date} correctAltitude>
      <Sky />
      {/*
        SunLight and SkyLight must be positioned in world space near the scene center.
        The Atmosphere context provides the sun direction; these components sync it.
      */}
      <group position={ecefPosition.toArray()}>
        <SunLight />
        <SkyLight />
      </group>

      {children}
    </Atmosphere>
  )
}
