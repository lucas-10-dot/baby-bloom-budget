import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, Bell, Shield, Lock, HelpCircle, Star, Share2, LogOut, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais — MamaWise" },
      { name: "description", content: "Ajustes da conta, privacidade, ajuda e opções do MamaWise." },
      { property: "og:title", content: "Mais — MamaWise" },
      { property: "og:description", content: "Ajustes da conta, privacidade, ajuda e opções do MamaWise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mais,
});

const items = [[User,"Meu Perfil"],[Bell,"Notificações"],[Shield,"Segurança"],[Lock,"Privacidade"],[HelpCircle,"Ajuda e Suporte"],[Star,"Avaliar o MamaWise"],[Share2,"Compartilhar app"]] as const;

function Mais() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <AppShell title="Mais">
      <section className="rounded-3xl border border-border bg-white p-2 shadow-[0_6px_22px_rgba(60,30,100,.05)]">
        {items.map(([Icon, label]) => (
          <button key={label} className="flex w-full items-center gap-3 border-b border-border px-3 py-3.5 text-left last:border-0">
            <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-4" /></span>
            <span className="flex-1 text-[11px] font-semibold">{label}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </section>
      <button
        onClick={async () => {
          await signOut();
          navigate({ to: "/auth", replace: true });
        }}
        className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-[#ffdede] bg-white px-4 py-3.5 text-left text-[11px] font-semibold text-destructive"
      >
        <LogOut className="size-4" />Sair do aplicativo
      </button>
      <Link to="/premium" className="mt-4 block rounded-2xl bg-primary-soft p-4">
        <p className="text-[11px] font-bold text-primary">✨ MamaWise Premium</p>
        <p className="mt-1 text-[10px] text-muted-foreground">Tenha mais recursos para cuidar do futuro.</p>
      </Link>
    </AppShell>
  );
}
