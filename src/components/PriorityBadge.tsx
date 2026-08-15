import type { Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

export const priorityLabel: Record<Priority, string> = {
  essencial: "Essencial",
  importante: "Importante",
  pode_esperar: "Pode esperar",
};

const styles: Record<Priority, string> = {
  essencial: "bg-success-soft text-success",
  importante: "bg-warning-soft text-warning-foreground",
  pode_esperar: "bg-muted text-muted-foreground",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        styles[priority],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {priorityLabel[priority]}
    </span>
  );
}
