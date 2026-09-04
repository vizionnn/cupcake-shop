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

  const deliveryBadgeHtml = order.estimated_delivery
    ? `
      <div class="confirmation-badge-delivery">
        <span>🚀 Previsão: <strong>${order.estimated_delivery}</strong></span>
      </div>
    `
    : `
      <div class="confirmation-badge-delivery">
        <span>🚀 Previsão: <strong>Hoje mesmo em até 3h (Sede Recife/PE)</strong></span>
      </div>
    `;

  const orderDate = order.created_at ? new Date(order.created_at).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR');

  el.innerHTML = `
    <div class="confirmation">
      <div class="stamp">🎉</div>
      <h2>Pedido #${order.id} confirmado!</h2>
      ${deliveryBadgeHtml}
      <p>Enviamos os detalhes para <strong>${order.customer_email}</strong>.<br>Sua encomenda fresca será entregue em: <em>${order.delivery_address}</em>.</p>
      
      <div class="summary-box confirm-summary-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; font-size: 0.82rem; color: var(--ink-soft); border-bottom: 1px solid var(--line); padding-bottom: 8px;">
          <span>Pedido #${order.id}</span>
          <span>Data: ${orderDate}</span>
        </div>
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

      <div class="confirm-actions">
        <button type="button" class="btn-print" id="btnPrintReceipt">
          <span>🖨️ Imprimir Recibo / Salvar PDF</span>
        </button>
        <a href="index.html">
          <button type="button" class="btn btn-primary">Voltar ao cardápio</button>
        </a>
      </div>
    </div>
  `;

  const printBtn = document.getElementById('btnPrintReceipt');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function initFloatingSweetsBg() {
  const bgContainer = document.getElementById('floatingSweetsBg');
  if (!bgContainer) return;

  const icons = ['🧁', '✨', '🍓', '🧁', '💖', '🧁', '✨', '🧁', '🍬', '🧁'];
  const count = 22; // Quantidade elegante que preenche a tela sem sobrecarregar

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-sweet';
    el.textContent = icons[i % icons.length];

    // Posição horizontal aleatória (0% a 95%)
    const left = Math.random() * 95;
    // Duração da subida suave (10s a 22s)
    const duration = 10 + Math.random() * 12;
    // Delay inicial escalonado para criar fluxo contínuo
    const delay = -(Math.random() * 16);
    // Tamanho do emoji (1.4rem a 2.6rem)
    const size = 1.4 + Math.random() * 1.2;
    // Opacidade suave (0.25 a 0.55)
    const opacity = 0.25 + Math.random() * 0.3;
    // Leve blur para criar profundidade de campo cinematográfica (efeito bokeh)
    const blur = Math.random() > 0.65 ? Math.random() * 1.5 : 0;

    el.style.left = `${left}%`;
    el.style.fontSize = `${size}rem`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.setProperty('--sweet-opacity', opacity);
    if (blur > 0) {
      el.style.filter = `blur(${blur}px) drop-shadow(0 4px 8px rgba(214,51,108,0.12))`;
    }

    bgContainer.appendChild(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFloatingSweetsBg();
  loadConfirmation();
});
