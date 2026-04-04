'use client'
import { Suspense, forwardRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr } from '@react-three/drei'
import { useAppStore } from '@/store/useAppStore'
import { SatelliteTiles } from './SatelliteTiles'
import { SkyAtmosphere } from './SkyAtmosphere'
import { CloudSystem } from './CloudSystem'
import { Rain, Snow } from './Precipitation'
import { PostProcessing } from './PostProcessing'
import { CameraController, type CameraControllerHandle } from './CameraController'

interface WeatherSceneProps {
  googleSession: string | null
  quality: 'low' | 'medium' | 'high'
}

export const WeatherScene = forwardRef<CameraControllerHandle, WeatherSceneProps>(
  function WeatherScene({ googleSession, quality }, cameraRef) {
    const { location, sceneParams } = useAppStore()

    return (
      <Canvas
        shadows={quality !== 'low'}
        gl={{
          antialias: quality !== 'low',
          toneMapping: 4,
          toneMappingExposure: 1.0,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 60, near: 1, far: 500_000 }}
        style={{ position: 'absolute', inset: 0 }}
        dpr={[1, quality === 'high' ? 2 : 1.5]}
      >
        <AdaptiveDpr pixelated />
        <CameraController ref={cameraRef} initialAltitude={300} />

        <Suspense fallback={null}>
          <SatelliteTiles lat={location.lat} lon={location.lon} googleSession={googleSession} />
        </Suspense>

        <SkyAtmosphere params={sceneParams} />

        <Suspense fallback={null}>
          <CloudSystem params={sceneParams} />
        </Suspense>

        <Rain params={sceneParams} />
        <Snow params={sceneParams} />

        {/* key forces full EffectComposer remount when quality level changes */}
        <PostProcessing key={quality} params={sceneParams} quality={quality} />

        <Preload all />
      </Canvas>
    )
  }
)
