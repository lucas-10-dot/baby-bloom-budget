import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Plus, Receipt, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { MoneyInput } from "@/routes/planejamento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { ExpenseCategory } from "@/lib/types";
import {
  brl,
  currentMonthKey,
  expensesByCategory,
  previousMonthKey,
  sumExpensesByMonth,
} from "@/lib/finance";

export const Route = createFileRoute("/gastos")({
  head: () => ({
    meta: [
      { title: "Meus gastos — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Registre os gastos com o bebê e veja, em gráficos simples, para onde o dinheiro está indo.",
      },
      { property: "og:title", content: "Meus gastos — Ninho Financeiro" },
      {
        property: "og:description",
        content: "Controle mês a mês quanto sua família gasta em cada categoria.",
      },
    ],
  }),
  component: Gastos,
});

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "Alimentação", label: "🍼 Alimentação" },
  { value: "Roupas", label: "👕 Roupas" },
  { value: "Higiene", label: "🧴 Higiene" },
  { value: "Saúde", label: "🏥 Saúde" },
  { value: "Brinquedos", label: "🧸 Brinquedos" },
  { value: "Quarto", label: "🏠 Quarto" },
  { value: "Transporte", label: "🚗 Transporte" },
  { value: "Educação", label: "📚 Educação" },
  { value: "Outros", label: "🛒 Outros" },
];

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function Gastos() {
  const { data, addExpense, removeExpense } = useStore();
  const [open, setOpen] = useState(false);

  const cur = currentMonthKey();
  const prev = previousMonthKey();
  const thisMonth = sumExpensesByMonth(data.expenses, cur);
  const lastMonth = sumExpensesByMonth(data.expenses, prev);
  const diff = thisMonth - lastMonth;
  const byCategory = expensesByCategory(data.expenses, cur);

  const monthExpenses = data.expenses
    .filter((e) => e.date.slice(0, 7) === cur)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <AppShell
      title="Meus gastos"
      subtitle="Registre o que você gasta e veja tudo organizado, sem complicação."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Gastos deste mês" value={brl(thisMonth)} tone="primary" />
        <StatCard label="Mês anterior" value={brl(lastMonth)} />
        <StatCard
          label="Comparação"
          value={`${diff >= 0 ? "+" : "-"} ${brl(Math.abs(diff))}`}
          tone={diff > 0 ? "warning" : "success"}
          hint={
            diff === 0
              ? "Você gastou o mesmo que no mês anterior."
              : diff > 0
                ? `Você gastou ${brl(Math.abs(diff))} a mais que no mês anterior.`
                : `Você gastou ${brl(Math.abs(diff))} a menos que no mês anterior.`
          }
        />
      </div>

      <div className="mt-6 flex justify-end">
        <NewExpenseDialog open={open} setOpen={setOpen} onAdd={addExpense} />
      </div>

      {byCategory.length > 0 ? (
        <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Onde o dinheiro foi este mês
          </h2>
          <div className="mt-5 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} margin={{ left: 0, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="4 6" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  formatter={(v: number) => [brl(v), "Gasto"]}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--color-border)",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="total" radius={[10, 10, 6, 6]}>
                  {byCategory.map((entry, i) => (
                    <Cell key={entry.category} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}

      <h2 className="mt-8 mb-4 font-display text-xl font-semibold text-foreground">
        Gastos deste mês
      </h2>

      {monthExpenses.length === 0 ? (
        <EmptyState
          icon={<Receipt className="size-6" />}
          title="Você ainda não registrou nenhum gasto."
          description="Assim que registrar, mostramos aqui o resumo e os gráficos."
          action={
            <Button size="lg" className="h-12 rounded-2xl" onClick={() => setOpen(true)}>
              <Plus className="size-5" /> Registrar primeiro gasto
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {monthExpenses.map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{e.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(e.date + "T00:00:00").toLocaleDateString("pt-BR")} ·{" "}
                  {e.category}
                </p>
                {e.note ? (
                  <p className="mt-1 truncate text-xs text-muted-foreground">{e.note}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-display text-lg font-semibold text-foreground">
                  {brl(e.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-xl text-muted-foreground"
                  aria-label={`Remover gasto ${e.description}`}
                  onClick={() => removeExpense(e.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function NewExpenseDialog({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAdd: ReturnType<typeof useStore>["addExpense"];
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Outros");
  const [note, setNote] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || !description.trim()) {
      toast.error("Preencha o valor e a descrição.");
      return;
    }
    onAdd({
      amount: value,
      date,
      description: description.trim(),
      category,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    toast.success("Gasto registrado!", { description: "Atualizamos seus totais." });
    setAmount("");
    setDescription("");
    setNote("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 w-full rounded-2xl text-base sm:w-auto">
          <Plus className="size-5" /> Registrar gasto
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar gasto</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor</Label>
            <MoneyInput id="amount" value={amount} onChange={setAmount} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="desc">Descrição</Label>
            <Input
              id="desc"
              className="h-12 rounded-2xl"
              placeholder="Ex: fraldas"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              className="h-12 rounded-2xl"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
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
            <Label htmlFor="note">Observação (opcional)</Label>
            <Textarea
              id="note"
              className="rounded-2xl"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-2xl text-base">
            Salvar gasto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
