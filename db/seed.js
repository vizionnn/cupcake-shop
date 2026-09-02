const db = require('./database');

const products = [
  {
    name: 'Ninho com Nutella',
    description: 'Massa de leite ninho, recheio cremoso de nutella e cobertura de brigadeiro branco.',
    price: 12.9,
    flavor_tag: 'Clássico',
    image_emoji: '🧁',
    stock: 30
  },
  {
    name: 'Red Velvet',
    description: 'Massa aveludada vermelha com cream cheese frosting.',
    price: 14.5,
    flavor_tag: 'Sofisticado',
    image_emoji: '🍰',
    stock: 25
  },
  {
    name: 'Limão Siciliano',
    description: 'Massa cítrica com curd de limão e merengue maçaricado.',
    price: 13.9,
    flavor_tag: 'Refrescante',
    image_emoji: '🍋',
    stock: 20
  },
  {
    name: 'Brigadeiro Gourmet',
    description: 'Clássico brasileiro com granulado belga e recheio generoso.',
    price: 11.9,
    flavor_tag: 'Clássico',
    image_emoji: '🍫',
    stock: 40
  },
  {
    name: 'Morango com Chantininho',
    description: 'Massa branca, recheio de morango fresco e chantininho estabilizado.',
    price: 13.5,
    flavor_tag: 'Frutado',
    image_emoji: '🍓',
    stock: 22
  },
  {
    name: 'Pistache',
    description: 'Massa amanteigada com creme de pistache importado e lascas crocantes.',
    price: 16.9,
    flavor_tag: 'Premium',
    image_emoji: '🌰',
    stock: 15
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
