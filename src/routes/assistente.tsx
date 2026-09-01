import { createFileRoute } from "@tanstack/react-router";
import { Bot, Check, MoreVertical, Send, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/assistente")({ head: () => ({ meta: [{ title: "Assistente MamaWise" }] }), component: Assistente });
function Assistente() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{me?: boolean; text: string}[]>([
    { text: "👋 Olá, mamãe!\nComo posso te ajudar hoje?" },
    { me: true, text: "Quero dicas para economizar nas compras do mês." },
    { text: "Aqui vão algumas dicas para você economizar nas compras do mês:" },
  ]);
  function send() { if (!text.trim()) return; const value = text.trim(); setMessages((m) => [...m, { me: true, text: value }, { text: "Vou analisar isso com você e sugerir uma opção mais econômica. 💜" }]); setText(""); }
  return <AppShell title="Assistente MamaWise">
    <div className="flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-full bg-primary-soft text-primary"><Bot className="size-5" /></span><div><p className="text-xs font-bold">MamaWise IA</p><p className="text-[9px] text-success">● Online</p></div></div><MoreVertical className="size-5" /></div>
    <div className="mt-4 flex min-h-[540px] flex-col rounded-3xl bg-white p-3 shadow-[0_6px_25px_rgba(60,30,100,.06)]">
      <div className="flex-1 space-y-3 overflow-auto py-2">{messages.map((m, i) => <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 text-[11px] leading-relaxed ${m.me ? "rounded-br-md bg-primary text-white" : "rounded-bl-md bg-[#f1f0f6] text-[#29263b]"}`}>{m.text}{!m.me && i === 2 && <div className="mt-3 space-y-2"><p>☑️ Compare preços antes de comprar</p><p>☑️ Compre em maior quantidade</p><p>☑️ Aproveite cupons e promoções</p><p>☑️ Prefira marcas com melhor custo-benefício</p></div>}</div></div>)}</div>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border p-1.5"><Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Digite sua mensagem..." className="h-10 border-0 shadow-none focus-visible:ring-0 text-[11px]" /><Button onClick={send} size="icon" className="size-9 shrink-0 rounded-xl"><Send className="size-4" /></Button></div>
    </div>
  </AppShell>;
}
