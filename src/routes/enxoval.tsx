import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { PriorityBadge, priorityLabel } from "@/components/PriorityBadge";
import { MoneyInput } from "@/routes/planejamento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";
import type { LayetteCategory, Priority } from "@/lib/types";
import { brl, layetteTotals } from "@/lib/finance";

export const Route = createFileRoute("/enxoval")({
  head: () => ({
    meta: [
      { title: "Enxoval Inteligente — Ninho Financeiro" },
      {
        name: "description",
        content:
          "Monte o enxoval por prioridade, controle o orçamento e evite comprar o que não precisa.",
      },
      { property: "og:title", content: "Enxoval Inteligente" },
      {
        property: "og:description",
        content: "Itens essenciais, importantes e o que pode esperar — tudo somado para você.",
      },
    ],
  }),
  component: Enxoval,
});

const categories: LayetteCategory[] = [
  "Quarto",
  "Roupas",
  "Higiene",
  "Alimentação",
  "Transporte",
  "Segurança",
  "Banho",
  "Outros",
];

const priorities: Priority[] = ["essencial", "importante", "pode_esperar"];

function Enxoval() {
  const { data, addLayetteItem, updateLayetteItem, removeLayetteItem } = useStore();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"todos" | Priority>("todos");

  const totals = layetteTotals(data.layette, data.financial.layetteBudget);
  const items = useMemo(
    () => (filter === "todos" ? data.layette : data.layette.filter((i) => i.priority === filter)),
    [data.layette, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<LayetteCategory, typeof items>();
    for (const item of items) {
      map.set(item.category, [...(map.get(item.category) ?? []), item]);
    }
    return [...map.entries()];
  }, [items]);

  const percentUsed =
    data.financial.layetteBudget > 0
      ? Math.min(100, (totals.planned / data.financial.layetteBudget) * 100)
      : 0;

  return (
    <AppShell
      title="Enxoval Inteligente"
      subtitle="Organize as compras por prioridade e compre só o que faz sentido agora."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Orçamento do enxoval"
          value={brl(data.financial.layetteBudget)}
          hint="Defina no planejamento da chegada."
          tone="primary"
        />
        <StatCard
          label="Já planejado"
          value={brl(totals.planned)}
          hint={`Desse total, ${brl(totals.bought)} já foi comprado.`}
        />
        <StatCard
          label="Restante"
          value={brl(totals.remainingBudget)}
          tone={totals.remainingBudget < 0 ? "warning" : "success"}
          hint={
            totals.remainingBudget < 0
              ? "Sua lista está acima do orçamento planejado."
              : "Ainda cabe no seu orçamento."
          }
        />
      </div>

      <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-muted-foreground">
          Sua lista usa aproximadamente {Math.round(percentUsed)}% do orçamento do enxoval.
        </p>
        <Progress value={percentUsed} className="mt-3 h-2.5" />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
          {(["todos", ...priorities] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {p === "todos" ? "Todos" : priorityLabel[p]}
            </button>
          ))}
        </div>
        <Button
          size="lg"
          className="h-11 shrink-0 rounded-2xl"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-5" /> <span className="hidden sm:inline">Adicionar item</span>
        </Button>
      </div>

      <div className="mt-5">
        {data.layette.length === 0 ? (
          <EmptyState
            icon={<ShoppingBasket className="size-6" />}
            title="Sua lista de enxoval está vazia."
            description="Comece pelos itens essenciais — depois adicione o resto com calma."
            action={
              <Button size="lg" className="h-12 rounded-2xl" onClick={() => setOpen(true)}>
                <Plus className="size-5" /> Adicionar primeiro item
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-6">
            {grouped.map(([category, list]) => (
              <section key={category}>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {category}
                </h2>
                <ul className="flex flex-col gap-3">
                  {list.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
                    >
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
                        <Checkbox
                          checked={item.purchased}
                          className="mt-1 size-5 shrink-0"
                          aria-label={`Marcar ${item.name} como comprado`}
                          onCheckedChange={(checked) => {
                            const purchased = checked === true;
                            updateLayetteItem(item.id, {
                              purchased,
                              ...(purchased
                                ? { paidPrice: item.paidPrice ?? item.estimatedPrice * item.quantity }
                                : {}),
                            });
                            toast.success(
                              purchased ? "Item marcado como comprado" : "Item voltou para a lista",
                            );
                          }}
                        />
                        <div className="min-w-0">
                          <p
                            className={`truncate font-medium ${
                              item.purchased ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <PriorityBadge priority={item.priority} />
                            <span className="text-xs text-muted-foreground">
                              {item.quantity}x · {brl(item.estimatedPrice)} cada
                            </span>
                          </div>
                          {item.note ? (
                            <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className="font-display text-base font-semibold text-foreground">
                            {brl(
                              item.purchased
                                ? (item.paidPrice ?? item.estimatedPrice * item.quantity)
                                : item.estimatedPrice * item.quantity,
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-xl text-muted-foreground"
                            aria-label={`Remover ${item.name}`}
                            onClick={() => removeLayetteItem(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <NewItemDialog open={open} setOpen={setOpen} onAdd={addLayetteItem} />
    </AppShell>
  );
}

function NewItemDialog({
  open,
  setOpen,
  onAdd,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onAdd: ReturnType<typeof useStore>["addLayetteItem"];
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<LayetteCategory>("Quarto");
  const [priority, setPriority] = useState<Priority>("essencial");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !Number(price)) {
      toast.error("Informe o nome e o preço estimado.");
      return;
    }
    onAdd({
      name: name.trim(),
      category,
      priority,
      quantity: Math.max(1, Number(quantity) || 1),
      estimatedPrice: Number(price),
      purchased: false,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    toast.success("Item adicionado ao enxoval!");
    setName("");
    setPrice("");
    setNote("");
    setQuantity("1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar item do enxoval</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-name">Nome</Label>
            <Input
              id="item-name"
              className="h-12 rounded-2xl"
              placeholder="Ex: berço"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as LayetteCategory)}>
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Prioridade</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="h-12 w-full rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    {priorityLabel[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qtd">Quantidade</Label>
              <Input
                id="qtd"
                inputMode="numeric"
                className="h-12 rounded-2xl"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="preco">Preço estimado</Label>
              <MoneyInput id="preco" value={price} onChange={setPrice} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="obs">Observação (opcional)</Label>
            <Textarea
              id="obs"
              className="rounded-2xl"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-2xl text-base">
            Adicionar item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
