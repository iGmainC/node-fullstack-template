import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import honoDevProxyPlugin from './package/vite-plugin-hono-dev'

export default defineConfig({
  plugins: [
    honoDevProxyPlugin({
      entry: 'src/backend/server.ts',
      host: 'localhost',
      port: 8787,
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
