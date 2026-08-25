import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  Baby,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Coins,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Car,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { BoxObjective } from "@/lib/types";
import {
  boxStats,
  depositsOf,
  longDate,
  milestoneMessage,
  objectiveInfo,
  objectives,
  reachedMilestone,
} from "@/lib/caixinha";
import { brl } from "@/lib/finance";

export const Route = createFileRoute("/caixinha")({
  head: () => ({
    meta: [
      { title: "Caixinha do Futuro — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Crie uma reserva para o futuro do seu filho, acompanhe o progresso e registre suas economias.",
      },
    ],
  }),
  component: Caixinha,
});

const objectiveIcons: Record<BoxObjective, typeof Baby> = {
  futuro_bebe: Baby,
  educacao: GraduationCap,
  emergencias: HeartPulse,
  aniversario: Gift,
  primeiro_carro: Car,
  futuro: Home,
  outro: Sparkles,
};

function Caixinha() {
  const { data, addBox, addDeposit, removeBox, markMilestone } = useStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [depositBoxId, setDepositBoxId] = useState<string | null>(null);
  const [depositValue, setDepositValue] = useState("");
  const [depositNote, setDepositNote] = useState("");

  function registerDeposit() {
    const box = data.boxes.find((item) => item.id === depositBoxId);
    const amount = Number(depositValue);
    if (!box || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }

    addDeposit({
      boxId: box.id,
      amount,
      date: new Date().toISOString().slice(0, 10),
      ...(depositNote.trim() ? { note: depositNote.trim() } : {}),
    });

    const statsBefore = boxStats(box, data.deposits);
    const nextPercent = box.target > 0
      ? Math.min(100, ((statsBefore.current + amount) / box.target) * 100)
      : 0;
    const milestone = reachedMilestone(nextPercent);

    if (milestone > 0 && !box.milestonesSeen.includes(milestone)) {
      const message = milestoneMessage(milestone);
      markMilestone(box.id, milestone);
      toast.success(message.title, { description: message.text });
    } else {
      toast.success("Valor guardado!", {
        description: `${brl(amount)} adicionados à caixinha de ${box.childName}.`,
      });
    }

    setDepositBoxId(null);
    setDepositValue("");
    setDepositNote("");
  }

  return (
    <AppShell
      title="Caixinha do Futuro"
      subtitle="Um pouco de cada vez para construir um futuro mais tranquilo para seu filho."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            O app apenas registra sua meta e os valores que você informa. Nenhum dinheiro real é movimentado.
          </p>
        </div>
        <Button
          size="lg"
          className="h-12 w-full rounded-2xl text-base sm:w-auto"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="size-5" /> Criar caixinha
        </Button>
      </div>

      {data.boxes.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Coins className="size-6" />}
            title="Você ainda não criou uma caixinha."
            description="Comece definindo um objetivo para o futuro do seu filho e escolha quanto gostaria de guardar por mês."
            action={
              <Button size="lg" className="h-12 rounded-2xl" onClick={() => setCreateOpen(true)}>
                <Plus className="size-5" /> Criar minha primeira caixinha
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {data.boxes.map((box) => {
            const stats = boxStats(box, data.deposits);
            const info = objectiveInfo(box);
            const Icon = objectiveIcons[box.objective];
            const history = depositsOf(data.deposits, box.id);

            return (
              <article key={box.id} className="card-premium overflow-hidden p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{info.label}</p>
                      <h2 className="truncate font-display text-xl font-semibold text-foreground">
                        Futuro de {box.childName}
                      </h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 rounded-xl text-muted-foreground"
                    aria-label={`Remover caixinha de ${box.childName}`}
                    onClick={() => removeBox(box.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="mt-6 rounded-3xl bg-[image:var(--gradient-calm)] p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor guardado</p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {brl(stats.current)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Meta</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{brl(stats.target)}</p>
                    </div>
                  </div>
                  <Progress value={stats.percent} className="mt-5 h-3" />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{Math.round(stats.percent)}% concluído</span>
                    <span>Falta {brl(stats.remaining)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Por mês" value={brl(stats.monthly)} />
                  <Stat label="Este mês" value={brl(stats.savedThisMonth)} />
                  <Stat label="Depósitos" value={String(history.length)} />
                  <Stat label="Previsão" value={stats.forecast ?? "Defina um valor mensal"} compact />
                </div>

                {box.targetDate ? (
                  <div className="mt-4 flex items-start gap-3 rounded-2xl bg-muted/50 p-3 text-sm">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        Meta até {new Date(box.targetDate + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                      {stats.onTrack === true ? (
                        <p className="mt-0.5 text-xs text-muted-foreground">Você está no caminho certo. ❤️</p>
                      ) : stats.onTrack === false ? (
                        <p className="mt-0.5 text-xs text-warning">Para chegar nessa data, a sugestão é guardar {brl(stats.neededPerMonth ?? 0)} por mês.</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {stats.completed ? (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-success-soft p-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-card text-success">
                      <Trophy className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">🎉 Meta alcançada!</p>
                      <p className="text-xs text-muted-foreground">Você conseguiu construir essa reserva para {box.childName}.</p>
                    </div>
                  </div>
                ) : null}

                <Button
                  size="lg"
                  className="mt-5 h-12 w-full rounded-2xl text-base"
                  onClick={() => {
                    setDepositBoxId(box.id);
                    setDepositValue("");
                    setDepositNote("");
                  }}
                >
                  <Plus className="size-5" /> Adicionar dinheiro
                </Button>

                {history.length > 0 ? (
                  <details className="mt-4 group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground">
                      <span>Histórico de depósitos</span>
                      <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-2 divide-y divide-border rounded-2xl border border-border">
                      {history.slice(0, 5).map((deposit) => (
                        <div key={deposit.id} className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{deposit.note || "Economia para o futuro"}</p>
                            <p className="text-xs text-muted-foreground">{longDate(deposit.date)}</p>
                          </div>
                          <p className="shrink-0 font-semibold text-success">+ {brl(deposit.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">Um hábito pequeno pode virar um grande futuro.</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Defina um valor que caiba na sua realidade e registre cada avanço. O objetivo é criar constância, sem pressão.
            </p>
          </div>
        </div>
      </div>

      <CreateBoxDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={addBox} />

      <Dialog open={depositBoxId !== null} onOpenChange={(open) => !open && setDepositBoxId(null)}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar dinheiro</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="deposit-value">Quanto você guardou?</Label>
              <MoneyInput id="deposit-value" value={depositValue} onChange={setDepositValue} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="deposit-note">Observação (opcional)</Label>
              <Input
                id="deposit-note"
                className="h-12 rounded-2xl"
                placeholder="Ex: economia do mês"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 rounded-2xl text-base" onClick={registerDeposit}>
              <CheckCircle2 className="size-5" /> Registrar economia
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Stat({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className="rounded-2xl bg-muted/60 px-3 py-3 text-center">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={compact ? "mt-1 text-[11px] font-semibold text-foreground" : "mt-1 text-sm font-semibold text-foreground"}>{value}</p>
    </div>
  );
}

function MoneyInput({ id, value, onChange }: { id?: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-muted-foreground">R$</span>
      <Input
        id={id}
        inputMode="decimal"
        className="h-12 rounded-2xl pl-11"
        placeholder="0,00"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, "").replace(",", "."))}
      />
    </div>
  );
}

function CreateBoxDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: ReturnType<typeof useStore>["addBox"];
}) {
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [objective, setObjective] = useState<BoxObjective>("futuro_bebe");
  const [customObjective, setCustomObjective] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [target, setTarget] = useState("");
  const [monthly, setMonthly] = useState("");
  const [targetDate, setTargetDate] = useState("");

  function reset() {
    setChildName("");
    setBirthDate("");
    setObjective("futuro_bebe");
    setCustomObjective("");
    setInitialAmount("");
    setTarget("");
    setMonthly("");
    setTargetDate("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const goal = Number(target);
    if (!childName.trim() || !Number.isFinite(goal) || goal <= 0) {
      toast.error("Informe o nome da criança e uma meta maior que zero.");
      return;
    }

    onCreate({
      childName: childName.trim(),
      ...(birthDate ? { childBirthDate: birthDate } : {}),
      objective,
      ...(objective === "outro" && customObjective.trim() ? { customObjective: customObjective.trim() } : {}),
      initialAmount: Math.max(0, Number(initialAmount) || 0),
      target: goal,
      monthlyContribution: Math.max(0, Number(monthly) || 0),
      ...(targetDate ? { targetDate } : {}),
    });

    toast.success("Caixinha criada!", {
      description: `Agora você pode começar a construir o futuro de ${childName.trim()}.`,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Criar Caixinha do Futuro</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="rounded-2xl bg-primary-soft p-4">
            <p className="text-sm font-medium text-foreground">❤️ Cada valor conta</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Escolha uma meta realista. A ideia é criar constância, não pressão.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="child-name">Nome da criança</Label>
              <Input id="child-name" className="h-12 rounded-2xl" placeholder="Ex: Helena" value={childName} onChange={(e) => setChildName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="child-birth">Data de nascimento (opcional)</Label>
              <Input id="child-birth" type="date" className="h-12 rounded-2xl" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Objetivo</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {objectives.map((item) => {
                const Icon = objectiveIcons[item.value];
                const selected = objective === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setObjective(item.value)}
                    className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 text-center transition-all ${selected ? "border-primary bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground hover:bg-muted/50"}`}
                  >
                    <Icon className="size-5" />
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {objective === "outro" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="custom-objective">Qual é o objetivo?</Label>
              <Input id="custom-objective" className="h-12 rounded-2xl" placeholder="Ex: intercâmbio" value={customObjective} onChange={(e) => setCustomObjective(e.target.value)} />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="initial">Já guardado</Label>
              <MoneyInput id="initial" value={initialAmount} onChange={setInitialAmount} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="target">Meta</Label>
              <MoneyInput id="target" value={target} onChange={setTarget} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="monthly">Por mês</Label>
              <MoneyInput id="monthly" value={monthly} onChange={setMonthly} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="target-date">Data desejada para alcançar a meta (opcional)</Label>
            <Input id="target-date" type="date" className="h-12 rounded-2xl" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </div>

          <Button type="submit" size="lg" className="h-12 rounded-2xl text-base">
            <Target className="size-5" /> Criar minha caixinha
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
