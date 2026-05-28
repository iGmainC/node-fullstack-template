import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import honoDevProxyPlugin from "@igmainc/vite-plugin-hono-dev";

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
      entry: "apps/backend/server.ts",
      host: "localhost",
      port: 8787,
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
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
