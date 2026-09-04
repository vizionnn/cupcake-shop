let selectedPayment = 'Pix';
let appliedCoupon = null;

function renderPhoto(photoOrEmoji, name) {
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji || '🧁';
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderCheckoutSummary() {
  const cart = getCart();
  const el = document.getElementById('checkoutSummary');

  if (cart.length === 0) {
    document.getElementById('checkoutForm').style.display = 'none';
    el.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    return;
  }

  const itemsHtml = cart
    .map(
      (i) => `
      <div class="checkout-item">
        <a href="produto.html?id=${i.product_id}" class="checkout-item-thumb-link" aria-label="Ver detalhes de ${i.name}">
          <div class="checkout-item-thumb">
            ${renderPhoto(i.emoji, i.name)}
          </div>
        </a>
        <div class="checkout-item-info">
          <a href="produto.html?id=${i.product_id}" class="checkout-item-title-link">
            <h4>${i.name}</h4>
          </a>
          <span class="checkout-item-meta">${i.quantity}x ${formatBRL(i.price)}</span>
        </div>
        <div class="checkout-item-total">
          ${formatBRL(i.price * i.quantity)}
        </div>
      </div>
    `
    )
    .join('');

  const subtotal = cartTotal();
  const shipping = subtotal >= 49.90 ? 0 : 9.90;
  const discount = appliedCoupon === 'NUVEM10' ? Number((subtotal * 0.10).toFixed(2)) : 0;
  const grandTotal = Number((subtotal - discount + shipping).toFixed(2));
  const diffForFree = 49.90 - subtotal;

  const freeShippingNotice = shipping === 0
    ? `<div class="drawer-shipping-notice reached" style="margin-bottom: 14px;">🎉 Parabéns! Você ganhou <strong>Frete Grátis</strong>!</div>`
    : `<div class="drawer-shipping-notice" style="margin-bottom: 14px;">Adicione mais <strong>${formatBRL(diffForFree)}</strong> para ter <strong>Frete Grátis</strong>!</div>`;

  const couponHtml = appliedCoupon
    ? `
      <div class="coupon-section">
        <div class="coupon-applied-badge">
          <span>🎟️ Cupom <strong>${appliedCoupon}</strong> (-10%) aplicado!</span>
          <button type="button" id="removeCouponBtn" class="btn-remove-coupon" title="Remover cupom">✕</button>
        </div>
      </div>
    `
    : `
      <div class="coupon-section">
        <div class="coupon-input-group">
          <input type="text" id="couponInput" placeholder="Código do cupom (ex: NUVEM10)" autocomplete="off">
          <button type="button" id="applyCouponBtn" class="btn btn-secondary btn-sm">Aplicar</button>
        </div>
        <div id="couponFeedback" class="coupon-feedback"></div>
      </div>
    `;

  const discountRow = discount > 0
    ? `
      <div class="summary-row discount">
        <span>Desconto (${appliedCoupon} - 10%)</span>
        <span style="color: #2E7D32; font-weight: 700;">-${formatBRL(discount)}</span>
      </div>
    `
    : '';

  const shippingHtml = shipping === 0
    ? `<span style="color: #2E7D32; font-weight: 700;">Grátis</span>`
    : `<span>${formatBRL(shipping)}</span>`;

  el.innerHTML = `
    <div class="summary-box">
      <h3 class="checkout-summary-title">Resumo do Pedido</h3>
      <div class="checkout-items-list">
        ${itemsHtml}
      </div>

      ${freeShippingNotice}
      ${couponHtml}

      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatBRL(subtotal)}</span>
      </div>
      ${discountRow}
      <div class="summary-row">
        <span>Entrega ${shipping === 0 ? '' : '<small style="color:var(--ink-soft);font-size:0.75rem;">(acima de R$ 49,90 é grátis)</small>'}</span>
        ${shippingHtml}
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatBRL(grandTotal)}</span>
      </div>
    </div>
  `;

  // Eventos de Cupom
  const applyBtn = document.getElementById('applyCouponBtn');
  const couponInput = document.getElementById('couponInput');
  const removeBtn = document.getElementById('removeCouponBtn');

  if (applyBtn && couponInput) {
    const handleApply = () => {
      const code = couponInput.value.trim().toUpperCase();
      const feedback = document.getElementById('couponFeedback');
      if (!code) {
        feedback.textContent = 'Digite o código do cupom.';
        feedback.className = 'coupon-feedback error';
        return;
      }
      if (code === 'NUVEM10') {
        appliedCoupon = 'NUVEM10';
        renderCheckoutSummary();
      } else {
        feedback.textContent = 'Cupom inválido ou expirado.';
        feedback.className = 'coupon-feedback error';
      }
    };

    applyBtn.addEventListener('click', handleApply);
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      appliedCoupon = null;
      renderCheckoutSummary();
    });
  }
}

let selectedPayment = 'Pix';
let appliedCoupon = null;
let currentEstimatedDelivery = 'Hoje mesmo (em até 3 horas) — Sede Recife/PE';

