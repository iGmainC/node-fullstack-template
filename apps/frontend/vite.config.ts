import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import honoDevProxyPlugin from '../../package/vite-plugin-hono-dev'

export default defineConfig({
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: false,
  },
  plugins: [
    tsconfigPaths(),
    honoDevProxyPlugin({
      entry: '../backend/src/server.ts',
      host: 'localhost',
      port: 8787,
    }),
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
