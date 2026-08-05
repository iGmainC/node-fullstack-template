import honoDevProxyPlugin from "@igmainc/vite-plugin-hono-dev";
import babel from "@rolldown/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// auto 会跟随 Vite 宿主；入口也必须使用同一运行时的 WebSocket adapter。
const backendEntry =
  "Bun" in globalThis ? "apps/backend/server.bun.ts" : "apps/backend/server.ts";

export default defineConfig({
  build: {
    outDir: "./dist/frontend",
    emptyOutDir: false,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    honoDevProxyPlugin({
      entry: backendEntry,
      host: "localhost",
      port: 8787,
      runtime: "auto",
    }),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      quoteStyle: "double",
      semicolons: true,
      routesDirectory: "apps/frontend/routes",
      generatedRouteTree: "apps/frontend/routeTree.gen.ts",
    }),
    react(),
    // Vite 8 通过 Rolldown Babel preset 接入 React Compiler。
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
