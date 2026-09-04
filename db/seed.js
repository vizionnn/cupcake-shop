const db = require('./database');

const products = [
  {
    name: 'Ninho com Nutella',
    description: 'Massa de leite ninho, recheio cremoso de nutella e cobertura de brigadeiro branco.',
    price: 12.9,
    flavor_tag: 'Clássico',
    image_emoji: 'images/NinhoNutella.jpg', // <- Caminho da foto em vez do emoji
    stock: 30
  },
  {
    name: 'Red Velvet',
    description: 'Massa aveludada vermelha com cream cheese frosting.',
    price: 14.5,
    flavor_tag: 'Sofisticado',
    image_emoji: 'images/RedVelvet.jpg',
    stock: 25
  },
  {
    name: 'Limão Siciliano',
    description: 'Massa cítrica com curd de limão e merengue maçaricado.',
    price: 13.9,
    flavor_tag: 'Refrescante',
    image_emoji: 'images/LimãoSiciliano.jpg',
    stock: 20
  },
  {
    name: 'Brigadeiro Gourmet',
    description: 'Clássico brasileiro com granulado belga e recheio generoso.',
    price: 11.9,
    flavor_tag: 'Clássico',
    image_emoji: 'images/BrigadeiroGourmet.jpg',
    stock: 40
  },
  {
    name: 'Morango com Chantininho',
    description: 'Massa branca, recheio de morango fresco e chantininho estabilizado.',
    price: 13.5,
    flavor_tag: 'Frutado',
    image_emoji: 'images/MorangoChantininho.jpg',
    stock: 22
  },
  {
    name: 'Chocolate Belga com Creme de Avelã',
    description: 'Massa intensa de cacau, recheio trufado de avelã e ganache de chocolate belga.',
    price: 15.9,
    flavor_tag: 'Premium',
    image_emoji: 'images/ChocolateBelga.jpg',
    stock: 25
  },
  {
    name: 'Pistache',
    description: 'Massa amanteigada com creme de pistache importado e lascas crocantes.',
    price: 16.9,
    flavor_tag: 'Premium',
    image_emoji: 'images/Pistache.jpg',
    stock: 15
  },
  {
    name: 'Caramelo Salgado',
    description: 'Massa de baunilha Bourbon, recheio de caramelo toffee artesanal e toque de flor de sal.',
    price: 14.9,
    flavor_tag: 'Sofisticado',
    image_emoji: 'images/CarameloSalgado.jpg',
    stock: 20
  }
];

const insert = db.prepare(`
  INSERT INTO products (name, description, price, flavor_tag, image_emoji, stock)
  VALUES (@name, @description, @price, @flavor_tag, @image_emoji, @stock)
`);

const clearAndSeed = db.transaction((items) => {
  db.exec('DELETE FROM products');
  for (const item of items) insert.run(item);
});

clearAndSeed(products);

console.log(`Seed concluído: ${products.length} produtos inseridos.`);
