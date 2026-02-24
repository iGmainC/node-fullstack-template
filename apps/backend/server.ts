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

app.get("/api/test", (c) => c.text("ok"));

app.get("/api/users/:id", (c) => {
  const id = c.req.param("id");
  const expand = c.req.query("expand") ?? "none";
  return c.json({
    route: "GET /api/users/:id",
    id,
    expand,
  });
});

app.get("/api/search", (c) => {
  const keyword = c.req.query("q") ?? "";
  const page = Number(c.req.query("page") ?? "1");
  return c.json({
    route: "GET /api/search",
    keyword,
    page,
    items: [`${keyword}-1`, `${keyword}-2`],
  });
});

app.post("/api/echo", async (c) => {
  try {
    const body = await c.req.json();
    return c.json({
      route: "POST /api/echo",
      body,
    });
  } catch {
    return c.json(
      {
        route: "POST /api/echo",
        error: "invalid json body",
      },
      400,
    );
  }
});

app.put("/api/items/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  return c.json({
    route: "PUT /api/items/:id",
    id,
    body,
    updatedAt: new Date().toISOString(),
  });
});

app.delete("/api/items/:id", (c) => {
  const id = c.req.param("id");
  return c.json({
    route: "DELETE /api/items/:id",
    id,
    deleted: true,
  });
});

app.get("/api/error", (c) =>
  c.json(
    {
      route: "GET /api/error",
      error: "intentional test error",
    },
    418,
  ),
);

app.get("/api/slow", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return c.json({
    route: "GET /api/slow",
    delayedMs: 800,
  });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

if (import.meta.main) {
  const port = Number(process.env.PORT ?? "3000");
  serve({
    fetch: app.fetch,
    port,
  });
  console.log(`[backend] listening on http://localhost:${port}`);
}
