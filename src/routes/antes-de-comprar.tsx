import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight, Trophy, ArrowLeft, Sparkles, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { brl } from "@/lib/finance";
import { storeSearches } from "@/lib/ofertas";

export const Route = createFileRoute("/antes-de-comprar")({ head: () => ({ meta: [{ title: "Antes de Comprar — MamaWise" }] }), component: Comprar });

const offers = [
  { name: "Mercado Livre", price: 79.9, frete: 9.9, total: 89.8, days: 2, icon: "🏅", color: "border-[#bfe8d3] bg-[#f4fff8]" },
  { name: "Shopee", price: 82.5, frete: 6.9, total: 89.4, days: 3, icon: "🛍️", color: "border-border bg-white" },
  { name: "Magalu", price: 89.9, frete: 0, total: 89.9, days: 4, icon: "M", color: "border-border bg-white" },
];

function Comprar() {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState("Fralda Pampers M - 80 unidades");
  const { data, addDeposit } = useStore();
  const economy = 23.4;

  return <AppShell title={step === 1 ? "Antes de Comprar" : step === 2 ? "Resultado da busca" : "Análise da MamaWise"}>
    {step === 1 && <SearchScreen query={query} setQuery={setQuery} onSearch={() => { if (query.trim()) { setProduct(query.trim()); setStep(2); } }} />}
    {step === 2 && <Results product={product} onBack={() => setStep(1)} onAnalysis={() => setStep(3)} />}
    {step === 3 && <Analysis product={product} onBack={() => setStep(2)} onSave={() => { const b = data.boxes[0]; if (b) addDeposit({ boxId: b.id, amount: economy, date: new Date().toISOString().slice(0, 10), note: `Economia de ${product}` }); }} />}
  </AppShell>;
}

function SearchScreen({ query, setQuery, onSearch }: { query: string; setQuery: (v: string) => void; onSearch: () => void }) {
  const suggestions = ["Fralda Pampers M", "Leite Nan 800g", "Carrinho de bebê", "Cadeira infantil", "Lenço umedecido", "Shampoo infantil"];
  return <div className="space-y-3">
    <section className="rounded-[28px] border border-[#ebe5f5] bg-white p-5 shadow-[0_8px_28px_rgba(45,30,70,.05)]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.1em] text-primary">Economize antes de comprar</p><h2 className="mt-2 text-[20px] font-bold leading-tight">Encontre a melhor oferta para você.</h2></div><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f3edff] text-primary"><Search className="size-5" /></span></div>
      <p className="mt-4 text-[10px] text-muted-foreground">Compare preço, frete, quantidade e custo por unidade em um só lugar.</p>
      <div className="relative mt-4"><Input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && onSearch()} placeholder="Ex.: fralda Pampers M" className="h-12 rounded-2xl bg-[#faf9fc] pr-12 text-[11px]"/><button onClick={onSearch} className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl bg-primary text-primary-foreground"><Search className="size-4" /></button></div>
      <div className="mt-5 flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#e3a323]"/><p className="text-[9px] font-bold">Sugestões populares</p></div>
      <div className="mt-2 grid grid-cols-2 gap-2">{suggestions.map(s => <button key={s} onClick={() => setQuery(s)} className="rounded-xl border border-border bg-[#fbfafc] px-3 py-2.5 text-left text-[9px] font-medium transition hover:border-primary/30 hover:bg-[#f7f2ff]">{s}</button>)}</div>
    </section>
    <section className="rounded-[24px] border border-[#f1dfbe] bg-[#fffaf1] p-4"><p className="text-[10px] font-bold">💡 Dica MamaWise</p><p className="mt-1.5 text-[9px] leading-relaxed text-muted-foreground">Às vezes o produto mais barato não é o melhor negócio. O frete e o preço por unidade podem mudar a escolha.</p></section>
  </div>;
}

