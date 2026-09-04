const CART_KEY = 'cupcake_cart';

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
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

  // Opção A: Abre a gaveta lateral automaticamente ao adicionar!
  if (typeof openCartDrawer === 'function') {
    openCartDrawer();
  }
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

/* ========================================================
   Gerenciamento do Carrinho Lateral (Slide-over Drawer)
   ======================================================== */

function renderDrawerPhoto(photoOrEmoji, name) {
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji || '🧁';
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (!drawer || !overlay) return;

  renderCartDrawer();
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.classList.add('drawer-open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (!drawer || !overlay) return;

  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.classList.remove('drawer-open');
}

function renderCartDrawer() {
  const listEl = document.getElementById('cartDrawerList');
  const footerEl = document.getElementById('cartDrawerFooter');
  const countEl = document.getElementById('cartDrawerCount');
  if (!listEl || !footerEl) return;

  const cart = getCart();
  const count = cartCount();
  const total = cartTotal();

  if (countEl) {
    countEl.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
  }

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="drawer-empty">
        <div class="drawer-empty-icon">🧁</div>
        <p style="font-weight: 700; color: var(--ink); margin: 0;">Seu carrinho está vazio</p>
        <p style="font-size: 0.88rem; color: var(--ink-soft); margin-top: 6px;">Escolha seus sabores favoritos na vitrine!</p>
      </div>
    `;
    footerEl.innerHTML = `
      <button class="drawer-checkout-btn" style="opacity: 0.5; cursor: not-allowed;" disabled>
        Carrinho vazio
      </button>
    `;
    return;
  }

  listEl.innerHTML = cart
    .map(
      (item) => `
      <div class="drawer-item">
        <a href="produto.html?id=${item.product_id}" class="drawer-item-thumb-link" aria-label="Ver detalhes de ${item.name}">
          <div class="drawer-item-thumb">
            ${renderDrawerPhoto(item.emoji, item.name)}
          </div>
        </a>
        <div class="drawer-item-info">
          <a href="produto.html?id=${item.product_id}" class="drawer-item-title-link">
            <h4>${item.name}</h4>
          </a>
          <div class="drawer-item-price">${formatBRL(item.price)}</div>
          <button class="drawer-item-remove" data-drawer-remove="${item.product_id}">remover</button>
        </div>
        <div class="drawer-qty-control">
          <button data-drawer-dec="${item.product_id}" aria-label="Diminuir quantidade">−</button>
          <span>${item.quantity}</span>
          <button data-drawer-inc="${item.product_id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
    `
    )
    .join('');

  footerEl.innerHTML = `
    <div class="drawer-summary-row">
      <span>Subtotal</span>
      <span>${formatBRL(total)}</span>
    </div>
    <div class="drawer-summary-row">
      <span>Entrega</span>
      <span style="color: #2E7D32; font-weight: 700;">Grátis</span>
    </div>
    <div class="drawer-summary-row total">
      <span>Total</span>
      <span>${formatBRL(total)}</span>
    </div>
    <a href="checkout.html" class="drawer-checkout-btn">
      <span>Finalizar Pedido</span>
      <span>→</span>
    </a>
  `;

  // Vincula clique para fechar a gaveta caso o usuário já esteja na página daquele cupcake
  listEl.querySelectorAll('.drawer-item-thumb-link, .drawer-item-title-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const url = new URL(link.href, window.location.origin);
      const targetId = url.searchParams.get('id');
      const currentParams = new URLSearchParams(window.location.search);
      const currentId = currentParams.get('id');
      if (window.location.pathname.includes('produto.html') && targetId === currentId) {
        e.preventDefault();
        closeCartDrawer();
      }
    });
  });

  // Vincula eventos dos botões internos do Drawer
  listEl.querySelectorAll('[data-drawer-inc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateQuantity(Number(btn.dataset.drawerInc), 1);
    });
  });

  listEl.querySelectorAll('[data-drawer-dec]').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateQuantity(Number(btn.dataset.drawerDec), -1);
    });
  });

  listEl.querySelectorAll('[data-drawer-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(Number(btn.dataset.drawerRemove));
    });
  });
}

function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  const closeBtn = document.getElementById('cartDrawerClose');
  if (!drawer) return;

  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // Fecha com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartDrawer();
  });

  // Intercepta os cliques nos botões de carrinho da vitrine para abrir o Drawer
  document.querySelectorAll('.cart-link, #floatingCart').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  renderCartDrawer();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initFloatingCart();
  initCartDrawer();
});

