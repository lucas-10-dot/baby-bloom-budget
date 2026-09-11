import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Baby, Pencil, PiggyBank, Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import {
  brl,
  currentMonthKey,
  expensesByCategory,
  monthKey,
  monthLabel,
  previousMonthKey,
  sumChildExpensesByMonth,
  sumExpensesByMonth,
  sumIncomesByMonth,
} from "@/lib/finance";
import type { Expense, ExpenseCategory, IncomeSource } from "@/lib/types";

export const Route = createFileRoute("/gastos")({
  head: () => ({
    meta: [
      { title: "Meu Orçamento — MamaWise" },
      { name: "description", content: "Registre entradas e gastos, compare os meses e veja quanto vai para o seu filho." },
      { property: "og:title", content: "Meu Orçamento — MamaWise" },
      { property: "og:description", content: "Entradas, gastos por categoria e comparação mensal em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Gastos,
});

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "Alimentação", label: "Alimentação" },
  { value: "Roupas", label: "Roupas" },
  { value: "Higiene", label: "Higiene" },
  { value: "Saúde", label: "Saúde" },
  { value: "Brinquedos", label: "Brinquedos" },
  { value: "Quarto", label: "Quarto" },
  { value: "Transporte", label: "Transporte" },
  { value: "Educação", label: "Educação" },
  { value: "Outros", label: "Outros" },
];

const incomeSources: IncomeSource[] = ["Salário", "Freelance", "Benefício", "Presente", "Outros"];
const colors = ["#6d35e8", "#24b987", "#f49b32", "#ef476f", "#8c8a99"];
const today = () => new Date().toISOString().slice(0, 10);
const dayLabel = (iso: string) => iso.split("-").reverse().slice(0, 2).join("/");

function Gastos() {
  const { data, addExpense, updateExpense, removeExpense, addIncome, removeIncome, setMonthlyIncome } = useStore();
  const [tab, setTab] = useState<"gastos" | "entradas">("gastos");
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [incomeDraft, setIncomeDraft] = useState("");

  const month = currentMonthKey();
  const prev = previousMonthKey();
  const incomes = data.incomes ?? [];

  const spent = sumExpensesByMonth(data.expenses, month);
  const spentPrev = sumExpensesByMonth(data.expenses, prev);
  const received = sumIncomesByMonth(incomes, month);
  const plannedIncome = data.financial.monthlyIncome ?? 0;
  const entries = received || plannedIncome;
  const balance = data.financial.availableBalance;
  const childSpent = sumChildExpensesByMonth(data.expenses, month);
  const cats = expensesByCategory(data.expenses, month).slice(0, 5);
  const diff = spent - spentPrev;
  const diffPercent = spentPrev > 0 ? Math.round((diff / spentPrev) * 100) : null;

  const monthExpenses = useMemo(
    () => data.expenses.filter((e) => monthKey(e.date) === month).sort((a, b) => b.date.localeCompare(a.date)),
    [data.expenses, month],
  );
  const monthIncomes = useMemo(
    () => incomes.filter((i) => monthKey(i.date) === month).sort((a, b) => b.date.localeCompare(a.date)),
    [incomes, month],
  );

  return (
    <AppShell title="Meu Orçamento">
      <section className="rounded-2xl border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Resumo de {monthLabel(month)}</h2>
        <div className="mt-2 divide-y divide-border">
          <Row icon={<ArrowUpRight className="size-4" />} label="Entradas" value={brl(entries)} tone="success" />
          <Row icon={<ArrowDownRight className="size-4" />} label="Gastos" value={brl(spent)} tone="danger" />
          <Row icon={<Wallet className="size-4" />} label="Saldo" value={brl(balance)} tone="primary" />
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-xl bg-muted p-3">
          <div className="min-w-[150px] flex-1">
            <Label className="text-[12px]">Renda mensal prevista</Label>
            <Input
              inputMode="decimal"
              className="mt-1"
              placeholder={plannedIncome ? String(plannedIncome) : "Ex.: 4000"}
              value={incomeDraft}
              onChange={(e) => setIncomeDraft(e.target.value.replace(",", "."))}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              const value = Number(incomeDraft);
              if (!value || value < 0) {
                toast.error("Informe um valor válido.");
                return;
              }
              setMonthlyIncome(value);
              setIncomeDraft("");
              toast.success("Renda mensal salva!");
            }}
          >
            Salvar
          </Button>
        </div>
      </section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Comparação com {monthLabel(prev)}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-[12px] text-muted-foreground">{monthLabel(prev)}</p>
            <p className="mt-1 text-base font-bold">{brl(spentPrev)}</p>
          </div>
          <div className="rounded-xl bg-muted p-3">
            <p className="text-[12px] text-muted-foreground">{monthLabel(month)}</p>
            <p className="mt-1 text-base font-bold">{brl(spent)}</p>
          </div>
        </div>
        <p className={`mt-2 text-[12px] font-semibold ${diff > 0 ? "text-destructive" : "text-success"}`}>
          {spentPrev === 0
            ? "Sem gastos no mês anterior para comparar."
            : diff === 0
              ? "Você gastou o mesmo do mês passado."
              : `${diff > 0 ? "Você gastou" : "Você economizou"} ${brl(Math.abs(diff))}${diffPercent !== null ? ` (${Math.abs(diffPercent)}%)` : ""} ${diff > 0 ? "a mais" : "a menos"} que no mês passado.`}
        </p>
      </section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Gastos por categoria</h2>
        {cats.length === 0 ? (
          <p className="mt-2 text-[12px] text-muted-foreground">Nenhum gasto registrado neste mês ainda.</p>
        ) : (
          <div className="mt-4 flex items-center gap-5">
            <div
              className="relative grid size-28 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(${cats
                  .map(
                    (c, i) =>
                      `${colors[i]} ${(cats.slice(0, i).reduce((a, x) => a + x.total, 0) / Math.max(spent, 1)) * 360}deg ${(cats.slice(0, i + 1).reduce((a, x) => a + x.total, 0) / Math.max(spent, 1)) * 360}deg`,
                  )
                  .join(",")})`,
              }}
            >
              <div className="grid size-16 place-items-center rounded-full bg-white">
                <span className="text-[12px] text-muted-foreground">
                  total
                  <br />
                  <b className="text-[12px] text-foreground">{brl(spent)}</b>
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {cats.map((c, i) => (
                <div key={c.category} className="flex items-center gap-2 text-[12px]">
                  <span className="size-2 rounded-full" style={{ background: colors[i] }} />
                  <span className="flex-1 truncate">{c.category}</span>
                  <b>{Math.round((c.total / Math.max(spent, 1)) * 100)}%</b>
                  <span>{brl(c.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mt-3 rounded-2xl border border-[#eadcf9] bg-[#fbf6ff] p-4">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-[#eee4ff] text-primary">
            <PiggyBank className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold">Gastos com meu filho</h2>
            <p className="text-[12px] text-muted-foreground">Some apenas os gastos marcados como do bebê</p>
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-primary">{brl(childSpent)}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-primary" style={{ width: `${spent > 0 ? Math.min(100, (childSpent / spent) * 100) : 0}%` }} />
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground">
          {spent > 0 ? `${Math.round((childSpent / spent) * 100)}% do total de gastos` : "Registre gastos para ver esta proporção"}
        </p>
      </section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4">
        <div className="flex gap-2">
          {(["gastos", "entradas"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
            >
              {t === "gastos" ? "Gastos do mês" : "Entradas do mês"}
            </button>
          ))}
        </div>

        {tab === "gastos" ? (
          <div className="mt-3 divide-y divide-border">
            {monthExpenses.length === 0 && <p className="py-3 text-[12px] text-muted-foreground">Nenhum gasto registrado neste mês.</p>}
            {monthExpenses.map((e) => (
              <div key={e.id} className="flex items-center gap-2 py-2.5 text-[12px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {e.description} {e.forChild && <Baby className="inline size-3 text-primary" />}
                  </p>
                  <p className="text-muted-foreground">
                    {dayLabel(e.date)} · {e.category}
                  </p>
                </div>
                <b className="text-destructive">{brl(e.amount)}</b>
                <button aria-label="Editar gasto" onClick={() => setEditing(e)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                  <Pencil className="size-4" />
                </button>
                <button
                  aria-label="Excluir gasto"
                  onClick={() => {
                    removeExpense(e.id);
                    toast.success("Gasto excluído.");
                  }}
                  className="rounded-lg p-1.5 text-destructive hover:bg-muted"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 divide-y divide-border">
            {monthIncomes.length === 0 && <p className="py-3 text-[12px] text-muted-foreground">Nenhuma entrada registrada neste mês.</p>}
            {monthIncomes.map((i) => (
              <div key={i.id} className="flex items-center gap-2 py-2.5 text-[12px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{i.description}</p>
                  <p className="text-muted-foreground">
                    {dayLabel(i.date)} · {i.source}
                  </p>
                </div>
                <b className="text-success">{brl(i.amount)}</b>
                <button
                  aria-label="Excluir entrada"
                  onClick={() => {
                    removeIncome(i.id);
                    toast.success("Entrada excluída.");
                  }}
                  className="rounded-lg p-1.5 text-destructive hover:bg-muted"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={() => setExpenseOpen(true)}>
            <Plus className="size-4" /> Gasto
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => setIncomeOpen(true)}>
            <Plus className="size-4" /> Entrada
          </Button>
        </div>
      </section>

      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar gasto</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={(values) => {
              addExpense(values);
              toast.success("Gasto registrado!");
            }}
            onClose={() => setExpenseOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Editar gasto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ExpenseForm
              initial={editing}
              onSubmit={(values) => {
                updateExpense(editing.id, values);
                toast.success("Gasto atualizado!");
              }}
              onClose={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar entrada</DialogTitle>
          </DialogHeader>
          <IncomeForm
            onSubmit={(values) => {
              addIncome(values);
              toast.success("Entrada registrada!");
            }}
            onClose={() => setIncomeOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Row({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "success" | "danger" | "primary" }) {
  const c = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : "text-primary";
  return (
    <div className="flex items-center gap-2 py-2.5 text-[13px]">
      <span className={c}>{icon}</span>
      <span className="flex-1">{label}</span>
      <b className={c}>{value}</b>
    </div>
  );
}

const selectClass =
  "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ExpenseForm({
  initial,
  onSubmit,
  onClose,
}: {
  initial?: Expense;
  onSubmit: (values: { amount: number; date: string; description: string; category: ExpenseCategory; forChild: boolean }) => void;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? "Outros");
  const [date, setDate] = useState(initial?.date ?? today());
  const [forChild, setForChild] = useState(initial?.forChild ?? false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || !description.trim()) {
      toast.error("Informe valor e descrição.");
      return;
    }
    onSubmit({ amount: value, date, description: description.trim(), category, forChild });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Valor</Label>
        <Input inputMode="decimal" className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value.replace(",", "."))} />
      </div>
      <div>
        <Label>Descrição</Label>
        <Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: fraldas" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Categoria</Label>
          <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {expenseCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Data</Label>
          <Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <label className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-[13px]">
        <input type="checkbox" checked={forChild} onChange={(e) => setForChild(e.target.checked)} className="size-4 accent-[hsl(var(--primary))]" />
        Este gasto é do meu filho
      </label>
      <Button type="submit" className="w-full">
        Salvar gasto
      </Button>
    </form>
  );
}

function IncomeForm({
  onSubmit,
  onClose,
}: {
  onSubmit: (values: { amount: number; date: string; description: string; source: IncomeSource }) => void;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState<IncomeSource>("Salário");
  const [date, setDate] = useState(today());

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || !description.trim()) {
      toast.error("Informe valor e descrição.");
      return;
    }
    onSubmit({ amount: value, date, description: description.trim(), source });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Valor</Label>
        <Input inputMode="decimal" className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value.replace(",", "."))} />
      </div>
      <div>
        <Label>Descrição</Label>
        <Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: salário" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Origem</Label>
          <select className={selectClass} value={source} onChange={(e) => setSource(e.target.value as IncomeSource)}>
            {incomeSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Data</Label>
          <Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Salvar entrada
      </Button>
    </form>
  );
}
