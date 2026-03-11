import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { trpcRouter } from "./trpc";
import { auth } from "./lib/auth";
import { logger } from "hono/logger";

export const app = new Hono();

app.use(logger())

app.use(
  "/api/trpc/*",
  trpcServer({
    router: trpcRouter,
  }),
);


app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

if (import.meta.main) {
  const port = Number(process.env.PORT ?? "3000");
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`[backend] listening on http://localhost:${port}`);
}
