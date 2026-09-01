import { createFileRoute, Link } from "@tanstack/react-router";
import { Baby, Bell, ChevronRight, PiggyBank, ShoppingCart, Sparkles, TrendingDown, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { brl, currentMonthKey, sumExpensesByMonth } from "@/lib/finance";
import { boxStats } from "@/lib/caixinha";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MamaWise — cuide do seu dinheiro e do futuro do seu filho" },
      { name: "description", content: "Organize seu dinheiro, compare compras e construa uma reserva para seu filho." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, hydrated } = useStore();
  const box = data.boxes[0];
  const boxData = box ? boxStats(box, data.deposits) : null;
  const babyName = box?.childName || data.baby.babyName || "seu filho";
  const monthSpent = sumExpensesByMonth(data.expenses, currentMonthKey());
  const available = data.financial.availableBalance;
  const economy = data.analyses.reduce((sum, item) => sum + Math.max(0, item.price * 0), 0);

  return (
    <AppShell title="Início" subtitle="Vamos cuidar hoje do seu dinheiro e do futuro do seu filho.">
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <div>
          <p className="text-sm text-muted-foreground">Olá, mamãe! 💛</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Tudo bem por aí?</h2>
        </div>
        <span className="relative grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Bell className="size-5" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>
        </span>
      </div>

      {hydrated && data.isSample ? (
        <div className="mb-5 rounded-2xl border border-primary/10 bg-primary-soft px-4 py-3 text-sm text-muted-foreground">
          Você está vendo dados de exemplo. Registre suas informações para personalizar o MamaWise.
        </div>
      ) : null}

      <section className="overflow-hidden rounded-[28px] bg-[image:var(--gradient-primary)] p-5 text-primary-foreground shadow-[var(--shadow-lift)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-85">Caixinha de {babyName}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{boxData ? brl(boxData.current) : "R$ 0,00"}</p>
            <p className="mt-1 text-sm opacity-85">Meta {boxData ? brl(boxData.target) : "defina uma meta"}</p>
          </div>
          <span className="grid size-14 place-items-center rounded-2xl bg-white/15"><PiggyBank className="size-7" /></span>
        </div>
        <Progress value={boxData?.percent ?? 0} className="mt-5 h-2 bg-white/20 [&>div]:bg-white" />
        <div className="mt-2 flex justify-between text-xs opacity-85">
          <span>{Math.round(boxData?.percent ?? 0)}% da meta</span>
          <span>{boxData ? `Falta ${brl(boxData.remaining)}` : "Comece agora"}</span>
        </div>
        <Button asChild variant="secondary" className="mt-5 h-11 rounded-2xl bg-white text-primary hover:bg-white/90">
          <Link to="/caixinha">Ver minha caixinha <ChevronRight className="size-4" /></Link>
        </Button>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Link to="/antes-de-comprar" className="group rounded-[26px] border border-success/20 bg-success-soft p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-success shadow-sm"><ShoppingCart className="size-6" /></span>
            <ChevronRight className="size-5 text-success" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Antes de Comprar</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Compare ofertas e descubra onde vale mais a pena comprar.</p>
          <span className="mt-4 inline-flex items-center rounded-xl bg-success px-4 py-2 text-sm font-semibold text-success-foreground">Comparar uma compra</span>
        </Link>

        <Link to="/premium" className="group rounded-[26px] border border-primary/15 bg-primary-soft/40 p-5 transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-sm"><Sparkles className="size-6" /></span>
            <ChevronRight className="size-5 text-primary" />
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Assistente MamaWise</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Receba orientações para economizar e tomar decisões melhores.</p>
          <span className="mt-4 inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Falar com a IA</span>
        </Link>
      </div>

      <section className="mt-5 rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Este mês</h2>
          <Link to="/gastos" className="text-sm font-semibold text-primary">Ver detalhes</Link>
        </div>
        <div className="mt-5 grid grid-cols-3 divide-x divide-border">
          <Metric icon={<TrendingDown className="size-5" />} label="Gastos" value={brl(monthSpent)} tone="danger" />
          <Metric icon={<Wallet className="size-5" />} label="Saldo" value={brl(available)} tone="primary" />
          <Metric icon={<PiggyBank className="size-5" />} label="Guardado" value={brl(boxData?.savedThisMonth ?? 0)} tone="success" />
        </div>
      </section>

      <Link to="/filho" className="mt-5 flex items-center gap-4 rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-muted/40">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary"><Baby className="size-6" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Meu Filho</p>
          <p className="mt-1 font-semibold text-foreground">Acompanhe informações e datas importantes de {babyName}.</p>
        </div>
        <ChevronRight className="size-5 text-muted-foreground" />
      </Link>
    </AppShell>
  );
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "danger" | "primary" | "success" }) {
  const toneClass = tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary";
  return <div className="min-w-0 px-3 text-center first:pl-0 last:pr-0"><div className={`mx-auto grid size-10 place-items-center rounded-full bg-muted ${toneClass}`}>{icon}</div><p className="mt-2 text-xs text-muted-foreground">{label}</p><p className={`mt-1 truncate text-sm font-bold ${toneClass}`}>{value}</p></div>;
}
