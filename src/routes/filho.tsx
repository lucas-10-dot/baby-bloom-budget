import { createFileRoute } from "@tanstack/react-router";
import { Baby, CalendarDays, Pencil, Ruler, Shirt, Weight, HeartPulse } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/filho")({ head: () => ({ meta: [{ title: "Meu Filho — MamaWise" }] }), component: Filho });
function Filho(){
 const {data}=useStore(); const box=data.boxes[0]; const name=box?.childName||data.baby.babyName||"Miguel"; const birth=box?.childBirthDate||data.baby.dueDate||"2021-09-12";
 return <AppShell title="Meu Filho"><div className="flex items-center justify-end -mt-1 mb-2"><Pencil className="size-4"/></div>
 <section className="rounded-2xl border border-[#eadcf9] bg-[#fbf6ff] p-4"><div className="flex items-center gap-4"><div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#eee2ff] text-primary text-4xl">👶🏻</div><div><h2 className="text-lg font-bold">{name}</h2><p className="mt-1 text-[10px]">2 anos e 8 meses</p><p className="text-[10px] text-muted-foreground">{new Date(birth+"T00:00:00").toLocaleDateString("pt-BR")}</p></div></div></section>
 <section className="mt-3 rounded-2xl border border-[#eadcf9] bg-white p-4"><h2 className="text-[12px] font-bold text-[#302553]">Informações</h2><div className="mt-2 divide-y divide-border"><Info icon={<Weight/>} label="Peso" value="14,2 kg"/><Info icon={<Ruler/>} label="Altura" value="92 cm"/><Info icon={<Shirt/>} label="Tamanho da roupa" value="2 anos"/><Info icon={<Baby/>} label="Tamanho do sapato" value="24"/></div></section>
 <section className="mt-3 rounded-2xl border border-[#eadcf9] bg-white p-4"><div className="flex items-center gap-2"><CalendarDays className="size-4 text-primary"/><h2 className="text-[12px] font-bold">Datas importantes</h2></div><div className="mt-2 divide-y divide-border"><DateRow label="Próxima consulta" value="20/05/2024"/><DateRow label="Vacina" value="15/06/2024"/><DateRow label="Aniversário" value="12/09/2024"/></div></section>
 </AppShell>;
}
function Info({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex items-center gap-3 py-3"><span className="text-primary">{icon}</span><span className="flex-1 text-[10px] font-medium">{label}</span><span className="text-[10px] font-semibold">{value}</span></div>}
function DateRow({label,value}:{label:string;value:string}){return <div className="flex items-center justify-between py-3 text-[10px]"><span>{label}</span><span className="font-semibold">{value}</span></div>}
