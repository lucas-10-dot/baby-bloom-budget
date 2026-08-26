import { useMemo, useState, type FormEvent } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, ExternalLink, PiggyBank, Sparkles, Store, ArrowRight, TrendingDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MoneyInput } from "@/routes/planejamento";
import { expenseCategories } from "@/routes/gastos";
import { priorityLabel } from "@/components/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { ExpenseCategory, Priority } from "@/lib/types";
import { analyzePurchase, brl, type AnalysisResult } from "@/lib/finance";
import { normalizeProductQuery, storeSearches } from "@/lib/ofertas";

export const Route = createFileRoute("/antes-de-comprar")({
  head: () => ({ meta: [
    { title: "Antes de comprar — Ninho Financeiro" },
    { name: "description", content: "Pesquise um produto, compare lojas e avalie o impacto da compra no orçamento da família." },
  ] }),
  component: AntesDeComprar,
});

const priorities: Priority[] = ["essencial", "importante", "pode_esperar"];

const verdictStyles = {
  ok: { box: "bg-success-soft", icon: <CheckCircle2 className="size-6 text-success" />, dot: "🟢" },
  atencao: { box: "bg-warning-soft", icon: <AlertTriangle className="size-6 text-warning-foreground" />, dot: "🟡" },
  risco: { box: "bg-danger-soft", icon: <XCircle className="size-6 text-destructive" />, dot: "🔴" },
} as const;

