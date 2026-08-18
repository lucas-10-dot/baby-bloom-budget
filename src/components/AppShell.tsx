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
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar/80 px-5 py-8 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-lift)]">
            <Baby className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight font-semibold text-sidebar-foreground">
              Ninho Financeiro
            </p>
            <p className="truncate text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
              Finanças da família
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
                  "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                  active
                    ? "bg-card text-sidebar-accent-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                )}
              >
                {active ? (
                  <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[image:var(--gradient-gold)]" />
                ) : null}
                <item.icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    active ? "text-primary" : "group-hover:text-primary",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="card-premium mt-auto p-4 text-xs leading-relaxed text-muted-foreground">
          Este app ajuda você a organizar seu dinheiro. Ele não substitui
          orientação financeira profissional.
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="relative overflow-hidden border-b border-border bg-[image:var(--gradient-calm)]">
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[image:var(--gradient-gold)] opacity-70" />
          <span className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-primary-soft/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 pt-10 pb-10 sm:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase lg:hidden">
                Ninho Financeiro
              </p>
              <h1 className="mt-1 font-display text-[26px] leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-lift)] lg:hidden">
              <Baby className="size-5" />
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5 pt-8 pb-28 sm:px-8 lg:pb-16">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/85 backdrop-blur-xl lg:hidden">
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
                    "grid size-9 place-items-center rounded-xl transition-all duration-300",
                    active &&
                      "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-lift)]",
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

