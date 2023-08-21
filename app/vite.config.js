import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/api/v1',
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove "/api" prefix from the path
      },
      '/socket.io': {
        target: 'ws://localhost:3000',
        // target: 'wss://odyssey.wancat.cc',
        ws: true,
      },
    },
  },
})
