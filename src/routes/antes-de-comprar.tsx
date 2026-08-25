import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, ExternalLink, PiggyBank, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/antes-de-comprar")({
  head: () => ({ meta: [
    { title: "Antes de comprar — Ninho Financeiro" },
    { name: "description", content: "Compare uma compra antes de gastar e prepare-se para encontrar melhores ofertas." },
  ] }),
  component: AntesDeComprar,
});

const priorities: Priority[] = ["essencial", "importante", "pode_esperar"];

const verdictStyles = {
  ok: { box: "bg-success-soft", icon: <CheckCircle2 className="size-6 text-success" />, dot: "🟢" },
  atencao: { box: "bg-warning-soft", icon: <AlertTriangle className="size-6 text-warning-foreground" />, dot: "🟡" },
  risco: { box: "bg-danger-soft", icon: <XCircle className="size-6 text-destructive" />, dot: "🔴" },
} as const;

// Estrutura preparada para receber resultados reais de uma API de ofertas.
// Não inventamos preços: enquanto a integração externa não estiver configurada,
// mostramos apenas o estado de busca e mantemos a análise financeira local.
type Offer = { store: string; price: number; url?: string; label?: string };

function AntesDeComprar() {
  const { data, addAnalysis } = useStore();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Outros");
  const [priority, setPriority] = useState<Priority>("importante");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchMessage, setSearchMessage] = useState("");

  function analyze(e: FormEvent) {
    e.preventDefault();
    const value = Number(price);
    if (!value) return;
    const analysis = analyzePurchase(data, value, priority);
    setResult(analysis);
    addAnalysis({ productName: name.trim() || "Compra sem nome", price: value, category, priority, verdict: analysis.verdict, percentOfAvailable: analysis.percentOfAvailable, remainingAfter: analysis.remainingAfter });
  }

  function searchOffers() {
    if (!name.trim()) return;
    setSearching(true);
    setOffers([]);
    setSearchMessage("Buscando ofertas disponíveis...");
    // Placeholder seguro: a busca real será conectada a uma API de produtos/ofertas.
    window.setTimeout(() => {
      setSearching(false);
      setSearchMessage("A busca de ofertas reais ainda precisa de uma fonte de preços. A tela já está preparada para receber lojas, preços, links e economia.");
    }, 700);
  }

  function saveSavings(amount: number) {
    setSearchMessage(`Economia de ${brl(amount)} selecionada para ser registrada na Caixinha do Futuro.`);
  }

  return (
    <AppShell title="Antes de comprar" subtitle="Pesquise, compare e pense antes de gastar.">
      <section className="card-premium p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search className="size-5" /></div>
          <div>
            <h2 className="font-display text-xl font-semibold">O que você quer comprar?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Digite o produto e, no futuro, a MamaWise poderá comparar ofertas reais para você.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Input className="h-12 rounded-2xl" placeholder="Ex.: carrinho de bebê" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="button" onClick={searchOffers} disabled={!name.trim() || searching} size="lg" className="h-12 rounded-2xl sm:px-7">
            <Search className="mr-2 size-4" /> {searching ? "Pesquisando..." : "Procurar ofertas"}
          </Button>
        </div>

        {searchMessage && <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed text-muted-foreground">{searchMessage}</p>}

        {offers.length > 0 && (
          <div className="mt-5 grid gap-3">
            {offers.map((offer) => (
              <div key={`${offer.store}-${offer.price}`} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="font-semibold">{offer.store}</p><p className="text-sm text-muted-foreground">{offer.label ?? "Oferta encontrada"}</p></div>
                  <div className="text-right"><p className="text-lg font-bold">{brl(offer.price)}</p>{offer.url && <a href={offer.url} target="_blank" rel="noreferrer" className="text-xs text-primary">Ver oferta <ExternalLink className="inline size-3" /></a>}</div>
                </div>
                <Button variant="outline" className="mt-3 rounded-xl" onClick={() => saveSavings(offer.price)}><PiggyBank className="mr-2 size-4" /> Guardar a economia na caixinha</Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <form onSubmit={analyze} className="card-premium mt-6 p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"><Sparkles className="size-5" /></div>
          <div><h2 className="font-display text-xl font-semibold">Veja se a compra cabe no orçamento</h2><p className="mt-1 text-sm text-muted-foreground">Esta análise continua funcionando mesmo sem a busca de ofertas.</p></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2"><Label htmlFor="preco-compra">Preço</Label><MoneyInput id="preco-compra" value={price} onChange={setPrice} /></div>
          <div className="flex flex-col gap-2"><Label>Categoria</Label><Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}><SelectTrigger className="h-12 w-full rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{expenseCategories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex flex-col gap-2"><Label>Prioridade</Label><Select value={priority} onValueChange={(v) => setPriority(v as Priority)}><SelectTrigger className="h-12 w-full rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{priorityLabel[p]}</SelectItem>)}</SelectContent></Select></div>
        </div>
        <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-2xl text-base sm:w-auto sm:px-8">Ver análise financeira</Button>
      </form>

      {result ? <section className={`mt-6 rounded-3xl border border-border p-5 sm:p-6 ${verdictStyles[result.verdict].box}`}>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Resultado</p>
        <div className="mt-3 flex items-center gap-3"><span>{verdictStyles[result.verdict].icon}</span><h2 className="font-display text-xl font-semibold">{verdictStyles[result.verdict].dot} {result.headline}</h2></div>
        <ul className="mt-5 flex flex-col gap-3">{result.explanation.map((line) => <li key={line} className="rounded-2xl bg-card/80 px-4 py-3 text-sm leading-relaxed">{line}</li>)}</ul>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-card"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.round(result.percentOfAvailable))}%` }} /></div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Esta é uma ferramenta de organização financeira e não é aconselhamento financeiro profissional.</p>
      </section> : <p className="mt-6 rounded-3xl border border-dashed border-border bg-card px-5 py-8 text-center text-sm text-muted-foreground">Informe o preço para analisar o impacto da compra nos seus {brl(data.financial.availableBalance)} disponíveis.</p>}
    </AppShell>
  );
}
