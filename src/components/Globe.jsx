import { useEffect, useRef, useState } from 'react'
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

const ION_TOKEN =
  import.meta.env.VITE_CESIUM_ION_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMGEzMmI5Yy0xYjkyLTQxYWYtYTQ0ZS1jZGZiNGJlZThmNDQiLCJpZCI6Mzg2MjQ2LCJpYXQiOjE3NzQ5ODA2NDV9.Ea5FeqRaQkC-iJs7Dp-6uxoc8YYmi6ewNyiQ8bRBxoQ'

export function Globe({ routeMode = false, onGlobeClick }) {
  const hitSphereRef = useRef()
  // Track whether Cesium tiles have started rendering (first tile model loaded)
  const [cesiumActive, setCesiumActive] = useState(false)
  const [cesiumError, setCesiumError] = useState(false)

  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  const useFallback = !ION_TOKEN ||
    ION_TOKEN === 'your_cesium_ion_token_here' ||
    cesiumError

  return (
    <>
      {/* Always show FallbackGlobe until Cesium tiles are active */}
      {(!cesiumActive || useFallback) && (
        <FallbackGlobe routeMode={routeMode} onGlobeClick={onGlobeClick} showControls={useFallback} />
      )}

      {!useFallback && (
        <>
          <TilesRenderer
            key={ION_TOKEN}
            onLoadModel={() => {
              if (!cesiumActive) setCesiumActive(true)
            }}
            onLoadError={(e) => {
              console.error('Cesium Ion load error:', e)
              setCesiumError(true)
            }}
          >
            <TilesPlugin
              plugin={CesiumIonAuthPlugin}
              args={{ apiToken: ION_TOKEN, assetId: 1 }}
            />
            <TilesPlugin plugin={QuantizedMeshPlugin} />
            <TilesPlugin plugin={GLTFExtensionsPlugin} />
            <GlobeControls enableDamping />
            <TilesAttributionOverlay />
          </TilesRenderer>

          {routeMode && (
            <mesh ref={hitSphereRef} onPointerDown={handlePointerDown}>
              <sphereGeometry args={[EARTH_RADIUS + 1000, 64, 32]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          )}
        </>
      )}
    </>
  )
}

function FallbackGlobe({ routeMode, onGlobeClick, showControls = true }) {
  function handlePointerDown(e) {
    if (!routeMode || !onGlobeClick) return
    e.stopPropagation()
    onGlobeClick(e.point)
  }

  return (
    <>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS - 200, 128, 64]} />
        <meshBasicMaterial color="#1a4888" />
      </mesh>
      <mesh onPointerDown={handlePointerDown}>
        <sphereGeometry args={[EARTH_RADIUS, 128, 64]} />
        <meshBasicMaterial color="#2d6a3f" />
      </mesh>
      {showControls && <GlobeControls enableDamping />}
    </>
  )
}
