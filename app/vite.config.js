import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://localhost:3000',
        changeOrigin: false,
        xfwd: true,
      },
      '/socket.io': {
        target: process.env.API_TARGET || 'ws://localhost:3000',
        changeOrigin: false,
        ws: true,
        xfwd: true,
      },
    },
  },
})
