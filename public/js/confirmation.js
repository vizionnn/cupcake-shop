function renderPhoto(photoOrEmoji, name) {
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji || '🧁';
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

  // Itens com foto e nome lado a lado, SEM links clicáveis (conforme especificado)
  const itemsHtml = order.items
    .map(
      (i) => `
      <div class="confirm-item">
        <div class="confirm-item-thumb">
          ${renderPhoto(i.image_emoji, i.product_name)}
        </div>
        <div class="confirm-item-info">
          <h4>${i.product_name}</h4>
          <span class="confirm-item-meta">${i.quantity}x ${formatBRL(i.unit_price)}</span>
        </div>
        <div class="confirm-item-total">
          ${formatBRL(i.unit_price * i.quantity)}
        </div>
      </div>
    `
    )
    .join('');

  const subtotal = order.subtotal || order.items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
  const shipping = order.shipping_fee !== undefined ? order.shipping_fee : (subtotal >= 49.90 ? 0 : 9.90);
  const discount = order.discount || 0;

  const discountRow = discount > 0
    ? `
      <div class="summary-row discount">
        <span>Desconto (${order.coupon_code || 'Cupom 10%'})</span>
        <span style="color: #2E7D32; font-weight: 700;">-${formatBRL(discount)}</span>
      </div>
    `
    : '';

  const shippingHtml = shipping === 0
    ? `<span style="color: #2E7D32; font-weight: 700;">Grátis</span>`
    : `<span>${formatBRL(shipping)}</span>`;

  el.innerHTML = `
    <div class="confirmation">
      <div class="stamp">🎉</div>
      <h2>Pedido #${order.id} confirmado!</h2>
      <p>Enviamos os detalhes para <strong>${order.customer_email}</strong>.<br>Sua encomenda fresca será entregue em: <em>${order.delivery_address}</em>.</p>
      
      <div class="summary-box confirm-summary-box">
        <h3 class="checkout-summary-title">Itens do Pedido</h3>
        <div class="confirm-items-list">
          ${itemsHtml}
        </div>

        <div class="summary-row" style="margin-top: 14px; border-top: 1px solid var(--line); padding-top: 12px;">
          <span>Subtotal</span>
          <span>${formatBRL(subtotal)}</span>
        </div>
        ${discountRow}
        <div class="summary-row">
          <span>Entrega</span>
          ${shippingHtml}
        </div>
        <div class="summary-row total">
          <span>Total pago via ${order.payment_method}</span>
          <span>${formatBRL(order.total)}</span>
        </div>
      </div>

      <a href="index.html"><button class="btn btn-primary">Voltar ao cardápio</button></a>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadConfirmation);