function getDeliveryEstimateByCep(cleanCep) {
  const num = parseInt(cleanCep.substring(0, 5), 10);

  // Recife e Região Metropolitana de Recife (50000 a 54999)
  if (num >= 50000 && num <= 54999) {
    return {
      title: 'Entrega Expressa no Mesmo Dia',
      desc: 'Previsão de entrega: Hoje em até 3 horas',
      badge: 'Sede Recife & RMR 🚀',
      icon: '🚀',
      text: 'Hoje (em até 3 horas)'
    };
  }
  // Demais cidades de Pernambuco (55000 a 56999)
  if (num >= 55000 && num <= 56999) {
    return {
      title: 'Entrega Regional Rápida',
      desc: 'Previsão de entrega: 1 a 2 dias úteis',
      badge: 'Interior de Pernambuco 📦',
      icon: '📦',
      text: '1 a 2 dias úteis'
    };
  }
  // Demais estados do Nordeste (40000 a 49999 e 57000 a 65999)
  if ((num >= 40000 && num <= 49999) || (num >= 57000 && num <= 65999)) {
    return {
      title: 'Envio Expresso Nordeste',
      desc: 'Previsão de entrega: 1 a 2 dias úteis',
      badge: 'Região Nordeste 📦',
      icon: '📦',
      text: '1 a 2 dias úteis'
    };
  }
  // Sudeste (01000 a 39999)
  if (num >= 1000 && num <= 39999) {
    return {
      title: 'Envio Especial Aéreo',
      desc: 'Previsão de entrega: 2 a 4 dias úteis',
      badge: 'Região Sudeste 🚚',
      icon: '🚚',
      text: '2 a 4 dias úteis'
    };
  }
  // Centro-Oeste / DF (70000 a 78999) e Sul (80000 a 99999)
  if ((num >= 70000 && num <= 78999) || (num >= 80000 && num <= 99999)) {
    return {
      title: 'Envio Seguro Climatizado',
      desc: 'Previsão de entrega: 3 a 5 dias úteis',
      badge: 'Centro-Oeste e Sul 🚚',
      icon: '🚚',
      text: '3 a 5 dias úteis'
    };
  }
  // Norte (66000 a 69999)
  if (num >= 66000 && num <= 69999) {
    return {
      title: 'Envio Prioritário',
      desc: 'Previsão de entrega: 4 a 6 dias úteis',
      badge: 'Região Norte ✈️',
      icon: '✈️',
      text: '4 a 6 dias úteis'
    };
  }

  return {
    title: 'Entrega Padrão Nuvem',
    desc: 'Previsão de entrega: 2 a 4 dias úteis',
    badge: 'Nacional 🚚',
    icon: '🚚',
    text: '2 a 4 dias úteis'
  };
}

function setupCepLookup() {
  const cepInput = document.getElementById('cep');
  const searchBtn = document.getElementById('btnSearchCep');
  const feedback = document.getElementById('cepFeedback');
  const card = document.getElementById('deliveryEstimateCard');
  const icon = document.getElementById('estimateIcon');
  const title = document.getElementById('estimateTitle');
  const desc = document.getElementById('estimateDesc');
  const badge = document.getElementById('estimateBadge');
  const addressInput = document.getElementById('address');

  if (!cepInput || !searchBtn) return;

  const applyMask = (val) => {
    val = val.replace(/\D/g, '').substring(0, 8);
    if (val.length > 5) {
      val = val.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    return val;
  };

  cepInput.addEventListener('input', (e) => {
    e.target.value = applyMask(e.target.value);
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length === 8) {
      performLookup(raw);
    }
  });

  searchBtn.addEventListener('click', () => {
    const raw = cepInput.value.replace(/\D/g, '');
    if (raw.length !== 8) {
      feedback.textContent = 'Digite um CEP válido com 8 números.';
      feedback.className = 'cep-feedback error';
      return;
    }
    performLookup(raw);
  });

  async function performLookup(rawCep) {
    feedback.textContent = 'Consultando ViaCEP...';
    feedback.className = 'cep-feedback';
    searchBtn.disabled = true;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        feedback.textContent = 'CEP não localizado. Complete seu endereço manualmente abaixo.';
        feedback.className = 'cep-feedback error';
        searchBtn.disabled = false;
        return;
      }

      // Autocomplete amigável de endereço
      const parts = [];
      if (data.logradouro) parts.push(data.logradouro);
      if (data.bairro) parts.push(data.bairro);
      parts.push(`${data.localidade} - ${data.uf}`);
      addressInput.value = parts.join(', ');
      addressInput.focus();

      // Cálculo de estimativa
      const est = getDeliveryEstimateByCep(rawCep);
      currentEstimatedDelivery = `${est.text} (${data.localidade}/${data.uf})`;

      if (card && icon && title && desc && badge) {
        icon.textContent = est.icon;
        title.textContent = est.title;
        desc.textContent = `${est.desc} (${data.localidade}/${data.uf})`;
        badge.textContent = est.badge;
        card.style.display = 'flex';
      }

      feedback.textContent = `✓ Endereço localizado: ${data.localidade} - ${data.uf}`;
      feedback.className = 'cep-feedback success';
    } catch (err) {
      console.warn('Erro ao consultar ViaCEP:', err);
      const est = getDeliveryEstimateByCep(rawCep);
      currentEstimatedDelivery = est.text;
      if (card && icon && title && desc && badge) {
        icon.textContent = est.icon;
        title.textContent = est.title;
        desc.textContent = est.desc;
        badge.textContent = est.badge;
        card.style.display = 'flex';
      }
      feedback.textContent = 'Previsão calculada para sua região.';
      feedback.className = 'cep-feedback success';
    } finally {
      searchBtn.disabled = false;
    }
  }
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
  const cepVal = document.getElementById('cep') ? document.getElementById('cep').value.trim() : '';

  const payload = {
    customer_name: document.getElementById('name').value.trim(),
    customer_email: document.getElementById('email').value.trim(),
    delivery_address: document.getElementById('address').value.trim(),
    customer_cep: cepVal,
    estimated_delivery: currentEstimatedDelivery,
    payment_method: selectedPayment,
    coupon_code: appliedCoupon,
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
  setupCepLookup();
  document.getElementById('checkoutForm').addEventListener('submit', submitOrder);
});
