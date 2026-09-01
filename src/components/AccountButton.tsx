import { Link, useNavigate } from "@tanstack/react-router";
import { Cloud, CloudOff, LogIn, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";

export function AccountButton() {
  const { user, loading, signOut } = useAuth();
  const { cloud } = useStore();
  const navigate = useNavigate();

  if (loading) return null;

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="rounded-full">
        <Link to="/auth">
          <LogIn className="size-4" /> Entrar
        </Link>
      </Button>
    );
  }

  const status =
    cloud === "loading" ? (
      <>
        <RefreshCw className="size-3.5 animate-spin" /> sincronizando
      </>
    ) : cloud === "erro" ? (
      <>
        <CloudOff className="size-3.5" /> sem sincronizar
      </>
    ) : (
      <>
        <Cloud className="size-3.5" /> salvo na nuvem
      </>
    );

  return (
    <div className="flex items-center gap-2">
      <span className="hidden items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground sm:flex">
        {status}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={async () => {
          await signOut();
          navigate({ to: "/auth", replace: true });
        }}
      >
        <LogOut className="size-4" /> Sair
      </Button>
    </div>
  );
}
