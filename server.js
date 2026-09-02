const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/products - lista a vitrine virtual
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id').all();
  res.json(products);
});

// GET /api/products/:id - detalhe de um produto
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// POST /api/orders - cria um pedido (fluxo de pedidos + pagamento)
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, delivery_address, payment_method, items } = req.body;

  if (!customer_name || !customer_email || !delivery_address || !payment_method) {
    return res.status(400).json({ error: 'Dados do cliente incompletos.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'O carrinho está vazio.' });
  }

  const productIds = items.map((i) => i.product_id);
  const placeholders = productIds.map(() => '?').join(',');
  const dbProducts = db
    .prepare(`SELECT * FROM products WHERE id IN (${placeholders})`)
    .all(...productIds);

  if (dbProducts.length !== items.length) {
    return res.status(400).json({ error: 'Um ou mais produtos do carrinho não existem mais.' });
  }

  let total = 0;
  const resolvedItems = items.map((item) => {
    const product = dbProducts.find((p) => p.id === item.product_id);
    if (item.quantity > product.stock) {
      throw new Error(`Estoque insuficiente para ${product.name}`);
    }
    total += product.price * item.quantity;
    return {
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity
    };
  });

  const createOrder = db.transaction(() => {
    const insertOrder = db.prepare(`
      INSERT INTO orders (customer_name, customer_email, delivery_address, payment_method, total)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = insertOrder.run(
      customer_name,
      customer_email,
      delivery_address,
      payment_method,
      total
    );
    const orderId = info.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);
    const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of resolvedItems) {
      insertItem.run(orderId, item.product_id, item.product_name, item.unit_price, item.quantity);
      decrementStock.run(item.quantity, item.product_id);
    }

    return orderId;
  });

  try {
    const orderId = createOrder();
    res.status(201).json({ order_id: orderId, total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/:id - confirmação do pedido
app.get('/api/orders/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(req.params.id);
  res.json({ ...order, items });
});

app.listen(PORT, () => {
  console.log(`Cupcake Shop rodando em http://localhost:${PORT}`);
});
