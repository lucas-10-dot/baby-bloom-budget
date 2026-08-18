// Entidades do domínio — modeladas para futura persistência em banco de dados.
// Hoje são salvas localmente no navegador (ver src/lib/store.tsx).

export type Priority = "essencial" | "importante" | "pode_esperar";

export type LayetteCategory =
  | "Quarto"
  | "Roupas"
  | "Higiene"
  | "Alimentação"
  | "Transporte"
  | "Segurança"
  | "Banho"
  | "Outros";

export type ExpenseCategory =
  | "Alimentação"
  | "Roupas"
  | "Higiene"
  | "Saúde"
  | "Brinquedos"
  | "Quarto"
  | "Transporte"
  | "Educação"
  | "Outros";

export interface BabyProfile {
  id: string;
  babyName?: string;
  dueDate?: string; // ISO date
}

export interface FinancialProfile {
  id: string;
  monthlySaving: number; // quanto consegue guardar por mês
  currentReserve: number; // já reservado para o bebê
  layetteBudget: number; // orçamento do enxoval
  goalAmount: number; // meta principal para o bebê
  availableBalance: number; // saldo disponível hoje
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline?: string; // ISO date
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO date
  description: string;
  category: ExpenseCategory;
  note?: string;
  createdAt: string;
}

export interface LayetteItem {
  id: string;
  name: string;
  category: LayetteCategory;
  priority: Priority;
  quantity: number;
  estimatedPrice: number;
  paidPrice?: number;
  purchased: boolean;
  note?: string;
  createdAt: string;
}

export type AnalysisVerdict = "ok" | "atencao" | "risco";

export interface PurchaseAnalysis {
  id: string;
  productName: string;
  price: number;
  category: ExpenseCategory;
  priority: Priority;
  verdict: AnalysisVerdict;
  percentOfAvailable: number;
  remainingAfter: number;
  createdAt: string;
}

export type BoxObjective =
  | "futuro_bebe"
  | "educacao"
  | "emergencias"
  | "aniversario"
  | "primeiro_carro"
  | "futuro"
  | "outro";

/** Caixinha do Futuro — organizador de metas. Nenhum dinheiro real é movimentado. */
export interface SavingsBox {
  id: string;
  childName: string;
  childBirthDate?: string; // ISO date
  objective: BoxObjective;
  customObjective?: string;
  initialAmount: number; // valor informado na criação
  target: number;
  monthlyContribution: number;
  targetDate?: string; // ISO date
  createdAt: string;
  milestonesSeen: number[]; // 25 | 50 | 75 | 100
}

export interface BoxDeposit {
  id: string;
  boxId: string;
  amount: number;
  date: string; // ISO date
  note?: string;
  createdAt: string;
}

export interface AppData {
  isSample: boolean;
  baby: BabyProfile;
  financial: FinancialProfile;
  goals: Goal[];
  expenses: Expense[];
  layette: LayetteItem[];
  analyses: PurchaseAnalysis[];
  boxes: SavingsBox[];
  deposits: BoxDeposit[];
}

