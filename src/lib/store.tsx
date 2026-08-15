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
  Expense,
  Goal,
  LayetteItem,
  PurchaseAnalysis,
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
      if (raw) setData(JSON.parse(raw) as AppData);
      else setData(sampleData());
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
