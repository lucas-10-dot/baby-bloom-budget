import { createFileRoute, Link } from "@tanstack/react-router";
import { Baby, CalendarDays, ChevronRight, Edit3, Heart, Ruler, Shirt, Sparkles, Weight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { longDate } from "@/lib/caixinha";

export const Route = createFileRoute("/filho")({
  head: () => ({ meta: [{ title: "Meu Filho — MamaWise" }, { name: "description", content: "Acompanhe informações e datas importantes do seu filho." }] }),
  component: Filho,
});

function Filho() {
  const { data } = useStore();
  const box = data.boxes[0];
  const name = box?.childName || data.baby.babyName || "Seu filho";
  const birth = box?.childBirthDate;
  return <AppShell title="Meu Filho" subtitle="Um espaço para acompanhar o que importa e planejar cada fase.">
    <section className="rounded-[28px] border border-primary/15 bg-[image:var(--gradient-calm)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center gap-4">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-primary-soft text-primary"><Baby className="size-10" /></div>
        <div className="min-w-0 flex-1"><p className="text-xs font-medium text-muted-foreground">Meu pequeno tesouro</p><h2 className="mt-1 font-display text-2xl font-bold">{name}</h2>{birth ? <p className="mt-1 text-sm text-muted-foreground">Nascimento: {new Date(`${birth}T00:00:00`).toLocaleDateString("pt-BR")}</p> : <p className="mt-1 text-sm text-muted-foreground">Adicione a data de nascimento na Caixinha.</p>}</div>
        <Button variant="outline" size="icon" className="rounded-xl"><Edit3 className="size-4" /></Button>
      </div>
    </section>

    <section className="mt-5 rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><Sparkles className="size-5" /></span><div><h2 className="font-display text-xl font-semibold">Informações</h2><p className="text-sm text-muted-foreground">Você poderá manter estes dados atualizados.</p></div></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info icon={<Weight className="size-4" />} label="Peso" value="Ainda não informado" />
        <Info icon={<Ruler className="size-4" />} label="Altura" value="Ainda não informada" />
        <Info icon={<Shirt className="size-4" />} label="Tamanho da roupa" value="Ainda não informado" />
        <Info icon={<Baby className="size-4" />} label="Tamanho do sapato" value="Ainda não informado" />
      </div>
    </section>

    <section className="mt-5 rounded-[26px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary"><CalendarDays className="size-5" /></span><h2 className="font-display text-xl font-semibold">Datas importantes</h2></div><Heart className="size-5 text-primary" /></div>
      <div className="mt-4 divide-y divide-border">{birth ? <DateRow label="Nascimento" value={longDate(birth)} /> : null}<DateRow label="Próxima consulta" value="Ainda não informada" /><DateRow label="Vacina" value="Ainda não informada" /><DateRow label="Aniversário" value={birth ? new Date(`${birth}T00:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "Ainda não informado"} /></div>
    </section>

    <Link to="/caixinha" className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary-soft/50 p-4 text-sm font-semibold text-primary"><span className="grid size-9 place-items-center rounded-xl bg-card"><Baby className="size-4" /></span><span className="flex-1">Continuar cuidando do futuro de {name}</span><ChevronRight className="size-4" /></Link>
  </AppShell>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4"><span className="text-primary">{icon}</span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 text-sm font-semibold">{value}</p></div></div>; }
function DateRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4 py-4"><span className="text-sm font-medium">{label}</span><span className="text-sm text-muted-foreground">{value}</span></div>; }
