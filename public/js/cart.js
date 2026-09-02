const CART_KEY = 'cupcake_cart';

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((i) => i.product_id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.image_emoji,
      quantity: 1
    });
  }
  saveCart(cart);
}

function updateQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.product_id === productId);
  if (!item) return;
  item.quantity += delta;
  const filtered = item.quantity <= 0
    ? cart.filter((i) => i.product_id !== productId)
    : cart;
  saveCart(filtered);
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.product_id !== productId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function cartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('[data-cart-badge]');
  if (badge) badge.textContent = cartCount();
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
