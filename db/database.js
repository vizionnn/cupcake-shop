const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'cupcake_shop.sqlite'));

db.pragma('journal_mode = WAL');

// Tabela de produtos (vitrine virtual)
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    flavor_tag TEXT NOT NULL,
    image_emoji TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 20
  )
`);

// Tabela de pedidos
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmado',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Itens de cada pedido
db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name TEXT NOT NULL,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL
  )
`);

module.exports = db;
