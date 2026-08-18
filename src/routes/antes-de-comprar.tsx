import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MoneyInput } from "@/routes/planejamento";
import { expenseCategories } from "@/routes/gastos";
import { priorityLabel } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { ExpenseCategory, Priority } from "@/lib/types";
import { analyzePurchase, brl, type AnalysisResult } from "@/lib/finance";

export const Route = createFileRoute("/antes-de-comprar")({
  head: () => ({
    meta: [
      { title: "Antes de comprar — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Veja em segundos como uma compra afeta o orçamento da família antes de gastar.",
      },
      { property: "og:title", content: "Antes de comprar — Ninho Financeiro" },
      {
        property: "og:description",
        content: "Uma análise visual e simples para decidir com mais tranquilidade.",
      },
    ],
  }),
  component: AntesDeComprar,
});

const priorities: Priority[] = ["essencial", "importante", "pode_esperar"];

const verdictStyles = {
  ok: {
    box: "bg-success-soft",
    icon: <CheckCircle2 className="size-6 text-success" />,
    dot: "🟢",
  },
  atencao: {
    box: "bg-warning-soft",
    icon: <AlertTriangle className="size-6 text-warning-foreground" />,
    dot: "🟡",
  },
  risco: {
    box: "bg-danger-soft",
    icon: <XCircle className="size-6 text-destructive" />,
    dot: "🔴",
  },
} as const;

function AntesDeComprar() {
  const { data, addAnalysis } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Outros");
  const [priority, setPriority] = useState<Priority>("importante");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(price);
    if (!value) return;
    const analysis = analyzePurchase(data, value, priority);
    setResult(analysis);
    addAnalysis({
      productName: name.trim() || "Compra sem nome",
      price: value,
      category,
      priority,
      verdict: analysis.verdict,
      percentOfAvailable: analysis.percentOfAvailable,
      remainingAfter: analysis.remainingAfter,
    });
  }

  return (
    <AppShell
      title="Antes de comprar"
      subtitle="Antes de gastar, veja como essa compra afeta seu orçamento."
    >
      <form
        onSubmit={submit}
        className="card-premium p-5 sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="produto">Nome do produto</Label>
            <Input
              id="produto"
              className="h-12 rounded-2xl"
              placeholder="Ex: carrinho de bebê"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="preco-compra">Preço</Label>
            <MoneyInput id="preco-compra" value={price} onChange={setPrice} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {priorityLabel[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-2xl text-base sm:w-auto sm:px-8">
          Ver análise
        </Button>
      </form>

      {result ? (
        <section className={`mt-6 rounded-3xl border border-border p-5 sm:p-6 ${verdictStyles[result.verdict].box}`}>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Resultado
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="shrink-0">{verdictStyles[result.verdict].icon}</span>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {verdictStyles[result.verdict].dot} {result.headline}
            </h2>
          </div>

          <ul className="mt-5 flex flex-col gap-3">
            {result.explanation.map((line) => (
              <li
                key={line}
                className="rounded-2xl bg-card/80 px-4 py-3 text-sm leading-relaxed text-foreground"
              >
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-card">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, Math.round(result.percentOfAvailable))}%` }}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Esta é uma ferramenta de organização financeira para ajudar você a
            pensar antes de comprar. Não é aconselhamento financeiro profissional.
          </p>
        </section>
      ) : (
        <p className="mt-6 rounded-3xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">
          Preencha os campos acima para ver, de forma simples, o impacto da compra
          nos seus {brl(data.financial.availableBalance)} disponíveis.
        </p>
      )}
    </AppShell>
  );
}
