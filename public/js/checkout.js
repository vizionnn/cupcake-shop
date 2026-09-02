let selectedPayment = 'Pix';

function renderCheckoutSummary() {
  const cart = getCart();
  const el = document.getElementById('checkoutSummary');

  if (cart.length === 0) {
    document.getElementById('checkoutForm').style.display = 'none';
    el.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    return;
  }

  const rows = cart
    .map((i) => `<div class="summary-row"><span>${i.quantity}x ${i.name}</span><span>${formatBRL(i.price * i.quantity)}</span></div>`)
    .join('');

  el.innerHTML = `
    <div class="summary-box">
      ${rows}
      <div class="summary-row total"><span>Total</span><span>${formatBRL(cartTotal())}</span></div>
    </div>
  `;
}

function setupPaymentOptions() {
  document.querySelectorAll('.payment-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPayment = opt.dataset.method;
    });
  });
}

async function submitOrder(e) {
  e.preventDefault();
  const errorBanner = document.getElementById('errorBanner');
  errorBanner.classList.remove('show');

  const cart = getCart();
  const payload = {
    customer_name: document.getElementById('name').value.trim(),
    customer_email: document.getElementById('email').value.trim(),
    delivery_address: document.getElementById('address').value.trim(),
    payment_method: selectedPayment,
    items: cart.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
  };

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processando...';

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Erro ao finalizar o pedido.');

    clearCart();
    window.location.href = `confirmacao.html?order=${data.order_id}`;
  } catch (err) {
    errorBanner.textContent = err.message;
    errorBanner.classList.add('show');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirmar pedido';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  setupPaymentOptions();
  document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
});
