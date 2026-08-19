# Ninho Financeiro

Crie um aplicativo web responsivo, moderno e profissional chamado Ninho Financeiro, voltado para pais e futuros pais que querem organizar melhor o dinheiro durante a gravidez e nos primeiros anos do filho.

OBJETIVO PRINCIPAL

O aplicativo deve ajudar os pais a:

Planejar financeiramente a chegada do bebê.

Controlar quanto estão gastando.

Montar o enxoval sem comprar coisas desnecessárias.

Definir prioridades.

Criar metas financeiras.

Acompanhar gastos antes e depois do nascimento.

Tomar decisões mais conscientes antes de realizar uma compra.

O aplicativo NÃO deve parecer uma planilha financeira tradicional. Deve transmitir sensação de organização, tranquilidade, segurança e simplicidade.

IDENTIDADE VISUAL

Crie uma interface elegante, acolhedora e moderna.

Use:

Fundo claro.

Cards com cantos arredondados.

Bastante espaço entre os elementos.

Ícones simples e modernos.

Tipografia grande e fácil de ler.

Visual premium, mas amigável.

Cores suaves relacionadas a família, organização e dinheiro.

Evite aparência infantil exagerada.

O aplicativo deve funcionar perfeitamente em celular, tablet e computador.

TELA 1 — DASHBOARD

Criar uma página inicial chamada Minha Família.

No topo:

"Olá! Vamos cuidar melhor do dinheiro da sua família."

Mostrar um resumo financeiro:

Saldo disponível
R$ 3.850

Meta para o bebê
R$ 5.000

Já reservado
R$ 2.300

Falta
R$ 2.700

Criar um gráfico simples mostrando a evolução da reserva.

Criar também um card:

Próximos passos

Exemplo:

🟢 Reservar R$ 300 este mês
🟡 Comprar itens essenciais do enxoval
🔵 Revisar gastos deste mês

Adicionar botão:

+ Registrar gasto

Adicionar botão:

Planejar compra

TELA 2 — PLANEJAMENTO DO BEBÊ

Criar uma área chamada:

Planejamento da chegada

Primeiro perguntar:

"Quando seu bebê deve nascer?"

Campo para data prevista do parto.

Depois perguntar:

"Quanto você consegue guardar por mês?"

Campo de valor.

"Quanto você já tem reservado para o bebê?"

Campo de valor.

"Qual é o orçamento que pretende gastar com o enxoval?"

Campo de valor.

Depois calcular automaticamente:

Meses restantes.

Valor que precisa guardar por mês.

Valor disponível atualmente.

Diferença para atingir a meta.

Mostrar isso visualmente em cards.

Exemplo:

Meta: R$ 5.000
Reservado: R$ 2.300
Falta: R$ 2.700
Tempo restante: 5 meses
Necessário guardar: R$ 540/mês

TELA 3 — ENXOVAL INTELIGENTE

Criar uma ferramenta chamada:

Enxoval Inteligente

Dividir os produtos em:

🟢 Essencial
🟡 Importante
⚪ Pode esperar

Categorias:

Quarto

Roupas

Higiene

Alimentação

Transporte

Segurança

Banho

Outros

Cada item deve possuir:

Nome

Categoria

Prioridade

Quantidade

Preço estimado

Preço pago

Status: não comprado / comprado

Observação

Mostrar no topo:

Orçamento do enxoval

R$ 3.000

Já planejado

R$ 2.450

Restante

R$ 550

Calcular tudo automaticamente.

Permitir adicionar novos itens.

TELA 4 — "DEVO COMPRAR?"

Essa deve ser uma das principais funções do aplicativo.

Criar uma tela chamada:

Antes de comprar

Texto:

"Antes de gastar, veja como essa compra afeta seu orçamento."

Campos:

Nome do produto:
[________________]

Preço:
[R$ ______]

Categoria:
[Selecionar]

Prioridade:
[Essencial / Importante / Pode esperar]

Depois do preenchimento, mostrar uma análise visual.

Exemplo:

Resultado

🟢 COMPRA DENTRO DO ORÇAMENTO

ou

🟡 PENSE MELHOR ANTES DE COMPRAR

ou

🔴 ESSA COMPRA PODE COMPROMETER SUA META

Mostrar também:

