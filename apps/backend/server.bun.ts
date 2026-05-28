import { upgradeWebSocket, websocket } from "hono/bun";
import { createApp } from "./app";

export const app = createApp(upgradeWebSocket);

/** Bun 运行时提供的最小 serve 类型，避免把 Bun 类型泄漏到 Node 构建入口 */
declare const Bun: {
  serve(options: { fetch: typeof app.fetch; port: number; websocket: typeof websocket }): { url: URL };
};

if (import.meta.main) {
  const port = Number(process.env.PORT ?? "3000");
  const server = Bun.serve({
    fetch: app.fetch,
    port,
    // Bun.serve 原生接收 websocket handler，不需要 @hono/node-ws。
    websocket,
  });
  console.log(`[backend:bun] listening on ${server.url}`);
}
