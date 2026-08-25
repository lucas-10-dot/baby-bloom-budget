import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditBoxButton({ onClick, childName }: { onClick: () => void; childName: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 rounded-xl text-muted-foreground"
      aria-label={`Editar caixinha de ${childName}`}
      onClick={onClick}
    >
      <Pencil className="size-4" />
    </Button>
  );
}
