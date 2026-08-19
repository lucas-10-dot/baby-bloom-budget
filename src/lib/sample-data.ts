import type { AppData } from "./types";
import { currentMonthKey, previousMonthKey } from "./finance";

const id = () => Math.random().toString(36).slice(2, 10);

const day = (monthK: string, d: number) => `${monthK}-${String(d).padStart(2, "0")}`;

const dueDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 5);
  return d.toISOString().slice(0, 10);
};

const futureDate = (months: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
};

const boxA = id();
const boxB = id();
const boxC = id();

export const emptyData = (): AppData => ({
  isSample: false,
  baby: { id: id() },
  financial: {
    id: id(),
    monthlySaving: 0,
    currentReserve: 0,
    layetteBudget: 0,
    goalAmount: 0,
    availableBalance: 0,
  },
  goals: [],
  expenses: [],
  layette: [],
  analyses: [],
  boxes: [],
  deposits: [],
});

export const sampleData = (): AppData => {
  const cur = currentMonthKey();
  const prev = previousMonthKey();
  return {
    isSample: true,
    baby: { id: id(), babyName: "Nosso bebê", dueDate: dueDate() },
    financial: {
      id: id(),
      monthlySaving: 400,
      currentReserve: 2300,
      layetteBudget: 3000,
      goalAmount: 5000,
      availableBalance: 3850,
    },
    goals: [
      {
        id: id(),
        name: "Reserva para o bebê",
        target: 5000,
        saved: 2300,
        deadline: dueDate(),
        createdAt: new Date().toISOString(),
      },
      {
        id: id(),
        name: "Enxoval",
        target: 3000,
        saved: 1200,
        createdAt: new Date().toISOString(),
      },
      {
        id: id(),
        name: "Emergência",
        target: 2000,
        saved: 450,
        createdAt: new Date().toISOString(),
      },
    ],
    expenses: [
      { id: id(), amount: 320, date: day(cur, 4), description: "Fraldas e lenços", category: "Higiene", createdAt: new Date().toISOString() },
      { id: id(), amount: 180, date: day(cur, 9), description: "Bodies e macacões", category: "Roupas", createdAt: new Date().toISOString() },
      { id: id(), amount: 150, date: day(cur, 12), description: "Consulta pré-natal", category: "Saúde", createdAt: new Date().toISOString() },
      { id: id(), amount: 130, date: day(cur, 18), description: "Fórmula e mamadeiras", category: "Alimentação", createdAt: new Date().toISOString() },
      { id: id(), amount: 250, date: day(prev, 6), description: "Cortina do quarto", category: "Quarto", createdAt: new Date().toISOString() },
      { id: id(), amount: 210, date: day(prev, 15), description: "Vitaminas", category: "Saúde", createdAt: new Date().toISOString() },
      { id: id(), amount: 160, date: day(prev, 22), description: "Body kit 5 peças", category: "Roupas", createdAt: new Date().toISOString() },
    ],
    layette: [
      { id: id(), name: "Berço", category: "Quarto", priority: "essencial", quantity: 1, estimatedPrice: 900, purchased: true, paidPrice: 850, createdAt: new Date().toISOString() },
      { id: id(), name: "Colchão do berço", category: "Quarto", priority: "essencial", quantity: 1, estimatedPrice: 250, purchased: false, createdAt: new Date().toISOString() },
      { id: id(), name: "Body manga curta", category: "Roupas", priority: "essencial", quantity: 8, estimatedPrice: 25, purchased: false, createdAt: new Date().toISOString() },
      { id: id(), name: "Fraldas RN (pacote)", category: "Higiene", priority: "essencial", quantity: 4, estimatedPrice: 45, purchased: true, paidPrice: 172, createdAt: new Date().toISOString() },
      { id: id(), name: "Banheira", category: "Banho", priority: "importante", quantity: 1, estimatedPrice: 160, purchased: false, createdAt: new Date().toISOString() },
      { id: id(), name: "Bebê conforto", category: "Transporte", priority: "essencial", quantity: 1, estimatedPrice: 480, purchased: false, createdAt: new Date().toISOString() },
      { id: id(), name: "Babá eletrônica", category: "Segurança", priority: "pode_esperar", quantity: 1, estimatedPrice: 300, purchased: false, note: "Dá para esperar promoção", createdAt: new Date().toISOString() },
      { id: id(), name: "Mamadeira", category: "Alimentação", priority: "importante", quantity: 3, estimatedPrice: 40, purchased: false, createdAt: new Date().toISOString() },
    ],
    analyses: [],
    boxes: [
      {
        id: boxA,
        childName: "Lucas",
        objective: "futuro_bebe",
        initialAmount: 1000,
        target: 5000,
        monthlyContribution: 150,
        targetDate: futureDate(30),
        createdAt: new Date().toISOString(),
        milestonesSeen: [25],
      },
      {
        id: boxB,
        childName: "Lucas",
        objective: "educacao",
        initialAmount: 500,
        target: 10000,
        monthlyContribution: 200,
        targetDate: futureDate(60),
        createdAt: new Date().toISOString(),
        milestonesSeen: [],
      },
      {
        id: boxC,
        childName: "Família",
        objective: "emergencias",
        initialAmount: 800,
        target: 3000,
        monthlyContribution: 100,
        createdAt: new Date().toISOString(),
        milestonesSeen: [25],
      },
    ],
    deposits: [
      { id: id(), boxId: boxA, amount: 150, date: day(cur, 5), note: "Economia do mês", createdAt: new Date().toISOString() },
      { id: id(), boxId: boxA, amount: 100, date: day(prev, 18), note: "Economia do mês", createdAt: new Date().toISOString() },
    ],
  };
};
