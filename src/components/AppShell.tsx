import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Receipt, ShoppingBasket, Target, CalendarHeart, ShieldQuestion, Baby, PiggyBank, Sparkles, Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountButton } from "@/components/AccountButton";

const nav = [
  { to: "/", label: "Início", short: "Início", icon: Home },
  { to: "/gastos", label: "Meu Orçamento", short: "Orçamento", icon: Receipt },
  { to: "/enxoval", label: "Enxoval inteligente", short: "Enxoval", icon: ShoppingBasket },
  { to: "/metas", label: "Minhas metas", short: "Metas", icon: Target },
  { to: "/caixinha", label: "Caixinha do seu filho", short: "Caixinha", icon: PiggyBank },
  { to: "/planejamento", label: "Planejamento", short: "Plano", icon: CalendarHeart },
  { to: "/antes-de-comprar", label: "Antes de Comprar", short: "Comprar", icon: ShieldQuestion },
  { to: "/premium", label: "MamaWise Premium", short: "Mais", icon: Sparkles },
  { to: "/filho", label: "Meu Filho", short: "Filho", icon: Baby },
] as const;

const mobileNav = [nav[0], nav[6], nav[4], nav[8], nav[7]];

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-[#fcfbff] text-[#17152b]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-[#ebe7f7] bg-white px-5 py-7 lg:flex">
        <Link to="/" className="flex items-center gap-3 px-2"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white shadow-sm"><Baby className="size-5" /></span><div><p className="font-display text-xl font-semibold text-[#241b45]">MamaWise</p><p className="text-[10px] font-medium uppercase tracking-[.16em] text-muted-foreground">Finanças da família</p></div></Link>
        <nav className="mt-9 flex flex-col gap-1">{nav.map((item) => { const active = pathname === item.to; return <Link key={item.to} to={item.to} className={cn("group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition", active ? "bg-[#f3edff] text-[#6d28d9]" : "text-muted-foreground hover:bg-[#faf7ff] hover:text-[#6d28d9]")}>{active ? <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#7c3aed]" /> : null}<item.icon className="size-5" /><span className="truncate">{item.label}</span></Link>; })}</nav>
        <div className="mt-auto rounded-3xl border border-[#eee8fb] bg-[#faf7ff] p-4 text-xs leading-relaxed text-muted-foreground">O MamaWise ajuda você a organizar o dinheiro, comprar melhor e construir o futuro do seu filho. 💜</div>
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-[#eeeaf6] bg-white lg:bg-[#fcfbff]">
          <div className="mx-auto max-w-5xl px-5 pb-5 pt-4 sm:px-8 lg:py-7">
            <div className="flex items-center justify-between lg:hidden">
              <Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-[#f2eaff] text-[#7c3aed]"><Baby className="size-5" /></span><span className="font-display text-xl font-semibold text-[#6d28d9]">MamaWise</span></Link>
              <div className="flex items-center gap-2"><button aria-label="Notificações" className="relative grid size-10 place-items-center rounded-xl text-[#211b3b]"><Bell className="size-5" /><span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">3</span></button><AccountButton /></div>
            </div>
            <div className="mt-5 hidden lg:flex items-center justify-between"><div><h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>{subtitle ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p> : null}</div><AccountButton /></div>
            <div className="mt-4 flex items-center justify-between lg:hidden">{pathname !== "/" ? <Link to="/" className="text-sm font-semibold text-[#6d28d9]">← Voltar</Link> : <div><p className="text-sm text-muted-foreground">Olá, mamãe! <span aria-hidden>💛</span></p><h1 className="mt-1 font-display text-[25px] font-semibold">Tudo bem por aí?</h1></div>}{pathname !== "/" ? <h1 className="font-display text-base font-semibold">{title}</h1> : null}<span className="w-12 lg:hidden" /></div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-28 pt-5 sm:px-8 lg:pb-16 lg:pt-7">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e9e5f4] bg-white/95 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-lg grid-cols-5">{mobileNav.map((item) => { const active = pathname === item.to; return <Link key={item.to} to={item.to} className={cn("flex flex-col items-center gap-1 px-1 py-2 text-[9px] font-medium", active ? "text-[#6d28d9]" : "text-[#737087]")}><span className={cn("grid size-8 place-items-center rounded-xl", active && "bg-[#f0e7ff] text-[#6d28d9]")}><item.icon className="size-[18px]" /></span>{item.short}</Link>; })}</div></nav>
    </div>
  );
}
