import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home,
  Receipt,
  ShoppingBasket,
  Target,
  CalendarHeart,
  ShieldQuestion,
  Baby,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Início", short: "Início", icon: Home },
  { to: "/gastos", label: "Meus gastos", short: "Gastos", icon: Receipt },
  { to: "/enxoval", label: "Enxoval inteligente", short: "Enxoval", icon: ShoppingBasket },
  { to: "/metas", label: "Minhas metas", short: "Metas", icon: Target },
  { to: "/planejamento", label: "Planejamento da chegada", short: "Plano", icon: CalendarHeart },
  { to: "/antes-de-comprar", label: "Antes de comprar", short: "Comprar", icon: ShieldQuestion },
] as const;

const mobileNav = [nav[0], nav[1], nav[2], nav[3], nav[5]];

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar px-5 py-8 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Baby className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight font-semibold text-sidebar-foreground">
              Ninho Financeiro
            </p>
            <p className="truncate text-xs text-muted-foreground">
              O dinheiro da sua família, organizado
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl bg-primary-soft/60 p-4 text-xs leading-relaxed text-secondary-foreground">
          Este app ajuda você a organizar seu dinheiro. Ele não substitui
          orientação financeira profissional.
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="border-b border-border bg-[image:var(--gradient-calm)]">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 pt-8 pb-8 sm:px-8">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase lg:hidden">
                Ninho Financeiro
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)] lg:hidden">
              <Baby className="size-5" />
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 pt-6 pb-28 sm:px-8 lg:pb-16">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {mobileNav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 px-1 py-3 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-xl transition-colors",
                    active && "bg-primary-soft",
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                {item.short}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
