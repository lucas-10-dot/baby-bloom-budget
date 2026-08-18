import type { BoxDeposit, BoxObjective, SavingsBox } from "./types";
import { brl, currentMonthKey, monthKey } from "./finance";

export const objectives: {
  value: BoxObjective;
  emoji: string;
  label: string;
}[] = [
  { value: "futuro_bebe", emoji: "👶", label: "Futuro do bebê" },
  { value: "educacao", emoji: "🎓", label: "Educação" },
  { value: "emergencias", emoji: "🏥", label: "Emergências" },
  { value: "aniversario", emoji: "🎂", label: "Aniversário" },
  { value: "primeiro_carro", emoji: "🚗", label: "Primeiro carro" },
  { value: "futuro", emoji: "🏠", label: "Futuro" },
  { value: "outro", emoji: "✨", label: "Outro objetivo" },
];

export function objectiveInfo(box: SavingsBox) {
  const found = objectives.find((o) => o.value === box.objective) ?? objectives[6];
  return {
    emoji: found.emoji,
    label:
      box.objective === "outro" && box.customObjective
        ? box.customObjective
        : found.label,
  };
}

export const depositsOf = (deposits: BoxDeposit[], boxId: string) =>
  deposits
    .filter((d) => d.boxId === boxId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

const addMonths = (date: Date, months: number) => {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const longMonth = (d: Date) =>
  d
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(" de ", " de ");

export const longDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export interface BoxStats {
  current: number;
  target: number;
  remaining: number;
  percent: number;
  monthly: number;
  monthsNeeded: number | null;
  forecast: string | null;
  monthsUntilTarget: number | null;
  onTrack: boolean | null;
  neededPerMonth: number | null;
  savedThisMonth: number;
  totalDeposited: number;
  completed: boolean;
}

export function boxStats(box: SavingsBox, deposits: BoxDeposit[]): BoxStats {
  const mine = deposits.filter((d) => d.boxId === box.id);
  const totalDeposited = mine.reduce((acc, d) => acc + d.amount, 0);
  const current = box.initialAmount + totalDeposited;
  const target = box.target;
  const remaining = Math.max(0, target - current);
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const monthly = box.monthlyContribution;

  const monthsNeeded =
    remaining <= 0 ? 0 : monthly > 0 ? Math.ceil(remaining / monthly) : null;
  const forecast =
    monthsNeeded === null
      ? null
      : longMonth(addMonths(new Date(), monthsNeeded));

  let monthsUntilTarget: number | null = null;
  if (box.targetDate) {
    const t = new Date(box.targetDate + "T00:00:00");
    if (!Number.isNaN(t.getTime())) {
      const now = new Date();
      monthsUntilTarget = Math.max(
        0,
        (t.getFullYear() - now.getFullYear()) * 12 + (t.getMonth() - now.getMonth()),
      );
    }
  }

  const neededPerMonth =
    monthsUntilTarget === null
      ? null
      : monthsUntilTarget > 0
        ? Math.ceil(remaining / monthsUntilTarget)
        : remaining;

  const onTrack =
    remaining <= 0
      ? true
      : neededPerMonth === null
        ? null
        : monthly >= neededPerMonth;

  const cur = currentMonthKey();
  const savedThisMonth = mine
    .filter((d) => monthKey(d.date) === cur)
    .reduce((acc, d) => acc + d.amount, 0);

  return {
    current,
    target,
    remaining,
    percent,
    monthly,
    monthsNeeded,
    forecast,
    monthsUntilTarget,
    onTrack,
    neededPerMonth,
    savedThisMonth,
    totalDeposited,
    completed: remaining <= 0 && target > 0,
  };
}

export const milestoneMessage = (milestone: number) =>
  milestone >= 100
    ? {
        title: "🎉 META ALCANÇADA!",
        text: "Você conseguiu! Esse valor representa meses de dedicação ao futuro do seu filho.",
      }
    : milestone >= 75
      ? { title: "Está quase lá!", text: "Faltam poucos passos para completar essa meta." }
      : milestone >= 50
        ? { title: "Você já está na metade do caminho!", text: "Continue nesse ritmo, está indo muito bem." }
        : {
            title: "Você começou a construir esse futuro. ❤️",
            text: "Os primeiros 25% já estão registrados.",
          };

export const reachedMilestone = (percent: number) =>
  percent >= 100 ? 100 : percent >= 75 ? 75 : percent >= 50 ? 50 : percent >= 25 ? 25 : 0;

/** Sugestão educativa de quanto guardar por mês. */
export function suggestMonthly(input: {
  income: number;
  expenses: number;
  saved: number;
  target: number;
}) {
  const surplus = Math.max(0, input.income - input.expenses);
  const remaining = Math.max(0, input.target - input.saved);
  // Ponto de partida confortável: metade da sobra mensal, limitada ao que falta.
  const base = Math.floor((surplus * 0.5) / 10) * 10;
  const value = Math.max(0, Math.min(base, remaining || base));
  const months = value > 0 && remaining > 0 ? Math.ceil(remaining / value) : null;
  return { surplus, remaining, value, months };
}

export const roundUpChange = (price: number) => {
  const change = Math.round((Math.ceil(price) - price) * 100) / 100;
  return change === 0 ? 1 : change;
};

export const boxSummaryLine = (box: SavingsBox, stats: BoxStats) =>
  `${objectiveInfo(box).emoji} ${objectiveInfo(box).label} (${box.childName}): ${brl(stats.current)} de ${brl(stats.target)} — ${Math.round(stats.percent)}%`;
