import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Force pre-bundling of CJS packages used by @react-three/postprocessing
    include: ['three', 'postprocessing'],
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
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
