import { type SubmitEvent, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { signIn, signOut, signUp, useSession } from "../lib/auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "sign-in" | "sign-up";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const { data: session, isPending, error } = useSession();

  const title = useMemo(
    () => (mode === "sign-in" ? "登录" : "注册"),
    [mode],
  );

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    try {
      if (mode === "sign-in") {
        const res = await signIn.email({
          email,
          password,
        });
        setResult(
          res.error
            ? `[登录失败] ${res.error.message}`
            : "[登录成功] 会话已建立",
        );
      } else {
        const res = await signUp.email({
          name,
          email,
          password,
        });
        setResult(
          res.error
            ? `[注册失败] ${res.error.message}`
            : "[注册成功] 已自动登录",
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult(`[请求失败] ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await signOut();
      setResult(res.error ? `[退出失败] ${res.error.message}` : "[已退出]");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult(`[请求失败] ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg p-6">
      <div className="mb-4">
        <Link to="/">返回首页</Link>
      </div>

      <h1 className="mb-4 text-2xl font-semibold">Better Auth 测试页</h1>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          disabled={loading}
        >
          登录
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          disabled={loading}
        >
          注册
        </button>
      </div>

      <form onSubmit={submit} className="mb-4 grid gap-2">
        <h2 className="text-lg font-medium">{title}</h2>
        {mode === "sign-up" && (
          <input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "提交中..." : title}
        </button>
      </form>

      <div className="mb-4">
        <button type="button" onClick={logout} disabled={loading}>
          退出登录
        </button>
      </div>

      <section className="grid gap-2">
        <h3 className="font-medium">当前会话</h3>
        {isPending && <p>加载中...</p>}
        {error && <p>session error: {error.message}</p>}
        {!isPending && !error && (
          <pre className="api-result">
            {JSON.stringify(session ?? { session: null }, null, 2)}
          </pre>
        )}
        {result && <pre className="api-result">{result}</pre>}
      </section>
    </main>
  );
}