import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Baby, Check, Eye, EyeOff, Loader2, LogIn, Mail, ShieldCheck, Sparkles, X } from "lucide-react";
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
      { title: "Entrar — MamaWise" },
      { name: "description", content: "Acesse sua conta MamaWise com segurança e cuide melhor do dinheiro da sua família." },
      { property: "og:title", content: "Entrar no MamaWise" },
      { property: "og:description", content: "Seu planejamento financeiro familiar em um só lugar." },
      { property: "og:type", content: "website" },
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

function getPasswordStrength(password: string) {
  const score = passwordRules.filter((rule) => rule.test(password)).length;
  if (!password) return { score: 0, label: "Digite uma senha", tone: "text-muted-foreground", fill: "bg-border" };
  if (score <= 2) return { score, label: "Senha fraca", tone: "text-red-600", fill: "bg-red-500" };
  if (score === 3) return { score, label: "Senha média", tone: "text-amber-600", fill: "bg-amber-500" };
  if (score === 4) return { score, label: "Senha boa", tone: "text-lime-600", fill: "bg-lime-500" };
  return { score, label: "Senha forte", tone: "text-emerald-600", fill: "bg-emerald-500" };
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const canCreate = passwordRules.every((rule) => rule.test(password));

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [user, loading, navigate]);

  function friendlyError(error: unknown) {
    const raw = error instanceof Error ? error.message : String(error);
    const m = raw.toLowerCase();
    if (m.includes("failed to fetch") || m.includes("network")) return "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
    if (m.includes("weak") || m.includes("pwned")) return "Essa senha é muito comum. Escolha uma senha mais forte.";
    if (m.includes("already registered") || m.includes("user already")) return "Já existe uma conta com esse e-mail. Tente entrar.";
    if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
    if (m.includes("email not confirmed")) return "Confirme o e-mail que enviamos antes de entrar.";
    if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.";
    return raw || "Não foi possível continuar.";
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (mode === "criar" && !canCreate) {
      toast.error("Complete todos os requisitos da senha antes de criar sua conta.");
      return;
    }
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
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 size-96 rounded-full bg-fuchsia-200/30 blur-3xl" />

      <div className="relative m-auto grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_24px_80px_rgba(80,48,130,0.14)] backdrop-blur md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-600 p-10 text-white md:flex lg:p-12">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"><Baby className="size-6" /></span>
              <span className="text-2xl font-bold tracking-tight">MamaWise</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
              <Sparkles className="size-3.5" /> Mais tranquilidade para sua família
            </span>
            <h2 className="mt-6 max-w-sm text-4xl font-bold leading-tight">Cuide do dinheiro. Planeje o futuro dos seus filhos.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">Tenha seu orçamento, sua caixinha e suas decisões de compra organizados em um só lugar.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/75"><ShieldCheck className="size-5" /> Seus dados protegidos e sincronizados na nuvem</div>
        </section>

        <section className="p-6 sm:p-9 lg:p-12">
          <div className="mb-7 md:hidden">
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Baby className="size-5" /></span><span className="text-2xl font-bold text-violet-800">MamaWise</span></div>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-600">Sua família merece esse cuidado</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{mode === "entrar" ? "Bem-vinda de volta" : "Crie sua conta"}</h1>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{mode === "entrar" ? "Entre para continuar seu planejamento financeiro." : "É rápido, gratuito e seus dados ficam protegidos."}</p>
          </div>

          <Button type="button" variant="outline" size="lg" className="h-12 w-full rounded-2xl border-border/80 bg-white font-semibold shadow-sm" onClick={google} disabled={busy}>
            <LogIn className="size-5" /> Continuar com o Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> ou use seu e-mail <span className="h-px flex-1 bg-border" /></div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2"><Label htmlFor="auth-email">E-mail</Label><Input id="auth-email" type="email" required autoComplete="email" placeholder="voce@email.com" className="h-12 rounded-2xl bg-white" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-password">Senha</Label>
              <div className="relative">
                <Input id="auth-password" type={showPassword ? "text" : "password"} required minLength={mode === "criar" ? 8 : 6} autoComplete={mode === "criar" ? "new-password" : "current-password"} placeholder={mode === "criar" ? "Crie uma senha forte" : "Digite sua senha"} className="h-12 rounded-2xl bg-white pr-12" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted"><>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</></button>
              </div>

              {mode === "criar" && (
                <div className="mt-1 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3"><span className="text-xs font-semibold text-foreground">Força da senha</span><span className={`text-xs font-bold ${strength.tone}`}>{strength.label}</span></div>
                  <div className="mb-4 flex gap-1.5" aria-label={`Força da senha: ${strength.score} de 5`}>
                    {Array.from({ length: 5 }).map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full transition-all duration-200 ${i < strength.score ? strength.fill : "bg-border"}`} />)}
                  </div>
                  <p className="mb-2 text-xs font-semibold text-foreground">Para uma senha forte, inclua:</p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {passwordRules.map((rule) => { const ok = rule.test(password); return <li key={rule.label} className={`flex items-center gap-2 text-xs ${ok ? "font-medium text-emerald-700" : "text-muted-foreground"}`}>{ok ? <Check className="size-4 shrink-0" /> : <X className="size-4 shrink-0 opacity-40" />}{rule.label}</li>; })}
                  </ul>
                  {password && canCreate && <p className="mt-3 text-xs font-semibold text-emerald-700">✓ Sua senha atende a todos os requisitos.</p>}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="mt-1 h-12 rounded-2xl bg-violet-700 text-base font-semibold shadow-lg shadow-violet-200 hover:bg-violet-800" disabled={busy || (mode === "criar" && !canCreate)}>
              {busy ? <Loader2 className="size-5 animate-spin" /> : <Mail className="size-5" />}{mode === "entrar" ? "Entrar na minha conta" : "Criar minha conta"}
            </Button>
          </form>

          <button type="button" className="mt-5 w-full text-sm font-medium text-muted-foreground underline-offset-4 hover:text-violet-700 hover:underline" onClick={() => { setMode(mode === "entrar" ? "criar" : "entrar"); setPassword(""); }}>
            {mode === "entrar" ? "Ainda não tenho uma conta — criar agora" : "Já tenho uma conta — entrar"}
          </button>
        </section>
      </div>
    </main>
  );
}
