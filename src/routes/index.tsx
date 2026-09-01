import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Baby, ChevronRight, PiggyBank, ShoppingCart, Sparkles, TrendingDown, Wallet } from "lucide-react";
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
    <section className="relative min-h-[168px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff8ff] via-[#fbf4ff] to-[#f4eaff] px-4 py-4 sm:px-6">
      <div className="relative z-10 max-w-[62%]"><h2 className="text-[23px] font-bold leading-tight text-[#17152b]">Olá, mamãe! <span>💛</span></h2><p className="mt-2 text-[11px] leading-[1.55] text-[#55516b]">Vamos cuidar hoje do seu orçamento e do futuro do seu filho.</p></div>
      <div className="absolute -right-1 bottom-0 text-[86px] leading-none opacity-80">👩🏻‍🍼</div><div className="absolute right-[22%] top-6 text-sm">💗</div><div className="absolute right-[8%] top-20 text-xs">💜</div>
    </section>

    <Link to="/caixinha" className="relative z-10 -mt-1 block rounded-2xl border border-[#e8dafa] bg-white p-4 shadow-[0_6px_22px_rgba(91,44,140,.08)]">
      <div className="flex items-center gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f3eaff] text-2xl">🐷</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-[#302553]">Caixinha do seu filho</p><ChevronRight className="size-4 text-primary" /></div><p className="mt-1 text-lg font-bold">{stats ? brl(stats.current) : "R$ 0,00"}</p><div className="mt-2 flex items-center justify-between text-[9px]"><span className="font-semibold text-primary">{Math.round(stats?.percent ?? 0)}% da meta</span><span>Meta: {stats ? brl(stats.target) : "R$ 0,00"}</span></div><Progress value={stats?.percent ?? 0} className="mt-1.5 h-1.5 bg-[#eeeaf4] [&>div]:bg-primary" /></div></div>
    </Link>

    <Link to="/antes-de-comprar" className="mt-2 block rounded-2xl border border-[#d9f0e4] bg-[#f5fff9] p-3.5"><div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-success shadow-sm"><ShoppingCart className="size-5" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-[11px] font-bold text-success">Antes de Comprar <ChevronRight className="inline size-4" /></p></div><p className="mt-1 text-[10px] text-[#55516b]">Encontre o melhor preço antes de comprar.</p><span className="mt-2 inline-flex rounded-lg bg-success px-4 py-1.5 text-[10px] font-bold text-white">Comparar uma compra</span></div></div></Link>

    <Link to="/assistente" className="mt-2 block rounded-2xl border border-[#ddd9ff] bg-[#f7f6ff] p-3.5"><div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eee9ff] text-xl">🤖</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-[11px] font-bold text-[#2759d9]">Assistente MamaWise <ChevronRight className="inline size-4" /></p></div><p className="mt-1 text-[10px] text-[#55516b]">Posso ajudar você a economizar hoje.</p><span className="mt-2 inline-flex rounded-lg bg-[#3769dd] px-5 py-1.5 text-[10px] font-bold text-white">Falar com a IA</span></div></div></Link>

    <section className="mt-3 rounded-2xl border border-border bg-white p-3.5"><div className="flex items-center justify-between"><h2 className="text-[12px] font-bold">Este mês</h2><Link to="/gastos" className="text-[9px] font-semibold text-primary">Ver detalhes</Link></div><div className="mt-3 grid grid-cols-3 divide-x"><Metric icon={<TrendingDown className="size-4" />} label="Economia" value={brl(saved)} tone="success" /><Metric icon={<TrendingDown className="size-4" />} label="Gastos" value={brl(spent)} tone="danger" /><Metric icon={<Wallet className="size-4" />} label="Saldo" value={brl(balance)} tone="primary" /></div></section>

    <div className="mt-3 flex items-center gap-3 px-1"><span className="grid size-9 place-items-center rounded-full bg-primary-soft text-primary"><PiggyBank className="size-4" /></span><div><p className="text-[10px] font-semibold">Continue construindo o futuro de {babyName} 💜</p><p className="text-[9px] text-muted-foreground">Cada pequena economia conta.</p></div></div>
  </AppShell>;
}
function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "danger" | "primary" | "success" }) { const c = tone === "danger" ? "text-destructive" : tone === "success" ? "text-success" : "text-primary"; return <div className="px-2 text-center"><div className={`mx-auto grid size-8 place-items-center rounded-full bg-muted ${c}`}>{icon}</div><p className="mt-1 text-[8px] text-muted-foreground">{label}</p><p className={`mt-0.5 text-[10px] font-bold ${c}`}>{value}</p></div>; }
