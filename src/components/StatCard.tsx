import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "",
  primary: "bg-[linear-gradient(160deg,var(--color-card),color-mix(in_oklab,var(--color-primary-soft)_55%,var(--color-card)))]",
  success: "bg-[linear-gradient(160deg,var(--color-card),color-mix(in_oklab,var(--color-success-soft)_60%,var(--color-card)))]",
  warning: "bg-[linear-gradient(160deg,var(--color-card),color-mix(in_oklab,var(--color-warning-soft)_60%,var(--color-card)))]",
  info: "bg-[linear-gradient(160deg,var(--color-card),color-mix(in_oklab,var(--color-info-soft)_60%,var(--color-card)))]",
} as const;

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: keyof typeof tones;
  icon?: ReactNode;
}) {
  return (
    <div className={cn("card-premium hover-lift group relative overflow-hidden p-5", tones[tone])}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-gold)] opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
        {icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card/70 text-primary shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-105">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground tabular-nums sm:text-[30px]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

