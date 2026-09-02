async function loadConfirmation() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');
  const el = document.getElementById('confirmationContent');

  if (!orderId) {
    el.innerHTML = '<p>Pedido não encontrado.</p>';
    return;
  }

  const res = await fetch(`/api/orders/${orderId}`);
  if (!res.ok) {
    el.innerHTML = '<p>Não foi possível carregar seu pedido.</p>';
    return;
  }
  const order = await res.json();

  const itemsHtml = order.items
    .map((i) => `<div class="summary-row"><span>${i.quantity}x ${i.product_name}</span><span>${formatBRL(i.unit_price * i.quantity)}</span></div>`)
    .join('');

  el.innerHTML = `
    <div class="confirmation">
      <div class="stamp">🎉</div>
      <h2>Pedido #${order.id} confirmado!</h2>
      <p>Enviamos os detalhes para ${order.customer_email}. Sua encomenda chega em ${order.delivery_address}.</p>
      <div class="summary-box" style="text-align:left; max-width:420px; margin:0 auto 28px;">
        ${itemsHtml}
        <div class="summary-row total"><span>Total pago via ${order.payment_method}</span><span>${formatBRL(order.total)}</span></div>
      </div>
      <a href="index.html"><button class="btn btn-primary">Voltar à vitrine</button></a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadConfirmation);
