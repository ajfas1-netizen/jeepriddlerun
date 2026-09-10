import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// One-file build used only for the shareable preview link.
// Everything ends up in a single JS + CSS pair so it can be inlined.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-artifact',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    modulePreload: { polyfill: false },
    rollupOptions: { output: { inlineDynamicImports: true } },
    chunkSizeWarningLimit: 5000
  }
})
