import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import honoDevProxyPlugin from '../../package/vite-plugin-hono-dev'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    honoDevProxyPlugin({
      entry: '../backend/src/server.ts',
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
