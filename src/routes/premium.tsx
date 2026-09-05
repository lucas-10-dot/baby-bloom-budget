import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Check, Crown, PiggyBank, ShoppingCart, Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/premium")({ head: () => ({ meta: [{ title: "MamaWise Premium" }] }), component: Premium });

function Premium() {
  const benefits = [[ShoppingCart, "Comparador avançado", "Mais lojas, filtros e histórico de preços"], [Sparkles, "IA completa e personalizada", "Dicas exclusivas para o seu perfil"], [BarChart3, "Relatórios e metas avançadas", "Acompanhe seu progresso em detalhes"], [PiggyBank, "Caixinha Turbinada", "Metas e recursos exclusivos"], [TrendingUp, "Suporte prioritário", "Atendimento rápido e especializado"]] as const;
  return <AppShell title="MamaWise Premium">
    <div className="space-y-3">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#6d35e8] via-[#7e46df] to-[#9b5bea] px-5 py-6 text-white shadow-[0_18px_38px_rgba(104,54,190,.22)] sm:px-7">
        <div className="relative z-10 max-w-[68%]"><span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[9px] font-bold"><Crown className="size-3"/> Plano Premium</span><h2 className="mt-4 text-[24px] font-bold leading-tight text-white">Mais tranquilidade para cuidar do seu dinheiro.</h2><p className="mt-2 text-[10px] leading-relaxed text-white/80">Tenha ferramentas completas para economizar, planejar e cuidar do futuro do seu filho.</p></div><div className="absolute -right-1 bottom-[-5px] text-[88px] leading-none">👩🏻‍🍼</div><div className="absolute right-[25%] top-7 text-sm">✨</div>
      </section>
      <section className="rounded-[24px] border border-[#e8dcf5] bg-white p-4 shadow-[0_8px_25px_rgba(45,30,70,.05)] sm:p-5"><div className="flex items-end justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[.08em] text-primary">Tudo em um só lugar</p><h2 className="mt-1 text-[16px] font-bold">Benefícios Premium</h2></div><span className="rounded-full bg-[#f4ecff] px-2.5 py-1 text-[8px] font-bold text-primary">5 recursos</span></div><div className="mt-4 space-y-2">{benefits.map(([Icon, title, desc]) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#f0ebf6] bg-[#fcfaff] p-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eee5ff] text-primary"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-[10px] font-bold">{title}</p><p className="mt-0.5 text-[8px] leading-relaxed text-muted-foreground">{desc}</p></div><span className="grid size-6 place-items-center rounded-full bg-[#eaf8f0]"><Check className="size-3 text-success" /></span></div>)}</div></section>
      <section className="rounded-[26px] border border-[#e4d5f8] bg-gradient-to-br from-[#faf4ff] to-white p-5 text-center shadow-[0_10px_28px_rgba(91,44,140,.08)]"><span className="inline-flex rounded-full bg-white px-3 py-1 text-[8px] font-bold text-primary shadow-sm">Comece quando quiser</span><p className="mt-3 text-[10px] font-semibold text-muted-foreground">Plano mensal</p><p className="mt-1 text-[30px] font-bold tracking-tight text-[#211a35]">R$ 19,90 <span className="text-[10px] font-medium text-muted-foreground">/mês</span></p><Button className="mt-4 h-11 w-full rounded-xl text-[11px] font-bold shadow-lg"><Sparkles className="size-4" /> Assinar agora</Button><p className="mt-2 text-[8px] text-muted-foreground">Cancele quando quiser.</p></section>
    </div>
  </AppShell>;
}
