import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FDE_GYM_MVP/',   // GitHub Pages sub-path (repo name)
  server: {
    port: 4200
  }
})

