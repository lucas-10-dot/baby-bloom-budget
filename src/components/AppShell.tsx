import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, ShoppingCart, PiggyBank, Smile, Menu, Bell, Receipt, Baby } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountButton } from "@/components/AccountButton";

const nav = [
  { to: "/", label: "Início", short: "Início", icon: Home },
  { to: "/antes-de-comprar", label: "Antes de Comprar", short: "Comprar", icon: ShoppingCart },
  { to: "/caixinha", label: "Caixinha do seu filho", short: "Caixinha", icon: PiggyBank },
  { to: "/filho", label: "Meu Filho", short: "Filho", icon: Smile },
  { to: "/mais", label: "Mais", short: "Mais", icon: Menu },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname.startsWith(to);
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-white px-5 py-7 lg:flex">
      <Link to="/" className="flex items-center gap-2 px-2"><span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary"><Baby className="size-6" /></span><span className="font-display text-[23px] font-bold text-primary">MamaWise</span></Link>
      <nav className="mt-9 flex flex-col gap-1">{nav.map((item) => <Link key={item.to} to={item.to} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold", isActive(item.to) ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted") }><item.icon className="size-5" />{item.label}</Link>)}<Link to="/gastos" className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold", isActive("/gastos") ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted")}><Receipt className="size-5" />Meu Orçamento</Link></nav>
      <div className="mt-auto rounded-3xl bg-primary-soft p-4 text-xs leading-relaxed text-primary">Cuide do seu dinheiro hoje para construir um futuro mais tranquilo para seu filho. 💜</div>
    </aside>
    <div className="lg:pl-64">
      <header className="border-b border-border bg-white lg:border-0 lg:bg-transparent">
        <div className="mx-auto max-w-5xl px-4 pb-3 pt-3 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex items-center justify-between lg:hidden"><Link to="/" className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary"><Baby className="size-5" /></span><span className="font-display text-[22px] font-bold text-primary">MamaWise</span></Link><div className="flex items-center gap-1"><button aria-label="Notificações" className="relative grid size-10 place-items-center rounded-xl"><Bell className="size-5" /><span className="absolute right-1 top-0 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-white">3</span></button><AccountButton /></div></div>
          <div className="hidden lg:flex lg:items-center lg:justify-between"><div><h1 className="font-display text-3xl font-bold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div><AccountButton /></div>
          {pathname !== "/" && <div className="relative mt-3 flex items-center justify-center lg:hidden"><Link to="/" className="absolute left-0 text-xl leading-none" aria-label="Voltar">‹</Link><h1 className="text-[14px] font-bold">{title}</h1></div>}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-2 sm:px-6 lg:px-8 lg:pb-12 lg:pt-0">{children}</main>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 backdrop-blur-xl lg:hidden"><div className="mx-auto grid max-w-md grid-cols-5 px-2 py-1.5">{nav.map((item) => <Link key={item.to} to={item.to} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[9px] font-medium", isActive(item.to) ? "text-primary" : "text-muted-foreground")}><span className={cn("grid size-8 place-items-center rounded-xl", isActive(item.to) && "bg-primary-soft")}><item.icon className="size-[18px]" /></span>{item.short}</Link>)}</div></nav>
  </div>;
}
