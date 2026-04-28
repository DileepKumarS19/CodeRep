import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/socket.io-client') ||
            id.includes('node_modules/engine.io-client')
          ) return 'socket'
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/')
          ) return 'react-vendor'
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})