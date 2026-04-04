'use client'
/**
 * CameraController — smooth fly camera with orbit, pan, zoom.
 *
 * Starts at 45 degree tilt (300 m altitude, 350 m back) so you can see both the
 * satellite terrain AND clouds/sky simultaneously.
 * Exposes flyTo() via ref so TopBar can animate to a geocoded location.
 */
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import * as THREE from 'three'

export interface CameraControllerHandle {
  flyTo: (x: number, z: number, altitude?: number) => void
}

export const CameraController = forwardRef<CameraControllerHandle, { initialAltitude?: number }>(
  function CameraController({ initialAltitude = 300 }, ref) {
    const { camera } = useThree()
    const controlsRef = useRef<any>(null)
    const flyTarget    = useRef<THREE.Vector3 | null>(null)
    const flyDuration  = useRef(0)
    const flyElapsed   = useRef(0)
    const flyFrom      = useRef(new THREE.Vector3())
    const flyFromTarget = useRef(new THREE.Vector3())

    useEffect(() => {
      // Start tilted ~45 degrees so terrain + sky + clouds are all visible
      const back = initialAltitude * 1.2
      camera.position.set(0, initialAltitude, back)
      camera.lookAt(0, 0, 0)
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    }, []) // eslint-disable-line

    useImperativeHandle(ref, () => ({
      flyTo(x: number, z: number, altitude = 300) {
        if (!controlsRef.current) return
        flyFrom.current.copy(camera.position)
        flyFromTarget.current.copy(controlsRef.current.target)
        const dist = camera.position.distanceTo(new THREE.Vector3(x, altitude, z))
        flyDuration.current = Math.min(3, Math.max(1.2, dist / 2000))
        flyElapsed.current  = 0
        flyTarget.current   = new THREE.Vector3(x, altitude, z)
      },
    }))

    useFrame((_, delta) => {
      if (!flyTarget.current || !controlsRef.current) return
      flyElapsed.current += delta
      const t    = Math.min(1, flyElapsed.current / flyDuration.current)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

      const { x: tx, y: ty, z: tz } = flyTarget.current
      const back = ty * 1.2
      camera.position.lerpVectors(flyFrom.current, new THREE.Vector3(tx, ty, tz + back), ease)
      controlsRef.current.target.lerpVectors(flyFromTarget.current, new THREE.Vector3(tx, 0, tz), ease)
      controlsRef.current.update()
      if (t >= 1) flyTarget.current = null
    })

    return (
      <MapControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.07}
        zoomSpeed={1.2}
        panSpeed={0.8}
        minDistance={50}
        maxDistance={80_000}
        maxPolarAngle={Math.PI / 2.1}
        makeDefault
      />
    )
  }
)
