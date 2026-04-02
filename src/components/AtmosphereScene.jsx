import { useMemo } from 'react'
import { Atmosphere, SunLight, SkyLight } from '@takram/three-atmosphere/r3f'
import { latLonToECEF } from '../utils/greatCircle'

// Use locally bundled precomputed atmosphere textures to avoid GPU precomputation
// (which is slow on first load and fails in test environments).
// The AtmosphereTextureLoader expects a base URL and loads:
//   transmittance.exr, scattering.exr, irradiance.exr,
//   single_mie_scattering.exr, higher_order_scattering.exr
const ATMOSPHERE_TEXTURES_URL = import.meta.env.BASE_URL + 'assets/atmosphere/'

export function AtmosphereScene({ lat, lon, date, children }) {
  const ecefPosition = useMemo(() => latLonToECEF(lat, lon, 0), [lat, lon])

  return (
    <Atmosphere date={date} correctAltitude textures={ATMOSPHERE_TEXTURES_URL}>
      <group position={ecefPosition.toArray()}>
        <SunLight />
        <SkyLight />
      </group>

      {children}
    </Atmosphere>
  )
}
