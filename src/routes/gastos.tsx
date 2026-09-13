import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useMemo, useState } from "react";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Baby, BarChart3, CalendarDays, Pencil, PiggyBank, Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import { brl, currentMonthKey, expensesByCategory, monthKey, monthLabel, sumChildExpensesByMonth, sumExpensesByMonth, sumIncomesByMonth } from "@/lib/finance";
import type { Expense, ExpenseCategory, IncomeSource } from "@/lib/types";

export const Route = createFileRoute("/gastos")({
  head: () => ({ meta: [
    { title: "Meu Orçamento — MamaWise" },
    { name: "description", content: "Consulte seu orçamento, histórico mensal, categorias e evolução financeira." },
  ] }),
  component: Gastos,
});

export const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: "Alimentação", label: "Alimentação" }, { value: "Roupas", label: "Roupas" }, { value: "Higiene", label: "Higiene" },
  { value: "Saúde", label: "Saúde" }, { value: "Brinquedos", label: "Brinquedos" }, { value: "Quarto", label: "Quarto" },
  { value: "Transporte", label: "Transporte" }, { value: "Educação", label: "Educação" }, { value: "Outros", label: "Outros" },
];

const incomeSources: IncomeSource[] = ["Salário", "Freelance", "Benefício", "Presente", "Outros"];
const colors = ["#6d35e8", "#24b987", "#f49b32", "#ef476f", "#8c8a99"];
const today = () => new Date().toISOString().slice(0, 10);
const dayLabel = (iso: string) => iso.split("-").reverse().slice(0, 2).join("/");

function shiftMonth(key: string, amount: number) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1 + amount, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function fullMonthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function initialMonth() {
  if (typeof window === "undefined") return currentMonthKey();
  const value = new URLSearchParams(window.location.search).get("mes");
  return value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : currentMonthKey();
}

