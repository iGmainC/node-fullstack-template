import { Hono } from "hono";
import { logger } from "hono/logger";
import type { UpgradeWebSocket } from "hono/ws";
import { trpcServer } from "@hono/trpc-server";
import { trpcRouter } from "./trpc";
import { auth } from "./lib/auth";
import { app as demoApp } from "./routes/demo";

/**
 * 注册后端 HTTP 与 WebSocket 路由。
 * @param app Hono 应用实例
 * @param upgradeWebSocket 当前运行时提供的 WebSocket upgrade 适配器
 * @returns 已完成路由注册的 Hono 应用
 */
export function configureApp(app: Hono, upgradeWebSocket: UpgradeWebSocket): Hono {
  app.use(logger());

  app.use(
    "/api/trpc/*",
    trpcServer({
      endpoint: "/api/trpc",
      router: trpcRouter,
    }),
  );

  app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  app.get(
    "/api/ws",
    upgradeWebSocket(() => ({
      onOpen: (_event, ws) => {
        // 建连后先发一条确认消息，方便前端测试按钮判断握手成功。
        ws.send("connected");
      },
      onMessage: (event, ws) => {
        // 当前模板只做 echo 测试，避免引入额外业务状态。
        ws.send(`echo:${String(event.data)}`);
      },
    })),
  );

  app.route("/", demoApp);
  return app;
}

/**
 * 使用指定运行时的 WebSocket 适配器创建完整后端应用。
 * @param upgradeWebSocket 当前运行时提供的 WebSocket upgrade 适配器
 * @returns 已注册全部路由的 Hono 应用
 */
export function createApp(upgradeWebSocket: UpgradeWebSocket): Hono {
  return configureApp(new Hono(), upgradeWebSocket);
}
