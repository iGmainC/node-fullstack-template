import { type SubmitEvent, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { signIn, signOut, signUp, useSession } from "../lib/auth";
import { Button } from "@packages/components/ui/button";
import { Input } from "@packages/components/ui/input";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const title = useMemo(
    () => (mode === "sign-in" ? t("Sign in") : t("Sign up")),
    [mode, t],
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
            ? `[${t("Sign in failed")}] ${res.error.message}`
            : `[${t("Signed in successfully")}] ${t("Session established")}`,
        );
      } else {
        const res = await signUp.email({
          name,
          email,
          password,
        });
        setResult(
          res.error
            ? `[${t("Sign up failed")}] ${res.error.message}`
            : `[${t("Signed up successfully")}] ${t("Signed in automatically")}`,
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult(`[${t("Request failed")}] ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await signOut();
      setResult(
        res.error
          ? `[${t("Sign out failed")}] ${res.error.message}`
          : `[${t("Signed out")}]`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult(`[${t("Request failed")}] ${message}`);
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
              <Link to="/">{t("Back to home")}</Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("Account authentication")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("Use Better Auth to test sign-in and sign-up flows.")}
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
              {t("Sign in")}
            </Button>
            <Button
              type="button"
              variant={mode === "sign-up" ? "default" : "ghost"}
              onClick={() => setMode("sign-up")}
              disabled={loading}
              className="w-full"
            >
              {t("Sign up")}
            </Button>
          </div>

          <form onSubmit={submit} className="grid gap-4">
            <h2 className="text-lg font-medium">{title}</h2>
            {mode === "sign-up" && (
              <label className="grid gap-2">
                <span className="text-sm text-muted-foreground">{t("Name")}</span>
                <Input
                  placeholder={t("Enter your name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "sign-up"}
                />
              </label>
            )}
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{t("Email")}</span>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted-foreground">{t("Password")}</span>
              <Input
                type="password"
                placeholder={t("Enter your password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? t("Submitting...") : title}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={logout}
                disabled={loading}
              >
                {t("Sign out")}
              </Button>
            </div>
          </form>
        </section>

        <section className="grid gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              {t("Current session")}
            </h3>
            {isPending && <p className="text-sm">{t("Loading...")}</p>}
            {error && (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
                {t("Session error")}: {error.message}
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
                {t("Request result")}
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