function Gastos() {
  const { data, addExpense, updateExpense, removeExpense, addIncome, removeIncome, setMonthlyIncome } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [tab, setTab] = useState<"gastos" | "entradas">("gastos");
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [incomeDraft, setIncomeDraft] = useState("");

  const month = selectedMonth;
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);
  const now = currentMonthKey();
  const incomes = data.incomes ?? [];
  const spent = sumExpensesByMonth(data.expenses, month);
  const spentPrev = sumExpensesByMonth(data.expenses, prev);
  const received = sumIncomesByMonth(incomes, month);
  const plannedIncome = data.financial.monthlyIncome ?? 0;
  const entries = received || (month === now ? plannedIncome : 0);
  const result = entries - spent;
  const childSpent = sumChildExpensesByMonth(data.expenses, month);
  const cats = expensesByCategory(data.expenses, month).slice(0, 5);
  const diff = spent - spentPrev;
  const diffPercent = spentPrev > 0 ? Math.round((diff / spentPrev) * 100) : null;

  const monthExpenses = useMemo(() => data.expenses.filter((e) => monthKey(e.date) === month).sort((a, b) => b.date.localeCompare(a.date)), [data.expenses, month]);
  const monthIncomes = useMemo(() => incomes.filter((i) => monthKey(i.date) === month).sort((a, b) => b.date.localeCompare(a.date)), [incomes, month]);

  const history = useMemo(() => Array.from({ length: 6 }, (_, i) => shiftMonth(month, i - 5)).map((key) => ({
    key, label: monthLabel(key), spent: sumExpensesByMonth(data.expenses, key), entries: sumIncomesByMonth(incomes, key),
  })), [data.expenses, incomes, month]);
  const maxHistory = Math.max(1, ...history.map((item) => Math.max(item.spent, item.entries)));

  function selectMonth(key: string) {
    setSelectedMonth(key);
    const url = new URL(window.location.href);
    url.searchParams.set("mes", key);
    window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
  }

  return (
    <AppShell title="Meu Orçamento" subtitle="Entenda para onde seu dinheiro está indo e acompanhe sua evolução.">
      <section className="rounded-[28px] border border-[#e8def7] bg-gradient-to-br from-[#fbf8ff] to-white p-4 shadow-[0_12px_30px_rgba(75,45,120,.06)] sm:p-5">
        <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.1em] text-primary">Visão mensal</p><h2 className="mt-1 text-[20px] font-bold capitalize">{fullMonthLabel(month)}</h2></div><span className="grid size-10 place-items-center rounded-2xl bg-white text-primary shadow-sm"><CalendarDays className="size-5" /></span></div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-2 shadow-sm"><button onClick={() => selectMonth(prev)} aria-label="Mês anterior" className="grid size-10 place-items-center rounded-xl hover:bg-muted"><ArrowLeft className="size-4" /></button><div className="text-center"><p className="text-[9px] text-muted-foreground">Mês selecionado</p><p className="text-[13px] font-bold capitalize">{fullMonthLabel(month)}</p></div><button onClick={() => selectMonth(next)} disabled={next > now} aria-label="Próximo mês" className="grid size-10 place-items-center rounded-xl hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"><ArrowRight className="size-4" /></button></div>
        <div className="mt-4 grid grid-cols-3 gap-2"><MiniStat label="Entradas" value={brl(entries)} tone="success" /><MiniStat label="Gastos" value={brl(spent)} tone="danger" /><MiniStat label="Resultado" value={brl(result)} tone={result >= 0 ? "primary" : "danger"} /></div>
      </section>

      <section className="mt-3 rounded-[24px] border border-border bg-white p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Evolução dos últimos 6 meses</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Clique em qualquer mês para consultar seus dados.</p></div><BarChart3 className="size-5 text-primary" /></div><div className="mt-5 flex h-40 items-end gap-2">{history.map((item) => <button key={item.key} onClick={() => selectMonth(item.key)} className="group flex h-full min-w-0 flex-1 flex-col justify-end" title={`Ver ${fullMonthLabel(item.key)}`}><div className="flex h-full items-end justify-center gap-1"><span className={`w-2.5 rounded-t-md transition-all ${item.key === month ? "bg-primary" : "bg-[#cdb9f4]"}`} style={{ height: `${Math.max(item.spent > 0 ? 8 : 2, (item.spent / maxHistory) * 100)}%` }} /><span className={`w-2.5 rounded-t-md transition-all ${item.key === month ? "bg-success" : "bg-[#bfe8d3]"}`} style={{ height: `${Math.max(item.entries > 0 ? 8 : 2, (item.entries / maxHistory) * 100)}%` }} /></div><span className={`mt-2 text-[9px] font-semibold capitalize ${item.key === month ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span></button>)}</div><div className="mt-3 flex justify-center gap-4 text-[9px] text-muted-foreground"><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-primary" /> Gastos</span><span className="flex items-center gap-1"><i className="size-2 rounded-full bg-success" /> Entradas</span></div></section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4"><h2 className="text-sm font-bold">Comparação com {fullMonthLabel(prev)}</h2><div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted p-3"><p className="text-[11px] text-muted-foreground">{monthLabel(prev)}</p><p className="mt-1 text-base font-bold">{brl(spentPrev)}</p></div><div className="rounded-xl bg-muted p-3"><p className="text-[11px] text-muted-foreground">{monthLabel(month)}</p><p className="mt-1 text-base font-bold">{brl(spent)}</p></div></div><p className={`mt-2 text-[11px] font-semibold ${diff > 0 ? "text-destructive" : "text-success"}`}>{spentPrev === 0 ? "Sem gastos no mês anterior para comparar." : diff === 0 ? "Você gastou o mesmo do mês passado." : `${diff > 0 ? "Você gastou" : "Você economizou"} ${brl(Math.abs(diff))}${diffPercent !== null ? ` (${Math.abs(diffPercent)}%)` : ""} ${diff > 0 ? "a mais" : "a menos"} que no mês passado.`}</p></section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4"><h2 className="text-sm font-bold">Gastos por categoria</h2>{cats.length === 0 ? <p className="mt-2 text-[12px] text-muted-foreground">Nenhum gasto registrado neste mês ainda.</p> : <div className="mt-4 flex items-center gap-5"><div className="relative grid size-28 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(${cats.map((c, i) => `${colors[i]} ${(cats.slice(0, i).reduce((a, x) => a + x.total, 0) / Math.max(spent, 1)) * 360}deg ${(cats.slice(0, i + 1).reduce((a, x) => a + x.total, 0) / Math.max(spent, 1)) * 360}deg`).join(",")})` }}><div className="grid size-16 place-items-center rounded-full bg-white"><span className="text-[10px] text-muted-foreground">total<br /><b className="text-[11px] text-foreground">{brl(spent)}</b></span></div></div><div className="min-w-0 flex-1 space-y-2">{cats.map((c, i) => <div key={c.category} className="flex items-center gap-2 text-[11px]"><span className="size-2 shrink-0 rounded-full" style={{ background: colors[i] }} /><span className="flex-1 truncate">{c.category}</span><b>{Math.round((c.total / Math.max(spent, 1)) * 100)}%</b><span>{brl(c.total)}</span></div>)}</div></div>}</section>

      <section className="mt-3 rounded-2xl border border-[#eadcf9] bg-[#fbf6ff] p-4"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-[#eee4ff] text-primary"><PiggyBank className="size-4" /></span><div><h2 className="text-sm font-bold">Gastos com meu filho</h2><p className="text-[11px] text-muted-foreground">Somente lançamentos marcados como do filho.</p></div></div><p className="mt-3 text-2xl font-bold text-primary">{brl(childSpent)}</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-primary" style={{ width: `${spent > 0 ? Math.min(100, (childSpent / spent) * 100) : 0}%` }} /></div><p className="mt-1 text-[10px] text-muted-foreground">{spent > 0 ? `${Math.round((childSpent / spent) * 100)}% do total de gastos` : "Registre gastos para ver esta proporção"}</p></section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4"><div className="flex gap-2">{(["gastos", "entradas"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{t === "gastos" ? "Gastos do mês" : "Entradas do mês"}</button>)}</div>{tab === "gastos" ? <div className="mt-3 divide-y divide-border">{monthExpenses.length === 0 && <p className="py-3 text-[12px] text-muted-foreground">Nenhum gasto registrado neste mês.</p>}{monthExpenses.map((e) => <div key={e.id} className="flex items-center gap-2 py-2.5 text-[12px]"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{e.description} {e.forChild && <Baby className="inline size-3 text-primary" />}</p><p className="text-muted-foreground">{dayLabel(e.date)} · {e.category}</p></div><b className="text-destructive">{brl(e.amount)}</b><button aria-label="Editar gasto" onClick={() => setEditing(e)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><Pencil className="size-4" /></button><button aria-label="Excluir gasto" onClick={() => { removeExpense(e.id); toast.success("Gasto excluído."); }} className="rounded-lg p-1.5 text-destructive hover:bg-muted"><Trash2 className="size-4" /></button></div>)}</div> : <div className="mt-3 divide-y divide-border">{monthIncomes.length === 0 && <p className="py-3 text-[12px] text-muted-foreground">Nenhuma entrada registrada neste mês.</p>}{monthIncomes.map((i) => <div key={i.id} className="flex items-center gap-2 py-2.5 text-[12px]"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.description}</p><p className="text-muted-foreground">{dayLabel(i.date)} · {i.source}</p></div><b className="text-success">{brl(i.amount)}</b><button aria-label="Excluir entrada" onClick={() => { removeIncome(i.id); toast.success("Entrada excluída."); }} className="rounded-lg p-1.5 text-destructive hover:bg-muted"><Trash2 className="size-4" /></button></div>)}</div>}<div className="mt-4 flex gap-2"><Button className="flex-1" onClick={() => setExpenseOpen(true)}><Plus className="size-4" /> Gasto</Button><Button variant="secondary" className="flex-1" onClick={() => setIncomeOpen(true)}><Plus className="size-4" /> Entrada</Button></div></section>

      <section className="mt-3 rounded-[24px] bg-[#effbf4] p-4"><p className="text-[10px] font-bold text-success">💜 Análise MamaWise</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{result >= 0 ? `Você terminou ${fullMonthLabel(month)} com ${brl(result)} de resultado positivo. Continue acompanhando para transformar pequenas economias em futuro.` : `Seus gastos ficaram ${brl(Math.abs(result))} acima das entradas neste mês. Vale revisar as categorias e planejar o próximo mês.`}</p></section>

      <section className="mt-3 rounded-2xl border border-border bg-white p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Renda mensal prevista</h2><p className="mt-0.5 text-[10px] text-muted-foreground">Usada como referência quando não há entradas lançadas.</p></div></div><div className="mt-3 flex gap-2"><Input inputMode="decimal" placeholder={plannedIncome ? String(plannedIncome) : "Ex.: 4000"} value={incomeDraft} onChange={(e) => setIncomeDraft(e.target.value.replace(",", "."))} /><Button variant="secondary" onClick={() => { const value = Number(incomeDraft); if (!value || value < 0) { toast.error("Informe um valor válido."); return; } setMonthlyIncome(value); setIncomeDraft(""); toast.success("Renda mensal salva!"); }}>Salvar</Button></div></section>

      <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Adicionar gasto</DialogTitle></DialogHeader><ExpenseForm onSubmit={(values) => { addExpense(values); toast.success("Gasto registrado!"); }} onClose={() => setExpenseOpen(false)} /></DialogContent></Dialog>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Editar gasto</DialogTitle></DialogHeader>{editing && <ExpenseForm initial={editing} onSubmit={(values) => { updateExpense(editing.id, values); toast.success("Gasto atualizado!"); }} onClose={() => setEditing(null)} />}</DialogContent></Dialog>
      <Dialog open={incomeOpen} onOpenChange={setIncomeOpen}><DialogContent className="rounded-3xl"><DialogHeader><DialogTitle>Adicionar entrada</DialogTitle></DialogHeader><IncomeForm onSubmit={(values) => { addIncome(values); toast.success("Entrada registrada!"); }} onClose={() => setIncomeOpen(false)} /></DialogContent></Dialog>
    </AppShell>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "success" | "danger" | "primary" }) { const c = tone === "success" ? "text-success" : tone === "danger" ? "text-destructive" : "text-primary"; return <div className="rounded-2xl bg-white p-3 shadow-sm"><p className="text-[9px] text-muted-foreground">{label}</p><p className={`mt-1 truncate text-[12px] font-bold ${c}`}>{value}</p></div>; }
