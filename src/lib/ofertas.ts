export type StoreId = "mercado_livre" | "shopee" | "magalu" | "amazon" | "google_shopping";

export type StoreSearch = {
  id: StoreId;
  name: string;
  description: string;
  buildUrl: (query: string) => string;
  integrationStatus: "pesquisa" | "api";
};

export type Offer = {
  storeId: StoreId;
  storeName: string;
  title: string;
  price: number;
  url: string;
  imageUrl?: string;
  shipping?: number;
  quantity?: number;
  unitLabel?: string;
};

const encode = (query: string) => encodeURIComponent(query.trim());

export const storeSearches: StoreSearch[] = [
  {
    id: "mercado_livre",
    name: "Mercado Livre",
    description: "Pesquisar o produto e comparar vendedores",
    buildUrl: (query) => `https://lista.mercadolivre.com.br/${encode(query)}`,
    integrationStatus: "api",
  },
  {
    id: "shopee",
    name: "Shopee",
    description: "Pesquisar ofertas e opções de vendedores",
    buildUrl: (query) => `https://shopee.com.br/search?keyword=${encode(query)}`,
    integrationStatus: "pesquisa",
  },
  {
    id: "magalu",
    name: "Magalu",
    description: "Pesquisar ofertas na loja",
    buildUrl: (query) => `https://www.magazineluiza.com.br/busca/${encode(query)}/`,
    integrationStatus: "pesquisa",
  },
  {
    id: "amazon",
    name: "Amazon Brasil",
    description: "Pesquisar preços e opções de entrega",
    buildUrl: (query) => `https://www.amazon.com.br/s?k=${encode(query)}`,
    integrationStatus: "pesquisa",
  },
  {
    id: "google_shopping",
    name: "Google Shopping",
    description: "Ampliar a comparação entre lojas",
    buildUrl: (query) => `https://www.google.com/search?tbm=shop&q=${encode(query)}`,
    integrationStatus: "pesquisa",
  },
];

export function normalizeProductQuery(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function rankOffers(offers: Offer[]) {
  return [...offers].sort((a, b) => {
    const totalA = a.price + (a.shipping ?? 0);
    const totalB = b.price + (b.shipping ?? 0);
    return totalA - totalB;
  });
}

export function calculateUnitPrice(offer: Offer) {
  if (!offer.quantity || offer.quantity <= 0) return offer.price;
  return offer.price / offer.quantity;
}
