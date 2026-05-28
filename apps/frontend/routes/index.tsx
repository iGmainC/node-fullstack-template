import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { client } from "../lib/trpc-client";
import { useTranslation } from "react-i18next";
import { Button } from "@packages/components/ui/button";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [apiResult, setApiResult] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const apiCases = [
    {
      label: "GET /api/test",
      run: () => runApiTest("GET /api/test", "/api/test"),
    },
    {
      label: "GET /api/users/42?expand=profile",
      run: () =>
        runApiTest("GET /api/users/:id", "/api/users/42?expand=profile"),
    },
    {
      label: "GET /api/search?q=vite&page=2",
      run: () => runApiTest("GET /api/search", "/api/search?q=vite&page=2"),
    },
    {
      label: "POST /api/echo",
      run: () =>
        runApiTest("POST /api/echo", "/api/echo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "hello", from: "frontend" }),
        }),
    },
    {
      label: "PUT /api/items/7",
      run: () =>
        runApiTest("PUT /api/items/:id", "/api/items/7", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "item-7", enabled: true }),
        }),
    },
    {
      label: "DELETE /api/items/7",
      run: () =>
        runApiTest("DELETE /api/items/:id", "/api/items/7", {
          method: "DELETE",
        }),
    },
    {
      label: "GET /api/error",
      run: () => runApiTest("GET /api/error", "/api/error"),
    },
    {
      label: "GET /api/slow",
      run: () => runApiTest("GET /api/slow", "/api/slow"),
    },
  ];

  const runApiTest = async (label: string, url: string, init?: RequestInit) => {
    setLoadingKey(label);
    try {
      const response = await fetch(url, init);
      const contentType = response.headers.get("content-type") ?? "";
      let body = "";
      if (contentType.includes("application/json")) {
        body = JSON.stringify(await response.json(), null, 2);
      } else {
        body = await response.text();
      }
      setApiResult(`[${label}] status: ${response.status}\n${body}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setApiResult(`[${label}] request failed: ${message}`);
    } finally {
      setLoadingKey(null);
    }
  };

  const runTrpcTest = async () => {
    const label = "tRPC hello";
    setLoadingKey(label);
    try {
      const data = await client.hello.query("Frontend");
      setApiResult(`[${label}] success\n${JSON.stringify({ data }, null, 2)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setApiResult(`[${label}] request failed: ${message}`);
    } finally {
      setLoadingKey(null);
    }
  };

  const runWebSocketTest = async () => {
    const label = "WebSocket echo";
    setLoadingKey(label);
    try {
      const result = await new Promise<string>((resolve, reject) => {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const socket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
        const payload = `ping:${Date.now()}`;
        const messages: string[] = [];
        const timeoutId = window.setTimeout(() => {
          socket.close();
          reject(new Error("WebSocket test timed out"));
        }, 5000);

        socket.addEventListener("open", () => {
          // open 后发送唯一 payload，避免误把建连提示当成 echo 结果。
          socket.send(payload);
        });
        socket.addEventListener("message", (event) => {
          const message = String(event.data);
          messages.push(message);
          if (message === `echo:${payload}`) {
            window.clearTimeout(timeoutId);
            socket.close();
            resolve(messages.join("\n"));
          }
        });
        socket.addEventListener("error", () => {
          window.clearTimeout(timeoutId);
          reject(new Error("WebSocket connection failed"));
        });
        socket.addEventListener("close", () => {
          window.clearTimeout(timeoutId);
        });
      });
      setApiResult(`[${label}] success\n${result}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setApiResult(`[${label}] request failed: ${message}`);
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="rounded-2xl border bg-card/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-6 flex items-center gap-4">
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("Welcome to React")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Fullstack template debug panel integrated with Vite + React + Hono + tRPC.")}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Current language")}: {i18n.language}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              onClick={() => {
                const newLang = isEnglish ? "zh" : "en";
                i18n.changeLanguage(newLang);
              }}
            >
              {isEnglish ? "切换到中文" : "Switch to English"}
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">{t("Open auth page")}</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {t("Edit apps/frontend/routes/index.tsx and save to test HMR")}
          </p>
        </section>

        <section className="rounded-2xl border bg-card/90 p-6 shadow-sm backdrop-blur">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-medium">API Playground</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={runTrpcTest}
                disabled={!!loadingKey}
                variant="secondary"
              >
                {loadingKey === "tRPC hello" ? t("Testing...") : "tRPC hello"}
              </Button>
              <Button
                onClick={runWebSocketTest}
                disabled={!!loadingKey}
                variant="secondary"
              >
                {loadingKey === "WebSocket echo" ? t("Testing...") : "WebSocket echo"}
              </Button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {apiCases.map((item) => (
              <Button
                key={item.label}
                onClick={item.run}
                disabled={!!loadingKey}
                variant="outline"
                className="justify-start"
              >
                {loadingKey ? t("Testing...") : item.label}
              </Button>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              {t("Response")}
            </h3>
            <pre className="min-h-56 overflow-auto rounded-lg border bg-muted/40 p-3 text-xs">
              {apiResult || t("Click an API button above to start testing...")}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
