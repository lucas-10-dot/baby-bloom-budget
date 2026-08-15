import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarHeart, PiggyBank, Target, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { brl, buildPlanSummary } from "@/lib/finance";

export const Route = createFileRoute("/planejamento")({
  head: () => ({
    meta: [
      { title: "Planejamento da chegada — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Descubra quanto guardar por mês até a chegada do bebê, com contas feitas automaticamente.",
      },
      { property: "og:title", content: "Planejamento da chegada do bebê" },
      {
        property: "og:description",
        content: "Data prevista, quanto guardar por mês e quanto ainda falta.",
      },
    ],
  }),
  component: Planejamento,
});

function Planejamento() {
  const { data, update } = useStore();
  const [form, setForm] = useState({
    dueDate: data.baby.dueDate ?? "",
    monthlySaving: String(data.financial.monthlySaving || ""),
    currentReserve: String(data.financial.currentReserve || ""),
    layetteBudget: String(data.financial.layetteBudget || ""),
    goalAmount: String(data.financial.goalAmount || ""),
  });

  const plan = buildPlanSummary(data);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    update((d) => ({
      ...d,
      isSample: false,
      baby: form.dueDate
        ? { ...d.baby, dueDate: form.dueDate }
        : (({ dueDate: _drop, ...rest }) => rest)(d.baby),
      financial: {
        ...d.financial,
        monthlySaving: Number(form.monthlySaving) || 0,
        currentReserve: Number(form.currentReserve) || 0,
        layetteBudget: Number(form.layetteBudget) || 0,
        goalAmount: Number(form.goalAmount) || 0,
      },
    }));
    toast.success("Planejamento salvo!", {
      description: "Atualizamos suas contas automaticamente.",
    });
  }

  return (
    <AppShell
      title="Planejamento da chegada"
      subtitle="Responda algumas perguntas simples e a gente faz as contas para você."
    >
      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Quando seu bebê deve nascer?"
            hint="Data prevista do parto."
            id="dueDate"
          >
            <Input
              id="dueDate"
              type="date"
              className="h-12 rounded-2xl"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Field>

          <Field
            label="Quanto você consegue guardar por mês?"
            hint="Um valor realista, mesmo que pequeno."
            id="monthlySaving"
          >
            <MoneyInput
              id="monthlySaving"
              value={form.monthlySaving}
              onChange={(v) => setForm({ ...form, monthlySaving: v })}
            />
          </Field>

          <Field
            label="Quanto você já tem reservado para o bebê?"
            id="currentReserve"
          >
            <MoneyInput
              id="currentReserve"
              value={form.currentReserve}
              onChange={(v) => setForm({ ...form, currentReserve: v })}
            />
          </Field>

          <Field label="Qual a meta total para o bebê?" id="goalAmount">
            <MoneyInput
              id="goalAmount"
              value={form.goalAmount}
              onChange={(v) => setForm({ ...form, goalAmount: v })}
            />
          </Field>

          <Field
            label="Qual é o orçamento do enxoval?"
            hint="Quanto pretende gastar com as coisas do bebê."
            id="layetteBudget"
          >
            <MoneyInput
              id="layetteBudget"
              value={form.layetteBudget}
              onChange={(v) => setForm({ ...form, layetteBudget: v })}
            />
          </Field>
        </div>

        <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-2xl text-base sm:w-auto sm:px-8">
          Salvar planejamento
        </Button>
      </form>

      <h2 className="mt-8 mb-4 font-display text-xl font-semibold text-foreground">
        O que isso significa
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Meta" value={brl(plan.goal)} tone="primary" icon={<Target className="size-5" />} />
        <StatCard label="Reservado" value={brl(plan.reserved)} tone="success" icon={<PiggyBank className="size-5" />} />
        <StatCard label="Falta" value={brl(plan.missing)} tone="warning" icon={<Wallet className="size-5" />} />
        <StatCard
          label="Tempo restante"
          value={
            plan.monthsLeft === null
              ? "—"
              : `${plan.monthsLeft} ${plan.monthsLeft === 1 ? "mês" : "meses"}`
          }
          hint={
            plan.monthsLeft === null
              ? "Informe a data prevista do parto."
              : "Até a data prevista do parto."
          }
          icon={<CalendarHeart className="size-5" />}
        />
        <StatCard
          label="Necessário guardar"
          value={plan.neededPerMonth === null ? "—" : `${brl(plan.neededPerMonth)}/mês`}
          hint="Valor por mês para chegar na sua meta a tempo."
          tone="info"
        />
        <StatCard
          label="Disponível hoje"
          value={brl(data.financial.availableBalance)}
          hint="Dinheiro livre para usar agora."
        />
      </div>

      {plan.onTrack !== null ? (
        <p
          className={`mt-5 rounded-3xl px-5 py-4 text-sm leading-relaxed ${
            plan.onTrack
              ? "bg-success-soft text-foreground"
              : "bg-warning-soft text-warning-foreground"
          }`}
        >
          {plan.onTrack
            ? `Boa notícia: guardando ${brl(data.financial.monthlySaving)} por mês você chega na sua meta no tempo previsto.`
            : `Guardando ${brl(data.financial.monthlySaving)} por mês, ainda falta um pouco. O ideal seria guardar ${brl(plan.neededPerMonth ?? 0)} por mês — ou ajustar a meta.`}
        </p>
      ) : null}
    </AppShell>
  );
}

function Field({
  label,
  hint,
  id,
  children,
}: {
  label: string;
  hint?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function MoneyInput({
  id,
  value,
  onChange,
  placeholder = "0",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground">
        R$
      </span>
      <Input
        id={id}
        inputMode="decimal"
        className="h-12 rounded-2xl pl-11"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(",", "."))}
      />
    </div>
  );
}
