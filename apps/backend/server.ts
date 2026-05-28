import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createNodeWebSocket } from "@hono/node-ws";
import { configureApp } from "./app";

export const app = new Hono();
export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

configureApp(app, upgradeWebSocket);

if (import.meta.main) {
  const port = Number(process.env.PORT ?? "3000");
  const server = serve({
    fetch: app.fetch,
    port,
  });
  // Node 服务需要把 @hono/node-ws 注入到底层 http server 才能处理 upgrade。
  injectWebSocket(server);
  console.log(`[backend] listening on http://localhost:${port}`);
}
