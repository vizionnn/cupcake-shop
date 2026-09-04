function renderPhoto(photoOrEmoji, name) {
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji || '🧁';
}

function renderCartPage() {
  const cart = getCart();
  const listEl = document.getElementById('cartList');
  const summaryEl = document.getElementById('cartSummary');

  if (cart.length === 0) {
    listEl.innerHTML = '<div class="cart-empty">Seu carrinho está vazio. Que tal escolher um cupcake?</div>';
    summaryEl.innerHTML = '';
    return;
  }

  listEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item">
        <a href="produto.html?id=${item.product_id}" class="cart-item-photo-link" aria-label="Ver detalhes de ${item.name}">
          <div class="emoji">${renderPhoto(item.emoji, item.name)}</div>
        </a>
        <div class="info">
          <a href="produto.html?id=${item.product_id}" class="cart-item-title-link">
            <h3>${item.name}</h3>
          </a>
          <span class="price">${formatBRL(item.price)}</span>
        </div>
        <div class="qty-control">
          <button data-dec="${item.product_id}">−</button>
          <span>${item.quantity}</span>
          <button data-inc="${item.product_id}">+</button>
        </div>
        <button class="remove" data-remove="${item.product_id}">remover</button>
      </div>
    `
    )
    .join('');

  const subtotal = cartTotal();
  const shipping = subtotal >= 49.90 ? 0 : 9.90;
  const grandTotal = subtotal + shipping;
  const diffForFree = 49.90 - subtotal;

  const shippingHtml = shipping === 0
    ? `<span style="color: #2E7D32; font-weight: 700;">Grátis</span>`
    : `<span>${formatBRL(shipping)}</span>`;

  const freeShippingBadge = shipping === 0
    ? `<div class="drawer-shipping-notice reached" style="margin-bottom: 12px;">🎉 Parabéns! Você ganhou <strong>Frete Grátis</strong>!</div>`
    : `<div class="drawer-shipping-notice" style="margin-bottom: 12px;">Adicione mais <strong>${formatBRL(diffForFree)}</strong> para ter <strong>Frete Grátis</strong>!</div>`;

  summaryEl.innerHTML = `
    <div class="summary-box">
      ${freeShippingBadge}
      <div class="summary-row"><span>Subtotal</span><span>${formatBRL(subtotal)}</span></div>
      <div class="summary-row"><span>Entrega ${shipping === 0 ? '' : '<small style="color:var(--ink-soft);font-size:0.75rem;">(acima de R$ 49,90 é grátis)</small>'}</span>${shippingHtml}</div>
      <div class="summary-row total"><span>Total</span><span>${formatBRL(grandTotal)}</span></div>
      <a href="checkout.html"><button class="btn btn-primary btn-block" style="margin-top:16px;">Finalizar pedido</button></a>
    </div>
  `;

  listEl.querySelectorAll('[data-inc]').forEach((b) =>
    b.addEventListener('click', () => { updateQuantity(Number(b.dataset.inc), 1); renderCartPage(); })
  );
  listEl.querySelectorAll('[data-dec]').forEach((b) =>
    b.addEventListener('click', () => { updateQuantity(Number(b.dataset.dec), -1); renderCartPage(); })
  );
  listEl.querySelectorAll('[data-remove]').forEach((b) =>
    b.addEventListener('click', () => { removeFromCart(Number(b.dataset.remove)); renderCartPage(); })
  );
}

document.addEventListener('DOMContentLoaded', renderCartPage);
