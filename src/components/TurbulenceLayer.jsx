import { useMemo } from 'react'
import * as THREE from 'three'
import { EARTH_RADIUS } from '../utils/greatCircle'
import { turbulenceLabel } from '../utils/weatherMapping'

/**
 * Toggleable 3D turbulence visualization layer.
 *
 * Renders three concentric transparent spherical shells at different flight
 * altitudes (low, mid, high). Their color and opacity are driven by the
 * turbulence value so the user can see at a glance where rough air is.
 *
 *  Green  → Calm
 *  Yellow → Light
 *  Orange → Moderate
 *  Red    → Severe / Extreme
 */
export function TurbulenceLayer({ turbulence, visible }) {
  const { color } = turbulenceLabel(turbulence)

  const threeColor = useMemo(() => new THREE.Color(color), [color])

  if (!visible) return null

  const shells = [
    { altitude: 1500,  scale: 0.6 },  // low-level turbulence
    { altitude: 6000,  scale: 0.8 },  // cruise-level turbulence
    { altitude: 11000, scale: 1.0 },  // high-altitude turbulence
  ]

  return (
    <group>
      {shells.map(({ altitude, scale }) => (
        <mesh key={altitude}>
          <sphereGeometry args={[EARTH_RADIUS + altitude, 64, 32]} />
          <meshBasicMaterial
            color={threeColor}
            transparent
            opacity={Math.max(0.02, turbulence * 0.18 * scale)}
            side={THREE.BackSide}
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}
