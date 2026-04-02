import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Force pre-bundling of CJS packages so they get proper ESM default exports
    include: ['three', 'postprocessing', 'stats.js', '@react-three/drei'],
    // Exclude @takram packages — they are pre-built ESM with inlined GLSL
    // and Vite's esbuild optimizer would mangle them
    exclude: [
      '@takram/three-clouds',
      '@takram/three-atmosphere',
      '@takram/three-geospatial',
    ],
  },
  base: '/3D-realtime-weather/',
  build: {
    target: 'esnext',
  },
  server: {
    cors: true,
  },
})
