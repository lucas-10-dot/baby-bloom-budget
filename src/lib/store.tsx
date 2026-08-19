import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AppData,
  BoxDeposit,
  Expense,
  Goal,
  LayetteItem,
  PurchaseAnalysis,
  SavingsBox,
} from "./types";
import { emptyData, sampleData } from "./sample-data";

const STORAGE_KEY = "ninho-financeiro:v1";

const newId = () => Math.random().toString(36).slice(2, 10);

interface StoreValue {
  data: AppData;
  hydrated: boolean;
  update: (fn: (d: AppData) => AppData) => void;
  addExpense: (e: Omit<Expense, "id" | "createdAt">) => void;
  removeExpense: (id: string) => void;
  addGoal: (g: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  addLayetteItem: (i: Omit<LayetteItem, "id" | "createdAt">) => void;
  updateLayetteItem: (id: string, patch: Partial<LayetteItem>) => void;
  removeLayetteItem: (id: string) => void;
  addAnalysis: (a: Omit<PurchaseAnalysis, "id" | "createdAt">) => void;
  addBox: (b: Omit<SavingsBox, "id" | "createdAt" | "milestonesSeen">) => string;
  updateBox: (id: string, patch: Partial<SavingsBox>) => void;
  removeBox: (id: string) => void;
  addDeposit: (d: Omit<BoxDeposit, "id" | "createdAt">) => void;
  removeDeposit: (id: string) => void;
  markMilestone: (boxId: string, milestone: number) => void;
  loadSample: () => void;
  clearAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => emptyData());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AppData>;
        setData({ ...emptyData(), ...parsed });
      } else setData(sampleData());
    } catch {
      setData(sampleData());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignora falha de armazenamento */
    }
  }, [data, hydrated]);

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => ({ ...fn(prev) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      data,
      hydrated,
      update,
      addExpense: (e) =>
        update((d) => ({
          ...d,
          isSample: false,
          expenses: [
            { ...e, id: newId(), createdAt: new Date().toISOString() },
            ...d.expenses,
          ],
          financial: {
            ...d.financial,
            availableBalance: d.financial.availableBalance - e.amount,
          },
        })),
      removeExpense: (id) =>
        update((d) => {
          const target = d.expenses.find((e) => e.id === id);
          return {
            ...d,
            expenses: d.expenses.filter((e) => e.id !== id),
            financial: {
              ...d.financial,
              availableBalance:
                d.financial.availableBalance + (target?.amount ?? 0),
            },
          };
        }),
      addGoal: (g) =>
        update((d) => ({
          ...d,
          isSample: false,
          goals: [
            ...d.goals,
            { ...g, id: newId(), createdAt: new Date().toISOString() },
          ],
        })),
      updateGoal: (id, patch) =>
        update((d) => ({
          ...d,
          goals: d.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      removeGoal: (id) =>
        update((d) => ({ ...d, goals: d.goals.filter((g) => g.id !== id) })),
      addLayetteItem: (i) =>
        update((d) => ({
          ...d,
          isSample: false,
          layette: [
            { ...i, id: newId(), createdAt: new Date().toISOString() },
            ...d.layette,
          ],
        })),
      updateLayetteItem: (id, patch) =>
        update((d) => ({
          ...d,
          layette: d.layette.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      removeLayetteItem: (id) =>
        update((d) => ({
          ...d,
          layette: d.layette.filter((i) => i.id !== id),
        })),
      addAnalysis: (a) =>
        update((d) => ({
          ...d,
          analyses: [
            { ...a, id: newId(), createdAt: new Date().toISOString() },
            ...d.analyses,
          ].slice(0, 10),
        })),
      addBox: (b) => {
        const id = newId();
        update((d) => ({
          ...d,
          isSample: false,
          boxes: [
            ...d.boxes,
            { ...b, id, createdAt: new Date().toISOString(), milestonesSeen: [] },
          ],
        }));
        return id;
      },
      updateBox: (id, patch) =>
        update((d) => ({
          ...d,
          boxes: d.boxes.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      removeBox: (id) =>
        update((d) => ({
          ...d,
          boxes: d.boxes.filter((b) => b.id !== id),
          deposits: d.deposits.filter((dep) => dep.boxId !== id),
        })),
      addDeposit: (dep) =>
        update((d) => ({
          ...d,
          deposits: [
            { ...dep, id: newId(), createdAt: new Date().toISOString() },
            ...d.deposits,
          ],
        })),
      removeDeposit: (id) =>
        update((d) => ({
          ...d,
          deposits: d.deposits.filter((dep) => dep.id !== id),
        })),
      markMilestone: (boxId, milestone) =>
        update((d) => ({
          ...d,
          boxes: d.boxes.map((b) =>
            b.id === boxId && !b.milestonesSeen.includes(milestone)
              ? { ...b, milestonesSeen: [...b.milestonesSeen, milestone] }
              : b,
          ),
        })),
      loadSample: () => setData(sampleData()),
      clearAll: () => setData(emptyData()),
    }),
    [data, hydrated, update],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}
