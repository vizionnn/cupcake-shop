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

function showToast({ title, message, photoOrEmoji, actionText, actionCallback, duration = 3000 }) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';

  let thumbHtml = '🧁';
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    thumbHtml = `<img src="${photoOrEmoji}" alt="" loading="lazy">`;
  } else if (photoOrEmoji) {
    thumbHtml = photoOrEmoji;
  }

  toast.innerHTML = `
    <div class="toast-thumb">${thumbHtml}</div>
    <div class="toast-body">
      <div class="toast-title">
        <span>${title || 'Item adicionado!'}</span>
      </div>
      <p class="toast-text">${message || ''}</p>
    </div>
    ${actionText ? `<button type="button" class="toast-action">${actionText}</button>` : ''}
    <button type="button" class="toast-close" aria-label="Fechar notificação">✕</button>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  const removeToast = () => {
    if (toast.classList.contains('toast-hiding')) return;
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, 420);
  };

  if (actionText && actionCallback) {
    const actionBtn = toast.querySelector('.toast-action');
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        actionCallback();
        removeToast();
      });
    }
  }

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) closeBtn.addEventListener('click', removeToast);

  container.appendChild(toast);

  let timeoutId = setTimeout(removeToast, duration);
  toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));
  toast.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(removeToast, 1200);
  });
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const qtyToAdd = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
  const existing = cart.find((i) => i.product_id === product.id);
  if (existing) {
    existing.quantity += qtyToAdd;
  } else {
    cart.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.image_emoji,
      quantity: qtyToAdd
    });
  }
  saveCart(cart);
  triggerCartBump();

  // Toast elegante com miniatura, esmaecimento em 3s e botão opcional para abrir a sacola
  showToast({
    title: 'Adicionado à sua sacola! 🧁',
    message: `${qtyToAdd > 1 ? `${qtyToAdd}x ` : ''}${product.name}`,
    photoOrEmoji: product.image_emoji,
    actionText: 'Ver sacola',
    actionCallback: () => {
      if (typeof openCartDrawer === 'function') openCartDrawer();
    },
    duration: 3000
  });
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

function getDeliveryEstimateByCep(cleanCep) {
  const num = parseInt(cleanCep.substring(0, 5), 10);

  // Recife e Região Metropolitana de Recife (50000 a 54999)
  if (num >= 50000 && num <= 54999) {
    return {
      title: 'Entrega Expressa no Mesmo Dia',
      desc: 'Previsão: Hoje em até 3 horas',
      badge: 'Sede Recife & RMR 🚀',
      icon: '🚀',
      text: 'Hoje (em até 3 horas)'
    };
  }
  // Demais cidades de Pernambuco (55000 a 56999)
  if (num >= 55000 && num <= 56999) {
    return {
      title: 'Entrega Regional Rápida',
      desc: 'Previsão: 1 a 2 dias úteis',
      badge: 'Interior de Pernambuco 📦',
      icon: '📦',
      text: '1 a 2 dias úteis'
    };
  }
  // Demais estados do Nordeste (40000 a 49999 e 57000 a 65999)
  if ((num >= 40000 && num <= 49999) || (num >= 57000 && num <= 65999)) {
    return {
      title: 'Envio Expresso Nordeste',
      desc: 'Previsão: 1 a 2 dias úteis',
      badge: 'Região Nordeste 📦',
      icon: '📦',
      text: '1 a 2 dias úteis'
    };
  }
  // Sudeste (01000 a 39999)
  if (num >= 1000 && num <= 39999) {
    return {
      title: 'Envio Especial Aéreo',
      desc: 'Previsão: 2 a 4 dias úteis',
      badge: 'Região Sudeste 🚚',
      icon: '🚚',
      text: '2 a 4 dias úteis'
    };
  }
  // Centro-Oeste / DF (70000 a 78999) e Sul (80000 a 99999)
  if ((num >= 70000 && num <= 78999) || (num >= 80000 && num <= 99999)) {
    return {
      title: 'Envio Seguro Climatizado',
      desc: 'Previsão: 3 a 5 dias úteis',
      badge: 'Centro-Oeste e Sul 🚚',
      icon: '🚚',
      text: '3 a 5 dias úteis'
    };
  }
  // Norte (66000 a 69999)
  if (num >= 66000 && num <= 69999) {
    return {
      title: 'Envio Prioritário',
      desc: 'Previsão: 4 a 6 dias úteis',
      badge: 'Região Norte ✈️',
      icon: '✈️',
      text: '4 a 6 dias úteis'
    };
  }

  return {
    title: 'Entrega Padrão Nuvem',
    desc: 'Previsão: 2 a 4 dias úteis',
    badge: 'Nacional 🚚',
    icon: '🚚',
    text: '2 a 4 dias úteis'
  };
}

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

  const subtotal = cartTotal();
  const shipping = subtotal >= 49.90 ? 0 : 9.90;
  const grandTotal = subtotal + shipping;
  const diffForFree = 49.90 - subtotal;

  const savedCep = localStorage.getItem('cupcake_user_cep') || '';
  const savedCity = localStorage.getItem('cupcake_user_city') || '';
  let savedEstimateHtml = '';
  if (savedCep && savedCep.length === 8) {
    const est = getDeliveryEstimateByCep(savedCep);
    savedEstimateHtml = `
      <div class="drawer-cep-estimate-badge">
        <span>${est.icon} ${est.desc}${savedCity ? ` (${savedCity})` : ''}</span>
      </div>
    `;
  }
  const savedCepFormatted = savedCep.length > 5 ? savedCep.replace(/^(\d{5})(\d)/, '$1-$2') : savedCep;

  const shippingHtml = shipping === 0
    ? `<span style="color: #2E7D32; font-weight: 700;">Grátis</span>`
    : `<span>${formatBRL(shipping)}</span>`;

  const freeShippingBadge = shipping === 0
    ? `<div class="drawer-shipping-notice reached">🎉 Parabéns! Você ganhou <strong>Frete Grátis</strong>!</div>`
    : `<div class="drawer-shipping-notice">Adicione mais <strong>${formatBRL(diffForFree)}</strong> para ter <strong>Frete Grátis</strong>!</div>`;

  footerEl.innerHTML = `
    ${freeShippingBadge}

    <div class="drawer-cep-section">
      <div class="drawer-cep-header">
        <span>🚚 Calcular entrega e prazo</span>
      </div>
      <div class="drawer-cep-input-group">
        <input type="text" id="drawerCepInput" placeholder="Ex: 50010-000" maxlength="9" value="${savedCepFormatted}" autocomplete="postal-code">
        <button type="button" id="drawerCepBtn" class="btn-drawer-cep">Calcular</button>
      </div>
      <div id="drawerCepFeedback" class="drawer-cep-feedback">${savedEstimateHtml}</div>
    </div>

    <div class="drawer-summary-row">
      <span>Subtotal</span>
      <span>${formatBRL(subtotal)}</span>
    </div>
    <div class="drawer-summary-row">
      <span>Entrega ${shipping === 0 ? '' : '<small style="color:var(--ink-soft);font-size:0.75rem;">(acima de R$ 49,90 é grátis)</small>'}</span>
      ${shippingHtml}
    </div>
    <div class="drawer-summary-row total">
      <span>Total</span>
      <span>${formatBRL(grandTotal)}</span>
    </div>
    <a href="checkout.html" class="drawer-checkout-btn">
      <span>Finalizar Pedido</span>
      <span>→</span>
    </a>
  `;

  // Configuração do cálculo de CEP no Drawer
  const drawerCepInput = footerEl.querySelector('#drawerCepInput');
  const drawerCepBtn = footerEl.querySelector('#drawerCepBtn');
  const drawerCepFeedback = footerEl.querySelector('#drawerCepFeedback');

  if (drawerCepInput && drawerCepBtn) {
    const handleDrawerCepLookup = async () => {
      const rawCep = drawerCepInput.value.replace(/\D/g, '');
      if (rawCep.length !== 8) {
        drawerCepFeedback.textContent = 'Digite um CEP válido com 8 números.';
        drawerCepFeedback.className = 'drawer-cep-feedback error';
        return;
      }
      drawerCepFeedback.textContent = 'Calculando prazo...';
      drawerCepFeedback.className = 'drawer-cep-feedback';
      drawerCepBtn.disabled = true;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (data.erro) {
          drawerCepFeedback.textContent = 'CEP não encontrado.';
          drawerCepFeedback.className = 'drawer-cep-feedback error';
          return;
        }

        const est = getDeliveryEstimateByCep(rawCep);
        localStorage.setItem('cupcake_user_cep', rawCep);
        localStorage.setItem('cupcake_user_city', `${data.localidade}/${data.uf}`);
        if (data.logradouro) {
          const parts = [data.logradouro];
          if (data.bairro) parts.push(data.bairro);
          parts.push(`${data.localidade} - ${data.uf}`);
          localStorage.setItem('cupcake_user_address', parts.join(', '));
        }

        drawerCepFeedback.innerHTML = `
          <div class="drawer-cep-estimate-badge">
            <span>${est.icon} ${est.desc} (${data.localidade}/${data.uf})</span>
          </div>
        `;
        drawerCepFeedback.className = 'drawer-cep-feedback success';
      } catch (err) {
        const est = getDeliveryEstimateByCep(rawCep);
        localStorage.setItem('cupcake_user_cep', rawCep);
        drawerCepFeedback.innerHTML = `
          <div class="drawer-cep-estimate-badge">
            <span>${est.icon} ${est.desc}</span>
          </div>
        `;
        drawerCepFeedback.className = 'drawer-cep-feedback success';
      } finally {
        drawerCepBtn.disabled = false;
      }
    };

    drawerCepInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 8);
      if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = val;
      if (val.replace(/\D/g, '').length === 8) {
        handleDrawerCepLookup();
      }
    });

    drawerCepInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDrawerCepLookup();
      }
    });

    drawerCepBtn.addEventListener('click', handleDrawerCepLookup);
  }

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

function copyCouponCode(code, btnEl) {
  navigator.clipboard.writeText(code).then(() => {
    const originalContent = btnEl.innerHTML;
    btnEl.innerHTML = `<code>${code}</code> <span style="font-size:0.75rem; color:#2E7D32; font-weight:700;">Copiado! 🎉</span>`;
    setTimeout(() => {
      btnEl.innerHTML = originalContent;
    }, 2500);
  }).catch(() => {
    prompt('Copie o código do cupom:', code);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  initFloatingCart();
  initCartDrawer();
});

