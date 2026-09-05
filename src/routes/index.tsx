import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, PiggyBank, ShoppingCart, Sparkles, TrendingDown, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { brl, currentMonthKey, sumExpensesByMonth } from "@/lib/finance";
import { boxStats } from "@/lib/caixinha";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "MamaWise" }, { name: "description", content: "Seu dinheiro, suas compras e o futuro do seu filho em um só lugar." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useStore();
  const box = data.boxes[0];
  const stats = box ? boxStats(box, data.deposits) : null;
  const babyName = box?.childName || data.baby.babyName || "seu filho";
  const spent = sumExpensesByMonth(data.expenses, currentMonthKey());
  const saved = stats?.savedThisMonth ?? 0;
  const balance = data.financial.availableBalance;

  return <AppShell title="Início">
    <div className="space-y-3">
      <section className="relative min-h-[190px] overflow-hidden rounded-[28px] border border-[#eadff5] bg-gradient-to-br from-[#fffaff] via-[#faf4ff] to-[#f0e5ff] px-5 py-5 shadow-[0_12px_35px_rgba(95,58,150,.08)] sm:px-7">
        <div className="relative z-10 max-w-[68%] pt-1">
          <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[9px] font-bold text-primary shadow-sm">Seu momento de hoje ✨</span>
          <h2 className="mt-4 text-[24px] font-bold leading-[1.12] text-[#211a35]">Olá, mamãe! <span>💜</span></h2>
          <p className="mt-2.5 max-w-[280px] text-[11px] leading-[1.55] text-[#625a70]">Vamos cuidar do seu orçamento e construir, um pouquinho por vez, o futuro de {babyName}.</p>
        </div>
        <div className="absolute -right-2 bottom-[-7px] text-[92px] leading-none drop-shadow-sm">👩🏻‍🍼</div>
        <div className="absolute right-[27%] top-7 text-sm">💗</div><div className="absolute right-[8%] top-20 text-xs">✨</div>
      </section>

      <Link to="/caixinha" className="group block rounded-[24px] border border-[#e5d5f5] bg-white p-4 shadow-[0_8px_25px_rgba(91,44,140,.07)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(91,44,140,.11)] sm:p-5">
        <div className="flex items-center gap-3.5"><span className="grid size-12 shrink-0 place-items-center rounded-[17px] bg-[#f1e8ff] text-2xl">🐷</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-[.06em] text-primary">Caixinha do futuro</p><p className="mt-1 text-[18px] font-bold tracking-tight text-[#211a35]">{stats ? brl(stats.current) : "R$ 0,00"}</p></div><ChevronRight className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" /></div><div className="mt-2.5 flex items-center justify-between text-[9px]"><span className="font-bold text-primary">{Math.round(stats?.percent ?? 0)}% da meta</span><span className="text-muted-foreground">Meta {stats ? brl(stats.target) : "R$ 0,00"}</span></div><Progress value={stats?.percent ?? 0} className="mt-1.5 h-2 bg-[#eee8f6] [&>div]:bg-primary" /></div></div>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link to="/antes-de-comprar" className="group rounded-[24px] border border-[#d8eee2] bg-gradient-to-br from-[#f7fffa] to-[#effbf5] p-4 transition-all hover:-translate-y-0.5 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-success shadow-sm"><ShoppingCart className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-[11px] font-bold text-success">Antes de Comprar</p><ChevronRight className="size-4 text-success" /></div><p className="mt-1.5 text-[10px] leading-relaxed text-[#5c6670]">Compare antes de gastar e descubra onde vale mais a pena.</p><span className="mt-3 inline-flex rounded-xl bg-success px-3.5 py-2 text-[9px] font-bold text-white shadow-sm">Comparar uma compra</span></div></div></Link>
        <Link to="/assistente" className="group rounded-[24px] border border-[#dfdbf7] bg-gradient-to-br from-[#faf9ff] to-[#f2efff] p-4 transition-all hover:-translate-y-0.5 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#ece7ff] text-xl">🤖</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-[11px] font-bold text-primary">Assistente MamaWise</p><ChevronRight className="size-4 text-primary" /></div><p className="mt-1.5 text-[10px] leading-relaxed text-[#5c5870]">Uma ajudinha inteligente para suas decisões financeiras.</p><span className="mt-3 inline-flex rounded-xl bg-primary px-3.5 py-2 text-[9px] font-bold text-white shadow-sm">Falar com a IA</span></div></div></Link>
      </div>

      <section className="rounded-[24px] border border-border bg-white p-4 shadow-[0_6px_20px_rgba(35,25,55,.04)] sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-muted-foreground">Visão rápida</p><h2 className="mt-1 text-[15px] font-bold">Este mês</h2></div><Link to="/gastos" className="rounded-lg px-2 py-1 text-[9px] font-bold text-primary hover:bg-primary-soft">Ver detalhes</Link></div><div className="mt-4 grid grid-cols-3 divide-x divide-border"><Metric icon={<PiggyBank className="size-4" />} label="Economia" value={brl(saved)} tone="success" /><Metric icon={<TrendingDown className="size-4" />} label="Gastos" value={brl(spent)} tone="danger" /><Metric icon={<Wallet className="size-4" />} label="Saldo" value={brl(balance)} tone="primary" /></div></section>

      <div className="flex items-center gap-3 rounded-2xl bg-[#faf7ff] px-4 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><Sparkles className="size-4" /></span><div><p className="text-[10px] font-bold text-[#322a45]">Continue construindo o futuro de {babyName} 💜</p><p className="mt-0.5 text-[9px] text-muted-foreground">Cada pequena economia conta.</p></div></div>
    </div>
  </AppShell>;
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "danger" | "primary" | "success" }) {
  const c = tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary";
  return <div className="px-2 text-center"><div className={`mx-auto grid size-9 place-items-center rounded-xl bg-muted ${c}`}>{icon}</div><p className="mt-1.5 text-[8px] font-medium text-muted-foreground">{label}</p><p className={`mt-0.5 text-[11px] font-bold ${c}`}>{value}</p></div>;
}