"Essa compra representa 12% do seu orçamento disponível."

"Depois dessa compra, você terá R$ 1.850 disponíveis."

"Você ainda precisa reservar R$ 540 por mês para atingir sua meta."

IMPORTANTE:

Essa função deve ser apresentada como uma ferramenta de organização financeira, não como aconselhamento financeiro profissional.

TELA 5 — GASTOS

Criar uma página:

Meus gastos

Permitir registrar:

Valor

Data

Descrição

Categoria

Observação

Categorias:

🍼 Alimentação
👕 Roupas
🧴 Higiene
🏥 Saúde
🧸 Brinquedos
🏠 Quarto
🚗 Transporte
📚 Educação
🛒 Outros

Mostrar:

Gastos deste mês

R$ 780

Criar gráfico mostrando quanto foi gasto em cada categoria.

Mostrar também comparação:

Este mês: R$ 780
Mês anterior: R$ 620

"Você gastou R$ 160 a mais que no mês anterior."

TELA 6 — METAS

Criar uma página chamada:

Minhas metas

Permitir criar metas personalizadas.

Exemplos:

Reserva para o bebê

Enxoval

Maternidade

Creche

Emergência

Primeiro aniversário

Cada meta deve mostrar:

Valor da meta
Valor acumulado
Valor restante
Percentual concluído
Prazo

Criar uma barra de progresso visual.

NAVEGAÇÃO

No celular, utilizar uma barra de navegação inferior:

🏠 Início
📊 Gastos
🛒 Enxoval
🎯 Metas
☰ Mais

No desktop, utilizar menu lateral.

EXPERIÊNCIA DO USUÁRIO

O aplicativo deve ser extremamente simples para pessoas que não entendem de finanças.

Não utilizar termos financeiros complicados.

Sempre explicar os números de maneira simples.

Exemplo:

Em vez de mostrar apenas:

"Taxa de comprometimento: 32%"

mostrar:

"Você está usando aproximadamente 32% do dinheiro disponível."

Sempre priorizar informação visual.

DADOS

Estruture o aplicativo para armazenar os dados do usuário de maneira organizada.

Criar entidades/tabelas para:

Users
BabyProfile
FinancialProfile
Goals
Expenses
LayettItems
PurchaseAnalysis

Cada usuário deve acessar somente seus próprios dados.

Preparar a arquitetura para autenticação de usuários.

REGRAS IMPORTANTES

Os cálculos financeiros devem ser feitos automaticamente.

Quando um gasto for registrado:

Atualizar os gastos do mês.

Atualizar o orçamento disponível.

Atualizar os gráficos.

Atualizar as metas quando aplicável.

Quando um item do enxoval for comprado:

Tirar o valor do orçamento planejado.

Atualizar o total comprado.

Atualizar o valor restante.

Não criar dados falsos permanentes. Utilize dados de exemplo apenas para apresentar a interface inicialmente e deixe claro que são exemplos.

Criar estados vazios elegantes quando o usuário ainda não tiver dados.

Exemplo:

"Você ainda não registrou nenhum gasto."

Botão:

"+ Registrar primeiro gasto"

RESPONSIVIDADE

Prioridade máxima para celular.

A experiência mobile deve parecer um aplicativo nativo.

Os botões devem ser grandes e fáceis de tocar.

Evitar tabelas largas no celular.

Utilizar cards e listas responsivas.

IMPORTANTE SOBRE A IMPLEMENTAÇÃO

Construa o projeto com código organizado e componentes reutilizáveis.

Não coloque toda a aplicação em um único arquivo.

Separe componentes, páginas, serviços e lógica de cálculo.

Prepare o projeto para futura integração com banco de dados e APIs.

Não implemente pagamentos, notificações, inteligência artificial ou integração bancária nesta primeira versão.

Primeiro construa um MVP funcional, bonito e estável com as funcionalidades descritas acima.

Ao finalizar, verifique todos os fluxos principais:

Criar planejamento.

Criar meta.

Adicionar gasto.

Adicionar item do enxoval.

Marcar item como comprado.

Fazer uma análise em "Antes de comprar".

Conferir se todos os valores e gráficos são atualizados corretamente.

O resultado deve parecer um produto comercial real, e não apenas um protótipo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e1f4461a-0d45-4d50-94fe-d050ebf63488).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
