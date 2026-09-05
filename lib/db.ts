import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "db", "cupcake_shop.sqlite");

const globalForDb = globalThis as unknown as {
  db: Database.Database | undefined;
};

export const db =
  globalForDb.db ??
  new Database(dbPath, {
    fileMustExist: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

db.pragma("journal_mode = WAL");

// Assegura existencia das tabelas e colunas
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    flavor_tag TEXT NOT NULL,
    image_emoji TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 20,
    ingredients TEXT,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    customer_cep TEXT,
    estimated_delivery TEXT,
    payment_method TEXT NOT NULL,
    subtotal REAL NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0,
    shipping_fee REAL NOT NULL DEFAULT 0,
    coupon_code TEXT,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

try { db.exec("ALTER TABLE products ADD COLUMN ingredients TEXT"); } catch (_) {}
try { db.exec("ALTER TABLE products ADD COLUMN details TEXT"); } catch (_) {}
try { db.exec("ALTER TABLE orders ADD COLUMN customer_cep TEXT"); } catch (_) {}
try { db.exec("ALTER TABLE orders ADD COLUMN estimated_delivery TEXT"); } catch (_) {}

export default db;
