import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { PiggyBank, Target, Wallet, TrendingUp, Plus, ShieldQuestion } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import {
  brl,
  buildPlanSummary,
  currentMonthKey,
  reserveEvolution,
  sumExpensesByMonth,
} from "@/lib/finance";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ninho Financeiro — organize o dinheiro da sua família" },
      {
        name: "description",
        content:
          "Planeje a chegada do bebê, controle gastos, monte o enxoval e crie metas com tranquilidade.",
      },
      { property: "og:title", content: "Ninho Financeiro — Minha Família" },
      {
        property: "og:description",
        content:
          "Um jeito simples e acolhedor de organizar o dinheiro na gravidez e nos primeiros anos.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, hydrated } = useStore();
  const plan = buildPlanSummary(data);
  const monthSpent = sumExpensesByMonth(data.expenses, currentMonthKey());
  const chart = reserveEvolution(data.financial.currentReserve, data.financial.monthlySaving);
  const percent = plan.goal > 0 ? Math.min(100, (plan.reserved / plan.goal) * 100) : 0;

  const steps = [
    {
      color: "bg-success",
      text:
        plan.neededPerMonth && plan.neededPerMonth > 0
          ? `Reservar ${brl(plan.neededPerMonth)} este mês`
          : "Definir quanto quer guardar por mês",
      to: "/planejamento" as const,
    },
    {
      color: "bg-warning",
      text: "Comprar itens essenciais do enxoval",
      to: "/enxoval" as const,
    },
    { color: "bg-info", text: "Revisar gastos deste mês", to: "/gastos" as const },
  ];

  return (
    <AppShell
      title="Minha Família"
      subtitle="Olá! Vamos cuidar melhor do dinheiro da sua família."
    >
      {hydrated && data.isSample ? (
        <p className="mb-5 rounded-2xl bg-accent/60 px-4 py-3 text-sm text-accent-foreground">
          Estes são dados de exemplo, só para você ver como o app funciona. Ao
          registrar suas próprias informações, eles saem de cena.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Saldo disponível"
          value={brl(data.financial.availableBalance)}
          hint="É o dinheiro que você pode usar hoje."
          tone="primary"
          icon={<Wallet className="size-5" />}
        />
        <StatCard
          label="Meta para o bebê"
          value={brl(plan.goal)}
          hint="O valor que você quer ter guardado."
          icon={<Target className="size-5" />}
        />
        <StatCard
          label="Já reservado"
          value={brl(plan.reserved)}
          hint="Quanto você já separou para o bebê."
          tone="success"
          icon={<PiggyBank className="size-5" />}
        />
        <StatCard
          label="Falta"
          value={brl(plan.missing)}
          hint={
            plan.monthsLeft !== null
              ? `Faltam ${plan.monthsLeft} ${plan.monthsLeft === 1 ? "mês" : "meses"} até a data prevista.`
              : "Informe a data prevista no planejamento."
          }
          tone="warning"
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              Evolução da sua reserva
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você já guardou {Math.round(percent)}% do valor que planejou.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
            {Math.round(percent)}%
          </span>
        </div>

        <Progress value={percent} className="mt-4 h-2.5" />

        <div className="mt-5 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="reserva" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <Tooltip
                cursor={{ stroke: "var(--color-border)" }}
                formatter={(v: number) => [brl(v), "Reserva"]}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid var(--color-border)",
                  fontSize: 13,
                }}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#reserva)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Próximos passos</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {steps.map((step) => (
              <li key={step.text}>
                <Link
                  to={step.to}
                  className="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <span className={`size-2.5 shrink-0 rounded-full ${step.color}`} />
                  <span className="min-w-0">{step.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-[image:var(--gradient-calm)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Este mês</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Você já gastou {brl(monthSpent)} com a família neste mês.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 flex-1 rounded-2xl text-base">
              <Link to="/gastos">
                <Plus className="size-5" /> Registrar gasto
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 flex-1 rounded-2xl border-primary/30 bg-card text-base"
            >
              <Link to="/antes-de-comprar">
                <ShieldQuestion className="size-5" /> Planejar compra
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
