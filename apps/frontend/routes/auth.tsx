import { type SubmitEvent, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { signIn, signOut, signUp, useSession } from "../lib/auth";
import { Button } from "@packages/components/ui/button";
import { Input } from "@packages/components/ui/input";

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
    <main className="mx-auto grid min-h-screen w-full max-w-5xl items-center px-4 py-8 sm:px-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-8 space-y-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">返回首页</Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">账户认证</h1>
              <p className="text-sm text-muted-foreground">
                使用 Better Auth 完成登录和注册流程测试。
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-lg border bg-muted/40 p-1">
            <Button
              type="button"
              variant={mode === "sign-in" ? "default" : "ghost"}
              onClick={() => setMode("sign-in")}
              disabled={loading}
              className="w-full"
            >
              登录
            </Button>
            <Button
              type="button"
              variant={mode === "sign-up" ? "default" : "ghost"}
              onClick={() => setMode("sign-up")}
              disabled={loading}
              className="w-full"
            >
              注册
            </Button>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <h2 className="text-lg font-medium">{title}</h2>
            {mode === "sign-up" && (
              <label className="grid gap-2">
                <span className="text-sm text-muted-foreground">昵称</span>
                <Input
                  placeholder="请输入昵称"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "sign-up"}
                />
              </label>
            )}
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">邮箱</span>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">密码</span>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "提交中..." : title}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
                disabled={loading}
              >
                退出登录
              </Button>
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              当前会话
            </h3>
            {isPending && <p className="text-sm">加载中...</p>}
            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
                session error: {error.message}
              </p>
            )}
            {!isPending && !error && (
              <pre className="max-h-[360px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
                {JSON.stringify(session ?? { session: null }, null, 2)}
              </pre>
            )}
          </div>

          {result && (
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                请求结果
              </h3>
              <pre className="max-h-[260px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
                {result}
              </pre>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
