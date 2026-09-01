import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Baby, Loader2, LogIn, Mail } from "lucide-react";
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
      toast.error(error instanceof Error ? error.message : "Não foi possível continuar.");
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
