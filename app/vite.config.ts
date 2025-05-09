import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@game': path.resolve(__dirname, '../packages/game'),
      '@models': path.resolve(__dirname, '../packages/models'),
      '@utils': path.resolve(__dirname, '../packages/utils'),
      '@constants': path.resolve(__dirname, '../packages/constants'),
      '@file-graph': path.resolve(__dirname, '../packages/file-graph'),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/trpc': {
        target: process.env.API_TARGET || 'http://localhost:3000',
        changeOrigin: false,
        xfwd: true,
      },
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
