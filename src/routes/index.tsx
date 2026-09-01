import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bell, ChevronRight, PiggyBank, ShoppingCart, Sparkles, TrendingDown, Wallet, Baby } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { brl, currentMonthKey, sumExpensesByMonth } from "@/lib/finance";
import { boxStats } from "@/lib/caixinha";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "MamaWise — seu dinheiro e o futuro do seu filho" }] }), component: Dashboard });

function Dashboard() {
  const { data } = useStore();
  const box = data.boxes[0];
  const stats = box ? boxStats(box, data.deposits) : null;
  const babyName = box?.childName || data.baby.babyName || "seu filho";
  const monthSpent = sumExpensesByMonth(data.expenses, currentMonthKey());
  const available = data.financial.availableBalance;

  return <AppShell title="Início" subtitle="Vamos cuidar hoje do seu dinheiro e do futuro do seu filho.">
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#eadcff] via-[#f8f3ff] to-[#fff] px-5 pb-4 pt-5 sm:px-7">
      <div className="relative z-10 max-w-[72%]"><p className="text-sm leading-relaxed text-[#4c4660]">Vamos cuidar hoje do seu orçamento e do futuro do seu filho.</p></div>
      <div className="absolute -right-3 bottom-0 text-[90px] leading-none opacity-80">👩‍👧</div>
    </div>

    <section className="mt-3 rounded-[24px] border border-[#e4d7fb] bg-[#fbf8ff] p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#efe5ff] text-[#7c3aed]"><PiggyBank className="size-6" /></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#6d28d9]">Caixinha do seu filho</p><ChevronRight className="size-5 text-[#7c3aed]" /></div><p className="mt-1 text-xl font-bold">{stats ? brl(stats.current) : "R$ 0,00"}</p><div className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{stats ? `${Math.round(stats.percent)}% da meta` : "Comece agora"}</span><span>Meta: {stats ? brl(stats.target) : "—"}</span></div></div></div><Progress value={stats?.percent ?? 0} className="mt-3 h-2" /></section>

    <Link to="/antes-de-comprar" className="mt-3 block rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white text-emerald-600 shadow-sm"><ShoppingCart className="size-6" /></span><div className="flex-1"><p className="text-xs font-bold text-emerald-700">Antes de Comprar</p><p className="mt-1 text-xs text-muted-foreground">Encontre o melhor preço antes de comprar.</p></div><ChevronRight className="size-5 text-emerald-600" /></div><span className="mt-3 block rounded-xl bg-emerald-600 py-2 text-center text-xs font-bold text-white">Comparar uma compra</span></Link>

    <Link to="/premium" className="mt-3 block rounded-[22px] border border-blue-200 bg-blue-50/60 p-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm"><Sparkles className="size-6" /></span><div className="flex-1"><p className="text-xs font-bold text-blue-700">Assistente MamaWise</p><p className="mt-1 text-xs text-muted-foreground">Posso ajudar você a economizar hoje.</p></div><ChevronRight className="size-5 text-blue-600" /></div><span className="mt-3 block rounded-xl bg-blue-600 py-2 text-center text-xs font-bold text-white">Falar com a IA</span></Link>

    <section className="mt-3 rounded-[22px] border border-[#ece8f4] bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Este mês</h2><Link to="/gastos" className="text-[10px] font-semibold text-[#6d28d9]">Ver detalhes</Link></div><div className="mt-4 grid grid-cols-3 divide-x"><Metric icon={<TrendingDown className="size-4" />} label="Gastos" value={brl(monthSpent)} tone="danger" /><Metric icon={<Wallet className="size-4" />} label="Saldo" value={brl(available)} tone="primary" /><Metric icon={<PiggyBank className="size-4" />} label="Economia" value={brl(stats?.savedThisMonth ?? 0)} tone="success" /></div></section>

    <Link to="/filho" className="mt-3 flex items-center gap-3 rounded-[22px] border border-[#ece8f4] bg-white p-4 shadow-sm"><span className="grid size-11 place-items-center rounded-2xl bg-[#f0e8ff] text-[#7c3aed]"><Baby className="size-5" /></span><div className="flex-1"><p className="text-xs text-muted-foreground">Meu Filho</p><p className="mt-1 text-sm font-semibold">Acompanhe informações e datas importantes de {babyName}.</p></div><ChevronRight className="size-5 text-muted-foreground" /></Link>
  </AppShell>;
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: "danger" | "primary" | "success" }) { const c = tone === "danger" ? "text-red-500" : tone === "success" ? "text-emerald-600" : "text-blue-600"; return <div className="px-2 text-center"><div className={`mx-auto grid size-9 place-items-center rounded-full bg-[#f6f4fa] ${c}`}>{icon}</div><p className="mt-1 text-[10px] text-muted-foreground">{label}</p><p className={`mt-0.5 truncate text-[11px] font-bold ${c}`}>{value}</p></div>; }
