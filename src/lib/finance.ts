import type {
  AnalysisVerdict,
  AppData,
  Expense,
  Goal,
  LayetteItem,
} from "./types";

export const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);

export const monthKey = (iso: string) => iso.slice(0, 7);

export const currentMonthKey = () => new Date().toISOString().slice(0, 7);

export const previousMonthKey = () => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 7);
};

export const monthLabel = (key: string) => {
  const [ys, ms] = key.split("-");
  return new Date(Number(ys), Number(ms ?? 1) - 1, 1)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
};

/** Meses inteiros restantes até a data prevista (mínimo 1 quando ainda não nasceu). */
export function monthsUntil(dateIso?: string): number | null {
  if (!dateIso) return null;
  const target = new Date(dateIso + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diff =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth());
  return Math.max(0, diff);
}

export function sumExpensesByMonth(expenses: Expense[], key: string) {
  return expenses
    .filter((e) => monthKey(e.date) === key)
    .reduce((acc, e) => acc + e.amount, 0);
}

export function expensesByCategory(expenses: Expense[], key?: string) {
  const list = key ? expenses.filter((e) => monthKey(e.date) === key) : expenses;
  const map = new Map<string, number>();
  for (const e of list) map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function lastMonthsKeys(count: number) {
  const keys: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = count - 1; i >= 0; i--) {
    const c = new Date(d);
    c.setMonth(d.getMonth() - i);
    keys.push(c.toISOString().slice(0, 7));
  }
  return keys;
}

/** Evolução da reserva: valor atual menos o que ainda seria guardado mês a mês. */
export function reserveEvolution(reserve: number, monthlySaving: number) {
  const keys = lastMonthsKeys(6);
  return keys.map((key, i) => ({
    month: monthLabel(key),
    valor: Math.max(0, Math.round(reserve - monthlySaving * (keys.length - 1 - i))),
  }));
}

export function layetteTotals(items: LayetteItem[], budget: number) {
  const planned = items.reduce(
    (acc, i) => acc + i.estimatedPrice * i.quantity,
    0,
  );
  const bought = items
    .filter((i) => i.purchased)
    .reduce((acc, i) => acc + (i.paidPrice ?? i.estimatedPrice * i.quantity), 0);
  return {
    planned,
    bought,
    remainingBudget: budget - planned,
    remainingToBuy: Math.max(0, planned - bought),
  };
}

export function goalProgress(goal: Goal) {
  const percent = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0;
  return {
    percent,
    remaining: Math.max(0, goal.target - goal.saved),
  };
}

export interface PlanSummary {
  goal: number;
  reserved: number;
  missing: number;
  monthsLeft: number | null;
  neededPerMonth: number | null;
  onTrack: boolean | null;
}

export function buildPlanSummary(data: AppData): PlanSummary {
  const { financial, baby } = data;
  const goal = financial.goalAmount;
  const reserved = financial.currentReserve;
  const missing = Math.max(0, goal - reserved);
  const monthsLeft = monthsUntil(baby.dueDate);
  const neededPerMonth =
    monthsLeft && monthsLeft > 0 ? Math.ceil(missing / monthsLeft) : missing > 0 ? missing : 0;
  return {
    goal,
    reserved,
    missing,
    monthsLeft,
    neededPerMonth: monthsLeft === null ? null : neededPerMonth,
    onTrack:
      monthsLeft === null ? null : financial.monthlySaving >= (neededPerMonth ?? 0),
  };
}

export interface AnalysisResult {
  verdict: AnalysisVerdict;
  percentOfAvailable: number;
  remainingAfter: number;
  neededPerMonth: number | null;
  headline: string;
  explanation: string[];
}

export function analyzePurchase(
  data: AppData,
  price: number,
  priority: "essencial" | "importante" | "pode_esperar",
): AnalysisResult {
  const available = data.financial.availableBalance;
  const plan = buildPlanSummary(data);
  const percent = available > 0 ? (price / available) * 100 : 100;
  const remainingAfter = available - price;

  let verdict: AnalysisVerdict = "ok";
  if (percent > 40 || remainingAfter < 0) verdict = "risco";
  else if (percent > 15) verdict = "atencao";
  if (priority === "pode_esperar" && verdict === "ok" && percent > 8) verdict = "atencao";
  if (priority === "essencial" && verdict === "atencao" && percent <= 25) verdict = "ok";

  const headline =
    verdict === "ok"
      ? "COMPRA DENTRO DO ORÇAMENTO"
      : verdict === "atencao"
        ? "PENSE MELHOR ANTES DE COMPRAR"
        : "ESSA COMPRA PODE COMPROMETER SUA META";

  const explanation = [
    `Essa compra representa ${Math.round(percent)}% do seu dinheiro disponível.`,
    `Depois dessa compra, você terá ${brl(remainingAfter)} disponíveis.`,
  ];
  if (plan.neededPerMonth !== null) {
    explanation.push(
      `Você ainda precisa reservar ${brl(plan.neededPerMonth)} por mês para atingir sua meta.`,
    );
  }

  return {
    verdict,
    percentOfAvailable: percent,
    remainingAfter,
    neededPerMonth: plan.neededPerMonth,
    headline,
    explanation,
  };
}
