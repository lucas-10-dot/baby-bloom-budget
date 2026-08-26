export type StoreSearch = {
  name: string;
  description: string;
  buildUrl: (query: string) => string;
};

const encode = (query: string) => encodeURIComponent(query.trim());

export const storeSearches: StoreSearch[] = [
  {
    name: "Mercado Livre",
    description: "Pesquisar o produto e comparar vendedores",
    buildUrl: (query) => `https://lista.mercadolivre.com.br/${encode(query)}`,
  },
  {
    name: "Amazon Brasil",
    description: "Pesquisar preços e opções de entrega",
    buildUrl: (query) => `https://www.amazon.com.br/s?k=${encode(query)}`,
  },
  {
    name: "Magalu",
    description: "Pesquisar ofertas na loja",
    buildUrl: (query) => `https://www.magazineluiza.com.br/busca/${encode(query)}/`,
  },
  {
    name: "Google Shopping",
    description: "Ampliar a comparação entre lojas",
    buildUrl: (query) => `https://www.google.com/search?tbm=shop&q=${encode(query)}`,
  },
];

export function normalizeProductQuery(value: string) {
  return value.trim().replace(/\s+/g, " ");
}
