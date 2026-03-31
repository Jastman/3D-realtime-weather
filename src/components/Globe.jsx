import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import {
  TilesRenderer,
  TilesPlugin,
  GlobeControls,
  TilesAttributionOverlay,
} from '3d-tiles-renderer/r3f'
import {
  CesiumIonAuthPlugin,
  QuantizedMeshPlugin,
  GLTFExtensionsPlugin,
} from '3d-tiles-renderer/plugins'
import { EARTH_RADIUS, ecefToLatLon } from '../utils/greatCircle'

const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN

/**
 * Earth globe rendered from Cesium Ion World Terrain (asset ID 1).
 * GlobeControls handles all orbit/pan/zoom for both mouse and touch.
 *
 * When routeMode is true, pointer events on the hit-sphere are forwarded
 * to onGlobeClick so the user can pick origin/destination points.
 */
export function Globe({ routeMode = false, onGlobeClick }) {
  const hitSphereRef = useRef()

  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  if (!ION_TOKEN || ION_TOKEN === 'your_cesium_ion_token_here') {
    return <FallbackGlobe routeMode={routeMode} onGlobeClick={onGlobeClick} />
  }

  return (
    <>
      {/* Cesium World Terrain */}
      <TilesRenderer key={ION_TOKEN}>
        <TilesPlugin
          plugin={CesiumIonAuthPlugin}
          args={{ apiToken: ION_TOKEN, assetId: 1 }}
        />
        <TilesPlugin plugin={QuantizedMeshPlugin} />
        <TilesPlugin plugin={GLTFExtensionsPlugin} />
        <GlobeControls enableDamping />
        <TilesAttributionOverlay />
      </TilesRenderer>

      {/* Invisible hit-sphere for route-mode click detection */}
      {routeMode && (
        <mesh ref={hitSphereRef} onPointerDown={handlePointerDown}>
          <sphereGeometry args={[EARTH_RADIUS + 1000, 64, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </>
  )
}

/**
 * Fallback globe shown when no Cesium Ion token is configured.
 * Renders a simple shaded Earth sphere so the rest of the app still works.
 */
function FallbackGlobe({ routeMode, onGlobeClick }) {
  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  return (
    <>
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[EARTH_RADIUS, 128, 64]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.9} />
      </mesh>
      {/* Ocean */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS - 500, 128, 64]} />
        <meshStandardMaterial color="#1a4a7a" roughness={0.8} />
      </mesh>
      <GlobeControls enableDamping />
    </>
  )
}
