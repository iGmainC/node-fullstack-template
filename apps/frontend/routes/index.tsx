import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import { client } from "../lib/trpc-client";
import { useTranslation } from "react-i18next";
import "./App.css";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [apiResult, setApiResult] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

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

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl!">{t("Welcome to React")}</h1>
      <p>当前语言: {i18n.language}</p>
      <div className="card">
        <button onClick={() => {
          const newLang = i18n.language === "en" ? "zh" : "en";
          i18n.changeLanguage(newLang);
        }}>
          {i18n.language === "en" ? "切换到中文" : "Switch to English"}
        </button>
        <p>
          Edit <code>src/routes/index.tsx</code> and save to test HMR
        </p>
        <div className="test-grid">
          <button
            onClick={() => runApiTest("GET /api/test", "/api/test")}
            disabled={!!loadingKey}
          >
            {loadingKey === "GET /api/test" ? "Testing..." : "GET /api/test"}
          </button>
          <button
            onClick={() =>
              runApiTest("GET /api/users/:id", "/api/users/42?expand=profile")
            }
            disabled={!!loadingKey}
          >
            {loadingKey === "GET /api/users/:id"
              ? "Testing..."
              : "GET /api/users/42?expand=profile"}
          </button>
          <button
            onClick={() =>
              runApiTest("GET /api/search", "/api/search?q=vite&page=2")
            }
            disabled={!!loadingKey}
          >
            {loadingKey === "GET /api/search"
              ? "Testing..."
              : "GET /api/search?q=vite&page=2"}
          </button>
          <button
            onClick={() =>
              runApiTest("POST /api/echo", "/api/echo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "hello", from: "frontend" }),
              })
            }
            disabled={!!loadingKey}
          >
            {loadingKey === "POST /api/echo" ? "Testing..." : "POST /api/echo"}
          </button>
          <button
            onClick={() =>
              runApiTest("PUT /api/items/:id", "/api/items/7", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "item-7", enabled: true }),
              })
            }
            disabled={!!loadingKey}
          >
            {loadingKey === "PUT /api/items/:id"
              ? "Testing..."
              : "PUT /api/items/7"}
          </button>
          <button
            onClick={() =>
              runApiTest("DELETE /api/items/:id", "/api/items/7", {
                method: "DELETE",
              })
            }
            disabled={!!loadingKey}
          >
            {loadingKey === "DELETE /api/items/:id"
              ? "Testing..."
              : "DELETE /api/items/7"}
          </button>
          <button
            onClick={() => runApiTest("GET /api/error", "/api/error")}
            disabled={!!loadingKey}
          >
            {loadingKey === "GET /api/error" ? "Testing..." : "GET /api/error"}
          </button>
          <button
            onClick={() => runApiTest("GET /api/slow", "/api/slow")}
            disabled={!!loadingKey}
          >
            {loadingKey === "GET /api/slow" ? "Testing..." : "GET /api/slow"}
          </button>
          <button onClick={runTrpcTest} disabled={!!loadingKey}>
            {loadingKey === "tRPC hello" ? "Testing..." : "tRPC hello"}
          </button>
        </div>
        {apiResult && <pre className="api-result">{apiResult}</pre>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
