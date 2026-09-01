import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Check, Crown, PiggyBank, Sparkles, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/premium")({
  head: () => ({ meta: [{ title: "MamaWise Premium" }, { name: "description", content: "Mais recursos para cuidar do dinheiro da família e do futuro do seu filho." }] }),
  component: Premium,
});

function Premium() {
  const benefits = [
    [ShoppingCart, "Comparador avançado", "Mais lojas, filtros e histórico de preços"],
    [Sparkles, "IA completa e personalizada", "Orientações adaptadas ao seu orçamento"],
    [BarChart3, "Relatórios e metas avançadas", "Acompanhe sua evolução com mais detalhes"],
    [PiggyBank, "Caixinha turbinada", "Mais recursos para acompanhar suas metas"],
    [Star, "Suporte prioritário", "Atendimento rápido e especializado"],
  ] as const;
  return <AppShell title="MamaWise Premium" subtitle="Mais recursos para cuidar melhor do seu bolso e do futuro do seu filho.">
    <div className="overflow-hidden rounded-[30px] border border-primary/15 bg-[image:var(--gradient-calm)] p-6 shadow-[var(--shadow-lift)] sm:p-8">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs font-bold text-primary shadow-sm"><Crown className="size-4" /> PLANO PREMIUM</div>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">Economize melhor. Planeje melhor. Cuide do futuro.</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">O Premium reúne as ferramentas mais poderosas do MamaWise para transformar pequenas economias em decisões financeiras melhores.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-foreground"><span className="rounded-full bg-card px-3 py-2">✓ 7 dias para experimentar</span><span className="rounded-full bg-card px-3 py-2">✓ Cancele quando quiser</span></div>
        </div>
        <div className="rounded-[26px] border border-primary/15 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
          <p className="text-sm font-semibold text-muted-foreground">Plano mensal</p>
          <div className="mt-2 flex items-end gap-1"><span className="font-display text-4xl font-bold">R$ 19,90</span><span className="mb-1 text-sm text-muted-foreground">/mês</span></div>
          <p className="mt-2 text-xs text-muted-foreground">Cancele quando quiser.</p>
          <Button size="lg" className="mt-5 h-12 w-full rounded-2xl text-base"><Sparkles className="size-5" /> Assinar agora</Button>
        </div>
      </div>
    </div>

    <section className="mt-6 rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary"><TrendingUp className="size-5" /></span><div><h2 className="font-display text-xl font-semibold">Benefícios Premium</h2><p className="text-sm text-muted-foreground">Tudo para tornar o MamaWise mais útil no dia a dia.</p></div></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{benefits.map(([Icon, title, description]) => <div key={title} className="rounded-2xl border border-border bg-muted/30 p-4"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" /></span><div><p className="font-semibold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></div><Check className="ml-auto size-4 shrink-0 text-success" /></div></div>)}</div>
    </section>

    <Link to="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="size-4" /> Voltar para o início</Link>
  </AppShell>;
}
