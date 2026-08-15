import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-card",
  primary: "bg-primary-soft/60",
  success: "bg-success-soft",
  warning: "bg-warning-soft",
  info: "bg-info-soft",
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
    <div
      className={cn(
        "rounded-3xl border border-border p-5 shadow-[var(--shadow-soft)]",
        tones[tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon ? <span className="shrink-0 text-primary">{icon}</span> : null}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-foreground sm:text-[28px]">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