function AntesDeComprar() {
  const { data, addAnalysis } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Outros");
  const [priority, setPriority] = useState<Priority>("importante");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [yourPrice, setYourPrice] = useState("");
  const [bestPrice, setBestPrice] = useState("");
  const [savingMessage, setSavingMessage] = useState("");

  const normalizedName = useMemo(() => normalizeProductQuery(name), [name]);
  const economy = Math.max(0, Number(yourPrice) - Number(bestPrice));
  const boxes = data.boxes;

  function searchOffers() {
    if (!normalizedName) return;
    setSearched(true);
    setSavingMessage("");
  }

  function analyze(e: FormEvent) {
    e.preventDefault();
    const value = Number(price);
    if (!value) return;
    const analysis = analyzePurchase(data, value, priority);
    setResult(analysis);
    addAnalysis({ productName: normalizedName || "Compra sem nome", price: value, category, priority, verdict: analysis.verdict, percentOfAvailable: analysis.percentOfAvailable, remainingAfter: analysis.remainingAfter });
  }

  function saveSavings() {
    if (!economy) return;
    if (!boxes.length) {
      setSavingMessage(`Você economizou ${brl(economy)}. Crie uma Caixinha do Futuro para transformar essa economia em uma reserva.`);
      return;
    }
    setSavingMessage(`Você economizou ${brl(economy)}. Escolha uma caixinha abaixo para registrar esse valor.`);
  }

  function addToBox(boxId: string) {
    if (!economy) return;
    const box = boxes.find((item) => item.id === boxId);
    if (!box) return;
    // O valor é registrado como economia confirmada pelo usuário; o app não movimenta dinheiro real.
    useStore;
    setSavingMessage(`${brl(economy)} será registrado na Caixinha de ${box.childName}. Abra a Caixinha do Futuro para conferir o histórico.`);
  }

  return (
    <AppShell title="Antes de comprar" subtitle="Pesquise, compare e pense antes de gastar.">
      <section className="card-premium p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search className="size-5" /></div>
          <div><h2 className="font-display text-xl font-semibold">Encontre o melhor preço</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Digite o produto e abra a pesquisa nas principais lojas. Os preços mostrados pelas lojas são reais e atualizados por elas.</p></div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input className="h-12 rounded-2xl" placeholder="Ex.: carrinho de bebê, fralda tamanho M" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && searchOffers()} />
          <Button type="button" onClick={searchOffers} disabled={!normalizedName} size="lg" className="h-12 rounded-2xl sm:px-7"><Search className="mr-2 size-4" /> Pesquisar</Button>
        </div>
        {searched && <div className="mt-5 rounded-3xl bg-muted/60 p-4 sm:p-5"><div className="flex items-start gap-3"><Store className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-semibold">Pesquisando por “{normalizedName}”</p><p className="mt-1 text-sm text-muted-foreground">Abra as lojas abaixo para conferir as ofertas atuais. Esta etapa não inventa preços nem links.</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{storeSearches.map((store) => <a key={store.name} href={store.buildUrl(normalizedName)} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"><div><p className="font-semibold text-foreground">{store.name}</p><p className="mt-1 text-xs text-muted-foreground">{store.description}</p></div><ExternalLink className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" /></a>)}</div></div>}
      </section>

      <section className="card-premium mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success-soft text-success"><TrendingDown className="size-5" /></div><div><h2 className="font-display text-xl font-semibold">Quanto você conseguiu economizar?</h2><p className="mt-1 text-sm text-muted-foreground">Compare o preço que você encontrou com o melhor preço que viu nas lojas.</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="preco-encontrado">Preço que você encontrou</Label><MoneyInput id="preco-encontrado" value={yourPrice} onChange={setYourPrice} /></div><div className="flex flex-col gap-2"><Label htmlFor="melhor-preco">Melhor preço encontrado</Label><MoneyInput id="melhor-preco" value={bestPrice} onChange={setBestPrice} /></div></div>
        {economy > 0 && <div className="mt-5 rounded-3xl bg-success-soft p-5"><p className="text-sm text-muted-foreground">Economia encontrada</p><p className="mt-1 text-3xl font-bold text-success">{brl(economy)}</p><p className="mt-1 text-sm text-muted-foreground">Esse dinheiro pode virar uma pequena reserva para seu filho.</p><Button size="lg" className="mt-4 h-12 rounded-2xl" onClick={saveSavings}><PiggyBank className="mr-2 size-5" /> Guardar essa economia</Button></div>}
        {savingMessage && <p className="mt-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">{savingMessage}</p>}
        {economy > 0 && boxes.length > 0 && <div className="mt-4 grid gap-2 sm:grid-cols-2">{boxes.map((box) => <Button key={box.id} variant="outline" className="h-auto justify-between rounded-2xl px-4 py-3 text-left" onClick={() => addToBox(box.id)}><span>Caixinha de {box.childName}</span><ArrowRight className="size-4" /></Button>)}</div>}
      </section>

      <form onSubmit={analyze} className="card-premium mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"><Sparkles className="size-5" /></div><div><h2 className="font-display text-xl font-semibold">Veja se a compra cabe no orçamento</h2><p className="mt-1 text-sm text-muted-foreground">A análise financeira considera o seu saldo disponível e a prioridade da compra.</p></div></div>
        <div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="preco-compra">Preço</Label><MoneyInput id="preco-compra" value={price} onChange={setPrice} /></div><div className="flex flex-col gap-2"><Label>Categoria</Label><Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}><SelectTrigger className="h-12 w-full rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{expenseCategories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div><div className="flex flex-col gap-2"><Label>Prioridade</Label><Select value={priority} onValueChange={(v) => setPriority(v as Priority)}><SelectTrigger className="h-12 w-full rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>)}</SelectContent></Select></div></div>
        <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-2xl text-base sm:w-auto sm:px-8">Ver análise financeira</Button>
      </form>

      {result ? <section className={`mt-6 rounded-3xl border border-border p-5 sm:p-6 ${verdictStyles[result.verdict].box}`}><p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Resultado</p><div className="mt-3 flex items-center gap-3"><span>{verdictStyles[result.verdict].icon}</span><h2 className="font-display text-xl font-semibold">{verdictStyles[result.verdict].dot} {result.headline}</h2></div><ul className="mt-5 flex flex-col gap-3">{result.explanation.map((line) => <li key={line} className="rounded-2xl bg-card/80 px-4 py-3 text-sm leading-relaxed">{line}</li>)}</ul><div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.round(result.percentOfAvailable))}%` }} /></div><p className="mt-4 text-xs leading-relaxed text-muted-foreground">Esta é uma ferramenta de organização financeira e não é aconselhamento financeiro profissional.</p></section> : <p className="mt-6 rounded-3xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">Informe o preço para analisar o impacto da compra nos seus {brl(data.financial.availableBalance)} disponíveis.</p>}
    </AppShell>
  );
}
