import { Product } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ninho com Nutella",
    description: "Massa de leite ninho, recheio cremoso de nutella e cobertura de brigadeiro branco.",
    price: 12.9,
    flavor_tag: "Clássico",
    image_emoji: "/images/NinhoNutella.jpg",
    stock: 30,
    ingredients: "Leite Ninho integral, Nutella original, leite condensado Moça, manteiga extra sem sal, farinha de trigo especial, ovos selecionados e cacau.",
    details: "O queridinho absoluto da casa. Nossa massa aerada e fofinha é feita com autêntico Leite Ninho, recheada até o topo com pura Nutella italiana cremosa e coberta por uma generosa camada de brigadeiro branco gourmet aveludado."
  },
  {
    id: 2,
    name: "Red Velvet",
    description: "Massa aveludada vermelha com cream cheese frosting.",
    price: 14.5,
    flavor_tag: "Sofisticado",
    image_emoji: "/images/RedVelvet.jpg",
    stock: 25,
    ingredients: "Cacau alcalino suave, cream cheese Philadelphia, extrato natural de baunilha Bourbon, buttermilk artesanal, ovos caipiras e manteiga extra.",
    details: "A clássica receita nova-iorquina com textura aveludada inconfundível e coloração vermelho-rubi. O topo leva o tradicional cream cheese frosting, que traz o contraste sublime entre a leve acidez do queijo e o toque doce da baunilha."
  },
  {
    id: 3,
    name: "Limão Siciliano",
    description: "Massa cítrica com curd de limão e merengue maçaricado.",
    price: 13.9,
    flavor_tag: "Refrescante",
    image_emoji: "/images/LimãoSiciliano.jpg",
    stock: 20,
    ingredients: "Suco e raspas de limão siciliano fresco, ovos, manteiga sem sal, açúcar de confeiteiro, farinha de trigo enriquecida e claras pasteurizadas.",
    details: "Uma explosão fresca e perfumada. Massa amanteigada enriquecida com raspas frescas de limões sicilianos selecionados, recheada com um curd cremoso artesanal e coroada com merengue suíço sedoso, delicadamente dourado no maçarico."
  },
  {
    id: 4,
    name: "Brigadeiro Gourmet",
    description: "Clássico brasileiro com granulado belga e recheio generoso.",
    price: 11.9,
    flavor_tag: "Clássico",
    image_emoji: "/images/BrigadeiroGourmet.jpg",
    stock: 40,
    ingredients: "Chocolate belga 54%, cacau em pó 100% holandês, leite condensado premium, creme de leite fresco e confeitos split Callebaut.",
    details: "Para quem não abre mão da tradição com requinte. Massa intensa de cacau nobre, recheada com brigadeiro de panela no ponto cremoso de colher e finalizada com autênticos splits de chocolate belga que derretem suavemente na boca."
  },
  {
    id: 5,
    name: "Morango com Chantininho",
    description: "Massa branca, recheio de morango fresco e chantininho estabilizado.",
    price: 13.5,
    flavor_tag: "Frutado",
    image_emoji: "/images/MorangocomChantininho.jpg",
    stock: 22,
    ingredients: "Morangos frescos selecionados, leite condensado, leite em pó integral, creme de leite fresco, baunilha e farinha de trigo especial.",
    details: "Massa branca amanteigada super macia, recheada com compota artesanal de morangos frescos cozidos com um toque de limão, coberta por um suave chantininho estabilizado que une a leveza do chantilly ao sabor marcante do leite em pó."
  },
  {
    id: 6,
    name: "Chocolate Belga com Creme de Avelã",
    description: "Massa intensa de cacau, recheio trufado de avelã e ganache de chocolate belga.",
    price: 15.9,
    flavor_tag: "Premium",
    image_emoji: "/images/ChocolateBelgacomCremedeAvelã.jpg",
    stock: 25,
    ingredients: "Cacau holandês 100%, avelãs tostadas inteiras, pasta pura de avelã, chocolate amargo belga 70%, manteiga de cacau e creme fresco.",
    details: "Nossa criação mais intensa e indulgente. Massa feita com cacau puro 70%, coração trufado com avelãs nobres tostadas artesanalmente e cobertura de ganache acetinada de chocolate belga, decorada com avelã caramelizada."
  },
  {
    id: 7,
    name: "Pistache",
    description: "Massa amanteigada com creme de pistache importado e lascas crocantes.",
    price: 16.9,
    flavor_tag: "Premium",
    image_emoji: "/images/Pistache.jpg",
    stock: 15,
    ingredients: "Pistache siciliano puro importado, chocolate branco nobre, leite condensado, manteiga extra, ovos caipiras e flor de sal.",
    details: "Puro requinte gastronômico. Massa aromática amanteigada com toque de pistache moído na hora, recheada com brigadeiro aveludado de pistache italiano e coberta por lascas crocantes tostadas que adicionam textura inigualável."
  },
  {
    id: 8,
    name: "Caramelo Salgado",
    description: "Massa de baunilha Bourbon, recheio de caramelo toffee artesanal e toque de flor de sal.",
    price: 14.9,
    flavor_tag: "Sofisticado",
    image_emoji: "/images/CarameloSalgado.jpg",
    stock: 20,
    ingredients: "Caramelo toffee artesanal, flor de sal de Guérande, extrato puro de baunilha Bourbon, açúcar mascavo, manteiga e creme de leite fresco.",
    details: "O equilíbrio perfeito entre o dulçor profundo do caramelo cozido lentamente na panela e o toque mineral crocante da flor de sal francesa. A massa é enriquecida com favas de baunilha e a cobertura leva um swirl dourado irresistível."
  }
];

export function getProductById(id: number): Product | undefined {
  return INITIAL_PRODUCTS.find((p) => p.id === id);
}

export function getRecommendedProducts(currentId: number, limit = 4): Product[] {
  return INITIAL_PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
