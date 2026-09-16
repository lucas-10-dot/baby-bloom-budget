import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Download, FileSpreadsheet, PiggyBank, Wallet, ArrowLeft, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { brl, currentMonthKey, expensesByCategory, monthKey, monthLabel, sumExpensesByMonth, sumIncomesByMonth } from "@/lib/finance";
import { boxStats, depositsOf } from "@/lib/caixinha";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [
    { title: "Relatórios — MamaWise" },
    { name: "description", content: "Visualize e baixe seus relatórios financeiros do MamaWise." },
  ] }),
  component: Relatorios,
});

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map(row => row.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Relatorios() {
  const { data } = useStore();
  const [active, setActive] = useState<"orcamento" | "caixinha">("orcamento");
  const [month, setMonth] = useState(currentMonthKey());
  const incomes = data.incomes ?? [];
  const spent = sumExpensesByMonth(data.expenses, month);
  const received = sumIncomesByMonth(incomes, month);
  const result = received - spent;
  const cats = expensesByCategory(data.expenses, month);
  const monthExpenses = data.expenses.filter(e => monthKey(e.date) === month).sort((a,b) => b.date.localeCompare(a.date));
  const monthIncomes = incomes.filter(i => monthKey(i.date) === month).sort((a,b) => b.date.localeCompare(a.date));
  const box = data.boxes[0];
  const stats = box ? boxStats(box, data.deposits) : null;
  const deposits = box ? depositsOf(data.deposits, box.id).sort((a,b) => b.date.localeCompare(a.date)) : [];

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  }), []);

  function exportBudget() {
    downloadCsv(`mamawise-orcamento-${month}.csv`, [
      ["MAMAWISE — MEU ORÇAMENTO"],
      ["Mês", monthLabel(month)], [],
      ["RESUMO", "VALOR"],
      ["Entradas", brl(received)],
      ["Gastos", brl(spent)],
      ["Resultado", brl(result)],
      [],
      ["GASTOS POR CATEGORIA", "VALOR", "PERCENTUAL"],
      ...cats.map(c => [c.category, brl(c.total), `${Math.round((c.total / Math.max(spent,1))*100)}%`]),
      [],
      ["LANÇAMENTOS DE GASTOS", "DATA", "CATEGORIA", "VALOR", "DO FILHO"],
      ...monthExpenses.map(e => [e.description, e.date, e.category, brl(e.amount), e.forChild ? "Sim" : "Não"]),
      [],
      ["LANÇAMENTOS DE ENTRADAS", "DATA", "ORIGEM", "VALOR"],
      ...monthIncomes.map(i => [i.description, i.date, i.source, brl(i.amount)]),
    ]);
  }

  function exportBox() {
    downloadCsv("mamawise-caixinha-do-seu-filho.csv", [
      ["MAMAWISE — CAIXINHA DO SEU FILHO"],
      ["Criança", box?.childName ?? "Não criada"],
      ["Objetivo", box?.objective ?? "—"], [],
      ["RESUMO", "VALOR"],
      ["Saldo atual", brl(stats?.current ?? 0)],
      ["Meta", brl(stats?.target ?? 0)],
      ["Falta", brl(stats?.remaining ?? 0)],
      ["Progresso", `${Math.round(stats?.percent ?? 0)}%`], [],
      ["MOVIMENTAÇÕES", "DATA", "DESCRIÇÃO", "VALOR"],
      ...deposits.map(d => ["Depósito", d.date, d.note || "Depósito", brl(d.amount)]),
    ]);
  }

  return (
    <AppShell title="Relatórios" subtitle="Uma visão organizada dos seus números, como um painel financeiro.">
      <div className="space-y-3">
        <section className="rounded-[28px] border border-[#e8def7] bg-gradient-to-br from-[#fbf8ff] to-white p-4 shadow-[0_12px_30px_rgba(75,45,120,.06)] sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-[10px] font-bold uppercase tracking-[.1em] text-primary">Painel financeiro</p><h2 className="mt-1 text-xl font-bold">Escolha o relatório</h2><p className="mt-1 text-xs text-muted-foreground">Clique para abrir os números detalhados e baixar a planilha.</p></div>
            <BarChart3 className="size-6 text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setActive("orcamento")} className={`rounded-2xl border p-3 text-left transition ${active === "orcamento" ? "border-primary bg-[#f5efff]" : "border-border bg-white"}`}><Wallet className={`size-5 ${active === "orcamento" ? "text-primary" : "text-muted-foreground"}`} /><p className="mt-2 text-sm font-bold">Meu Orçamento</p><p className="mt-0.5 text-[10px] text-muted-foreground">Entradas, gastos e categorias</p></button>
            <button onClick={() => setActive("caixinha")} className={`rounded-2xl border p-3 text-left transition ${active === "caixinha" ? "border-primary bg-[#f5efff]" : "border-border bg-white"}`}><PiggyBank className={`size-5 ${active === "caixinha" ? "text-primary" : "text-muted-foreground"}`} /><p className="mt-2 text-sm font-bold">Caixinha do seu filho</p><p className="mt-0.5 text-[10px] text-muted-foreground">Meta, saldo e depósitos</p></button>
          </div>
        </section>

        {active === "orcamento" ? <>
          <section className="rounded-[24px] border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-[.08em] text-muted-foreground">Período</p><h2 className="text-base font-bold capitalize">{monthLabel(month)}</h2></div><CalendarDays className="size-5 text-primary" /></div>
            <select value={month} onChange={e => setMonth(e.target.value)} className="mt-3 h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold capitalize outline-none focus:ring-2 focus:ring-primary/20">{months.map(m => <option key={m} value={m}>{new Date(Number(m.slice(0,4)), Number(m.slice(5))-1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</option>)}</select>
          </section>
          <section className="grid grid-cols-3 gap-2"><Metric label="Entradas" value={brl(received)} /><Metric label="Gastos" value={brl(spent)} /><Metric label="Resultado" value={brl(result)} /></section>
          <section className="rounded-[24px] border border-border bg-white p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Gastos por categoria</h2><p className="text-[10px] text-muted-foreground">Valores reais registrados no MamaWise.</p></div><FileSpreadsheet className="size-5 text-primary" /></div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[420px] text-left text-xs"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="pb-2">Categoria</th><th className="pb-2 text-right">Valor</th><th className="pb-2 text-right">%</th></tr></thead><tbody>{cats.map(c => <tr key={c.category} className="border-b last:border-0"><td className="py-2.5 font-semibold">{c.category}</td><td className="py-2.5 text-right">{brl(c.total)}</td><td className="py-2.5 text-right text-muted-foreground">{Math.round((c.total / Math.max(spent,1))*100)}%</td></tr>)}{cats.length === 0 && <tr><td colSpan={3} className="py-5 text-center text-muted-foreground">Nenhum gasto registrado.</td></tr>}</tbody></table></div></section>
          <section className="rounded-[24px] border border-border bg-white p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Lançamentos do mês</h2><span className="text-[10px] text-muted-foreground">{monthExpenses.length} gastos · {monthIncomes.length} entradas</span></div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="pb-2">Descrição</th><th className="pb-2">Data</th><th className="pb-2">Categoria/Origem</th><th className="pb-2 text-right">Valor</th></tr></thead><tbody>{[...monthExpenses.map(e => ({description:e.description,date:e.date,kind:e.category,amount:-e.amount})), ...monthIncomes.map(i => ({description:i.description,date:i.date,kind:i.source,amount:i.amount}))].sort((a,b)=>b.date.localeCompare(a.date)).map((x,i)=><tr key={`${x.date}-${x.description}-${i}`} className="border-b last:border-0"><td className="py-2.5 font-semibold">{x.description}</td><td className="py-2.5 text-muted-foreground">{x.date.split("-").reverse().join("/")}</td><td className="py-2.5 text-muted-foreground">{x.kind}</td><td className={`py-2.5 text-right font-bold ${x.amount >= 0 ? "text-success" : "text-destructive"}`}>{x.amount >= 0 ? "+" : "-"} {brl(Math.abs(x.amount))}</td></tr>)}</tbody></table></div></section>
          <Button onClick={exportBudget} className="h-12 w-full rounded-2xl"><Download className="size-5" /> Baixar planilha do Meu Orçamento</Button>
          <Link to="/gastos" className="block text-center text-xs font-semibold text-primary">Abrir Meu Orçamento completo →</Link>
        </> : <>
          <section className="rounded-[28px] bg-gradient-to-br from-[#6d35e8] via-[#7c45df] to-[#9a59e8] p-5 text-white shadow-[0_18px_38px_rgba(104,54,190,.22)]"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-white/70">Caixinha do seu filho</p><p className="mt-2 text-3xl font-bold">{brl(stats?.current ?? 0)}</p><div className="mt-3 flex justify-between text-xs text-white/80"><span>{Math.round(stats?.percent ?? 0)}% da meta</span><span>Meta {brl(stats?.target ?? 0)}</span></div><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-white" style={{width:`${Math.min(100, stats?.percent ?? 0)}%`}} /></div></section>
          <section className="grid grid-cols-3 gap-2"><Metric label="Saldo" value={brl(stats?.current ?? 0)} /><Metric label="Meta" value={brl(stats?.target ?? 0)} /><Metric label="Falta" value={brl(stats?.remaining ?? 0)} /></section>
          <section className="rounded-[24px] border border-border bg-white p-4"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold">Movimentações</h2><p className="text-[10px] text-muted-foreground">Todos os depósitos registrados.</p></div><PiggyBank className="size-5 text-primary" /></div><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[430px] text-left text-xs"><thead><tr className="border-b text-[10px] uppercase text-muted-foreground"><th className="pb-2">Data</th><th className="pb-2">Descrição</th><th className="pb-2 text-right">Valor</th></tr></thead><tbody>{deposits.map(d => <tr key={d.id} className="border-b last:border-0"><td className="py-2.5 text-muted-foreground">{d.date.split("-").reverse().join("/")}</td><td className="py-2.5 font-semibold">{d.note || "Depósito"}</td><td className="py-2.5 text-right font-bold text-success">+ {brl(d.amount)}</td></tr>)}{deposits.length === 0 && <tr><td colSpan={3} className="py-5 text-center text-muted-foreground">Nenhum depósito registrado.</td></tr>}</tbody></table></div></section>
          <Button onClick={exportBox} className="h-12 w-full rounded-2xl"><Download className="size-5" /> Baixar planilha da Caixinha</Button>
          <Link to="/caixinha" className="block text-center text-xs font-semibold text-primary">Abrir Caixinha completa →</Link>
        </>}

        <Link to="/" className="flex items-center justify-center gap-1 py-2 text-xs font-semibold text-muted-foreground"><ArrowLeft className="size-3.5" /> Voltar para o início</Link>
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border bg-white p-3"><p className="text-[10px] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold tracking-tight">{value}</p></div>;
}
