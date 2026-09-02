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
        <div class="emoji">${item.emoji}</div>
        <div class="info">
          <h3>${item.name}</h3>
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

  const total = cartTotal();
  summaryEl.innerHTML = `
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${formatBRL(total)}</span></div>
      <div class="summary-row"><span>Entrega</span><span>Grátis</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatBRL(total)}</span></div>
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
