// Vite config: registers React plugin for the frontend build.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react'
          if (id.includes('@dnd-kit')) return 'dnd'
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/zustand') ||
            id.includes('node_modules/react-hot-toast')
          ) {
            return 'vendor'
          }
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true
  },
  server: {
    port: 5173,
    proxy: {
      // proxy API calls to backend during dev so no CORS issues
      '/auth': 'http://localhost:5000',
      '/oauth': 'http://localhost:5000',
      '/boards-api': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
      '/templates': 'http://localhost:5000',
      '/notifications': 'http://localhost:5000'
    }
  }
})