const selectClass = "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring";
function ExpenseForm({ initial, onSubmit, onClose }: { initial?: Expense; onSubmit: (values: { amount: number; date: string; description: string; category: ExpenseCategory; forChild: boolean }) => void; onClose: () => void }) { const [amount, setAmount] = useState(initial ? String(initial.amount) : ""); const [description, setDescription] = useState(initial?.description ?? ""); const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? "Outros"); const [date, setDate] = useState(initial?.date ?? today()); const [forChild, setForChild] = useState(initial?.forChild ?? false); function submit(e: FormEvent) { e.preventDefault(); const value = Number(amount); if (!value || !description.trim()) { toast.error("Informe valor e descrição."); return; } onSubmit({ amount: value, date, description: description.trim(), category, forChild }); onClose(); } return <form onSubmit={submit} className="space-y-4"><div><Label>Valor</Label><Input inputMode="decimal" className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value.replace(",", "."))} /></div><div><Label>Descrição</Label><Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: fraldas" /></div><div className="grid grid-cols-2 gap-3"><div><Label>Categoria</Label><select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>{expenseCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div><div><Label>Data</Label><Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div></div><label className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-[13px]"><input type="checkbox" checked={forChild} onChange={(e) => setForChild(e.target.checked)} className="size-4 accent-[hsl(var(--primary))]" /> Este gasto é do meu filho</label><Button type="submit" className="w-full">Salvar gasto</Button></form>; }
function IncomeForm({ onSubmit, onClose }: { onSubmit: (values: { amount: number; date: string; description: string; source: IncomeSource }) => void; onClose: () => void }) { const [amount, setAmount] = useState(""); const [description, setDescription] = useState(""); const [source, setSource] = useState<IncomeSource>("Salário"); const [date, setDate] = useState(today()); function submit(e: FormEvent) { e.preventDefault(); const value = Number(amount); if (!value || !description.trim()) { toast.error("Informe valor e descrição."); return; } onSubmit({ amount: value, date, description: description.trim(), source }); onClose(); } return <form onSubmit={submit} className="space-y-4"><div><Label>Valor</Label><Input inputMode="decimal" className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value.replace(",", "."))} /></div><div><Label>Descrição</Label><Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: salário" /></div><div className="grid grid-cols-2 gap-3"><div><Label>Origem</Label><select className={selectClass} value={source} onChange={(e) => setSource(e.target.value as IncomeSource)}>{incomeSources.map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div><Label>Data</Label><Input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} /></div></div><Button type="submit" className="w-full">Salvar entrada</Button></form>; }
