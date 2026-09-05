import { DeliveryEstimate } from "@/types";

export function getDeliveryEstimateByCep(rawCep: string): DeliveryEstimate {
  const cleanCep = rawCep.replace(/\D/g, "");
  const num = parseInt(cleanCep.substring(0, 5), 10);

  // Recife e Região Metropolitana de Recife (50000 a 54999)
  if (num >= 50000 && num <= 54999) {
    return {
      title: "Entrega Expressa no Mesmo Dia",
      desc: "Previsão: Hoje em até 3 horas",
      badge: "Sede Recife & RMR 🚀",
      icon: "🚀",
      text: "Hoje mesmo (em até 3 horas) — Sede Recife/PE",
    };
  }
  // Demais cidades de Pernambuco (55000 a 56999)
  if (num >= 55000 && num <= 56999) {
    return {
      title: "Entrega Regional Rápida",
      desc: "Previsão: 1 a 2 dias úteis",
      badge: "Interior de Pernambuco 📦",
      icon: "📦",
      text: "1 a 2 dias úteis — Interior de Pernambuco",
    };
  }
  // Demais estados do Nordeste (40000 a 49999 e 57000 a 65999)
  if ((num >= 40000 && num <= 49999) || (num >= 57000 && num <= 65999)) {
    return {
      title: "Envio Expresso Nordeste",
      desc: "Previsão: 1 a 2 dias úteis",
      badge: "Região Nordeste 📦",
      icon: "📦",
      text: "1 a 2 dias úteis — Região Nordeste",
    };
  }
  // Sudeste (01000 a 39999)
  if (num >= 1000 && num <= 39999) {
    return {
      title: "Envio Especial Aéreo",
      desc: "Previsão: 2 a 4 dias úteis",
      badge: "Região Sudeste 🚚",
      icon: "🚚",
      text: "2 a 4 dias úteis — Região Sudeste",
    };
  }
  // Centro-Oeste / DF (70000 a 78999) e Sul (80000 a 99999)
  if ((num >= 70000 && num <= 78999) || (num >= 80000 && num <= 99999)) {
    return {
      title: "Envio Seguro Climatizado",
      desc: "Previsão: 3 a 5 dias úteis",
      badge: "Centro-Oeste e Sul 🚚",
      icon: "🚚",
      text: "3 a 5 dias úteis — Centro-Oeste e Sul",
    };
  }
  // Demais regiões / Norte (66000 a 69999)
  return {
    title: "Envio Nacional Padrão",
    desc: "Previsão: 4 a 6 dias úteis",
    badge: "Região Norte / Demais Regiões ✈️",
    icon: "✈️",
    text: "4 a 6 dias úteis — Envio Nacional",
  };
}
