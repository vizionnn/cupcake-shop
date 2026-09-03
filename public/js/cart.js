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
  triggerCartBump();
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
  const badges = document.querySelectorAll('[data-cart-badge]');
  badges.forEach((b) => {
    b.textContent = cartCount();
  });
}

function triggerCartBump() {
  const targets = document.querySelectorAll('.cart-link, .floating-cart, .cart-badge');
  targets.forEach((el) => {
    el.classList.remove('cart-bump');
    void el.offsetWidth; // Força reflow para reiniciar animação
    el.classList.add('cart-bump');
  });
}

function initFloatingCart() {
  const header = document.querySelector('.site-header');
  const floatingCart = document.querySelector('.floating-cart');
  if (!header || !floatingCart) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se o header saiu da tela (rolagem para baixo), exibe o carrinho flutuante
        if (!entry.isIntersecting) {
          floatingCart.classList.add('visible');
        } else {
          // Se o header voltou para a tela (rolagem para cima), recolhe o carrinho
          floatingCart.classList.remove('visible');
        }
      },
      {
        root: null,
        threshold: 0
      }
    );
    observer.observe(header);
  } else {
    window.addEventListener(
      'scroll',
      () => {
        const threshold = header.offsetHeight || 80;
        if (window.scrollY > threshold) {
          floatingCart.classList.add('visible');
        } else {
          floatingCart.classList.remove('visible');
        }
      },
      { passive: true }
    );
  }
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initFloatingCart();
});