function Results({ product, onBack, onAnalysis }: { product: string; onBack: () => void; onAnalysis: () => void }) {
  return <div>
    <div className="rounded-[24px] border border-border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#f3edff] text-primary"><Search className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-[8px] font-semibold uppercase tracking-[.08em] text-muted-foreground">Você pesquisou</p><p className="mt-1 truncate text-[11px] font-bold">{product}</p></div><button onClick={onBack} className="grid size-8 place-items-center rounded-lg bg-[#f7f5fa] text-muted-foreground" aria-label="Editar busca"><SlidersHorizontal className="size-3.5" /></button></div></div>
    <div className="mt-3 flex items-center gap-2"><button className="rounded-full bg-[#eaf8f0] px-3 py-1.5 text-[9px] font-bold text-success">Melhor preço</button><button className="rounded-full bg-[#f5efff] px-3 py-1.5 text-[9px] font-semibold text-primary">Melhor custo-benefício</button></div>
    <div className="mt-3 space-y-2.5">{offers.map((o, i) => <div key={o.name} className={`rounded-[22px] border p-4 ${o.color}`}><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/80 text-base shadow-sm">{o.icon}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-[10px] font-bold">{o.name}</p>{i === 0 && <span className="rounded-full bg-success px-2 py-1 text-[7px] font-bold text-white">RECOMENDADO</span>}</div><p className="mt-1 text-[20px] font-bold tracking-tight">{brl(o.price)}</p><p className="mt-0.5 text-[8px] text-muted-foreground">Frete: {brl(o.frete)} · Total: <b className="text-foreground">{brl(o.total)}</b></p><p className="mt-1 text-[8px] text-muted-foreground">80 unidades · {brl(o.total / 80)} por unidade · {o.days} dias úteis</p><div className="flex justify-end"><a href={storeSearches[i]?.buildUrl(product)} target="_blank" rel="noreferrer"><Button className="mt-3 h-8 rounded-lg px-4 text-[8px]">Ver oferta <ChevronRight className="ml-1 size-3" /></Button></a></div></div></div></div>)}</div>
    <p className="mt-3 text-center text-[7px] text-muted-foreground">Os valores exibidos dependem da disponibilidade e das condições de cada loja.</p><Button onClick={onAnalysis} className="mt-3 h-11 w-full rounded-xl text-[10px]">Ver análise da MamaWise <ChevronRight className="size-4" /></Button><button onClick={onBack} className="mx-auto mt-3 flex items-center gap-1 text-[9px] text-muted-foreground"><ArrowLeft className="size-3" /> Voltar</button>
  </div>;
}

function Analysis({ product, onBack, onSave }: { product: string; onBack: () => void; onSave: () => void }) {
  return <div>
    <section className="relative overflow-hidden rounded-[28px] border border-[#ccebd9] bg-gradient-to-br from-[#f7fff9] to-[#eefaf5] p-5 text-center shadow-sm"><span className="absolute left-5 top-5 text-xs">🎈</span><span className="absolute right-5 top-7 text-xs">✨</span><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white shadow-sm"><Trophy className="size-6 text-[#e8a500]" /></span><p className="mt-3 text-[9px] font-bold uppercase tracking-[.08em] text-success">Melhor custo-benefício</p><p className="mt-2 text-[10px] font-semibold">Mercado Livre</p><p className="mt-1 text-[28px] font-bold tracking-tight text-success">R$ 89,80</p><p className="text-[9px] text-muted-foreground">Total com frete</p><div className="mx-auto mt-4 w-fit rounded-full bg-white px-3 py-1.5 text-[9px] font-bold text-primary shadow-sm">R$ 1,12 por unidade</div><p className="mt-3 text-[8px] text-muted-foreground">Boa entrega e vendedor confiável.</p></section>
    <section className="mt-4"><div className="flex items-center justify-between"><h2 className="text-[12px] font-bold">Comparativo final</h2><span className="text-[8px] text-muted-foreground">3 opções</span></div>{offers.map((o, i) => <div key={o.name} className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-white p-3 shadow-sm"><span className="text-sm">{i === 0 ? "🏅" : i === 1 ? "🥈" : "🥉"}</span><span className="flex-1 text-[9px] font-semibold">{o.name}</span><b className="text-[9px]">{brl(o.total)}</b><span className="text-[8px] text-muted-foreground">{brl(o.total / 80)}/un.</span></div>)}</section>
    <section className="mt-3 rounded-[24px] bg-[#effbf4] p-4 text-center"><p className="text-[9px] text-muted-foreground">Você pode economizar</p><p className="mt-0.5 text-[21px] font-bold text-success">até R$ 23,40</p><p className="text-[9px] font-semibold">escolhendo uma opção melhor.</p></section>
    <Button onClick={onSave} className="mt-3 h-11 w-full rounded-xl bg-success text-[10px] hover:bg-success">🐷 Guardar economia na Caixinha</Button><Button variant="outline" className="mt-2 h-10 w-full rounded-xl text-[9px]">Ver oferta no Mercado Livre</Button><button onClick={onBack} className="mx-auto mt-3 flex items-center gap-1 text-[9px] text-muted-foreground"><ArrowLeft className="size-3" /> Voltar</button>
  </div>;
}
