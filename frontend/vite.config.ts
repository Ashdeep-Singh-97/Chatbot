import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Default should work for local development
    host: true, // or just omit this line
    port: 5173,
  },
  build: {
    outDir: 'dist', // Ensure it outputs to 'dist'
  },
})
