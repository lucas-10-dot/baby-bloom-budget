import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Target, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { MoneyInput } from "@/routes/planejamento";
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
import { brl, goalProgress } from "@/lib/finance";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Minhas metas — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Crie metas para o enxoval, a maternidade, a creche ou a reserva do bebê e acompanhe o progresso.",
      },
      { property: "og:title", content: "Minhas metas — Ninho Financeiro" },
      {
        property: "og:description",
        content: "Barras de progresso simples para ver o quanto já falta em cada objetivo.",
      },
    ],
  }),
  component: Metas,
});

const suggestions = [
  "Reserva para o bebê",
  "Enxoval",
  "Maternidade",
  "Creche",
  "Emergência",
  "Primeiro aniversário",
];

function Metas() {
  const { data, addGoal, updateGoal, removeGoal } = useStore();
  const [open, setOpen] = useState(false);
  const [depositFor, setDepositFor] = useState<string | null>(null);
  const [depositValue, setDepositValue] = useState("");

  function confirmDeposit() {
    const goal = data.goals.find((g) => g.id === depositFor);
    const value = Number(depositValue);
    if (!goal || !value) return;
    updateGoal(goal.id, { saved: goal.saved + value });
    toast.success("Valor guardado!", {
      description: `${brl(value)} adicionados em "${goal.name}".`,
    });
    setDepositFor(null);
    setDepositValue("");
  }

  return (
    <AppShell
      title="Minhas metas"
      subtitle="Cada meta é um objetivo da sua família. Guarde no seu ritmo."
    >
      <div className="flex justify-end">
        <Button size="lg" className="h-12 w-full rounded-2xl text-base sm:w-auto" onClick={() => setOpen(true)}>
          <Plus className="size-5" /> Criar meta
        </Button>
      </div>

      <div className="mt-5">
        {data.goals.length === 0 ? (
          <EmptyState
            icon={<Target className="size-6" />}
            title="Você ainda não criou nenhuma meta."
            description="Comece com algo simples, como a reserva para o bebê."
            action={
              <Button size="lg" className="h-12 rounded-2xl" onClick={() => setOpen(true)}>
                <Plus className="size-5" /> Criar primeira meta
              </Button>
            }
          />
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {data.goals.map((goal) => {
              const { percent, remaining } = goalProgress(goal);
              return (
                <li
                  key={goal.id}
                  className="card-premium p-5"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-foreground">
                        {goal.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {goal.deadline
                          ? `Prazo: ${new Date(goal.deadline + "T00:00:00").toLocaleDateString("pt-BR")}`
                          : "Sem prazo definido"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 shrink-0 rounded-xl text-muted-foreground"
                      aria-label={`Remover meta ${goal.name}`}
                      onClick={() => removeGoal(goal.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <Progress value={percent} className="mt-4 h-2.5" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Você já juntou {Math.round(percent)}% desta meta.
                  </p>

                  <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-muted/60 px-2 py-3">
                      <dt className="text-[11px] text-muted-foreground">Meta</dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">{brl(goal.target)}</dd>
                    </div>
                    <div className="rounded-2xl bg-success-soft px-2 py-3">
                      <dt className="text-[11px] text-muted-foreground">Guardado</dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">{brl(goal.saved)}</dd>
                    </div>
                    <div className="rounded-2xl bg-warning-soft px-2 py-3">
                      <dt className="text-[11px] text-muted-foreground">Falta</dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">{brl(remaining)}</dd>
                    </div>
                  </dl>

                  <Button
                    variant="outline"
                    className="mt-4 h-11 w-full rounded-2xl"
                    onClick={() => {
                      setDepositFor(goal.id);
                      setDepositValue("");
                    }}
                  >
                    Guardar dinheiro nesta meta
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <NewGoalDialog open={open} setOpen={setOpen} onAdd={addGoal} />

      <Dialog open={depositFor !== null} onOpenChange={(v) => !v && setDepositFor(null)}>
        <DialogContent className="rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Quanto você quer guardar?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <MoneyInput value={depositValue} onChange={setDepositValue} />
            <Button size="lg" className="h-12 rounded-2xl text-base" onClick={confirmDeposit}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function NewGoalDialog({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAdd: ReturnType<typeof useStore>["addGoal"];
}) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [deadline, setDeadline] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !Number(target)) {
      toast.error("Informe o nome e o valor da meta.");
      return;
    }
    onAdd({
      name: name.trim(),
      target: Number(target),
      saved: Number(saved) || 0,
      ...(deadline ? { deadline } : {}),
    });
    toast.success("Meta criada!");
    setName("");
    setTarget("");
    setSaved("");
    setDeadline("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar meta</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-name">Nome da meta</Label>
            <Input
              id="goal-name"
              className="h-12 rounded-2xl"
              placeholder="Ex: reserva para o bebê"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-target">Valor da meta</Label>
              <MoneyInput id="goal-target" value={target} onChange={setTarget} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="goal-saved">Já guardado</Label>
              <MoneyInput id="goal-saved" value={saved} onChange={setSaved} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="goal-deadline">Prazo (opcional)</Label>
            <Input
              id="goal-deadline"
              type="date"
              className="h-12 rounded-2xl"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-2xl text-base">
            Criar meta
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
