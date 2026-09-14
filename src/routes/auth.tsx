import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Baby, Check, Loader2, LogIn, Mail, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Crie sua conta para guardar os dados da sua família com segurança e acessar de qualquer aparelho.",
      },
      { property: "og:title", content: "Entrar no Ninho Financeiro" },
      {
        property: "og:description",
        content: "Acesse sua conta e mantenha o planejamento da família sempre salvo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const passwordRules: Array<{ label: string; test: (p: string) => boolean }> = [
  { label: "Pelo menos 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Um número", test: (p) => /\d/.test(p) },
  { label: "Um símbolo (ex.: ! @ # $)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function passwordStrength(p: string): { score: number; label: string; bar: string } {
  if (!p) return { score: 0, label: "", bar: "bg-muted" };
  const met = passwordRules.filter((r) => r.test(p)).length;
  if (met <= 2) return { score: met, label: "Fraca", bar: "bg-red-500" };
  if (met <= 3) return { score: met, label: "Média", bar: "bg-amber-500" };
  if (met <= 4) return { score: met, label: "Boa", bar: "bg-lime-500" };
  return { score: met, label: "Forte", bar: "bg-emerald-500" };
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [user, loading, navigate]);

  function friendlyError(error: unknown) {
    const raw = error instanceof Error ? error.message : String(error);
    const m = raw.toLowerCase();
    if (m.includes("failed to fetch") || m.includes("network"))
      return "Sem conexão com o servidor. Verifique sua internet e tente de novo.";
    if (m.includes("weak") || m.includes("pwned"))
      return "Essa senha é muito comum e já apareceu em vazamentos. Escolha uma senha mais forte.";
    if (m.includes("already registered") || m.includes("user already"))
      return "Já existe uma conta com esse e-mail. Tente entrar.";
    if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
    if (m.includes("email not confirmed"))
      return "Confirme o e-mail que enviamos antes de entrar.";
    if (m.includes("rate limit") || m.includes("too many"))
      return "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.";
    return raw || "Não foi possível continuar.";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "criar") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Conta criada! Confirme o e-mail que enviamos para entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vinda de volta!");
      }
    } catch (error) {
      toast.error(friendlyError(error));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="card-premium w-full max-w-md p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-lift)]">
            <Baby className="size-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl leading-tight font-semibold text-foreground">
              {mode === "entrar" ? "Entrar na sua conta" : "Criar sua conta"}
            </h1>
            <p className="text-xs text-muted-foreground">
              Seus dados ficam salvos com segurança na nuvem.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="mt-7 h-12 w-full rounded-2xl"
          onClick={google}
          disabled={busy}
        >
          <LogIn className="size-5" /> Continuar com o Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> ou com e-mail <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">E-mail</Label>
            <Input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              className="h-12 rounded-2xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-password">Senha</Label>
            <Input
              id="auth-password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "criar" ? "new-password" : "current-password"}
              className="h-12 rounded-2xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === "criar" && (
              <div className="flex flex-col gap-3 rounded-2xl bg-muted/50 p-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Força da senha</span>
                    {password && (
                      <span
                        className={
                          strength.score <= 2
                            ? "text-red-600"
                            : strength.score <= 3
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }
                      >
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          password && i < strength.score ? strength.bar : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  Sua senha precisa ter:
                </p>
                <ul className="flex flex-col gap-1.5">
                  {passwordRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                          ok ? "text-emerald-700" : "text-muted-foreground"
                        }`}
                      >
                        {ok ? <Check className="size-3.5" /> : <X className="size-3.5 opacity-40" />}
                        {rule.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-2xl text-base" disabled={busy}>
            {busy ? <Loader2 className="size-5 animate-spin" /> : <Mail className="size-5" />}
            {mode === "entrar" ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <button
          type="button"
          className="mt-5 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setMode(mode === "entrar" ? "criar" : "entrar")}
        >
          {mode === "entrar" ? "Ainda não tenho conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
