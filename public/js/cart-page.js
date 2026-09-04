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

  const savedCep = localStorage.getItem('cupcake_user_cep') || '';
  const savedCity = localStorage.getItem('cupcake_user_city') || '';
  let savedEstimateHtml = '';
  if (savedCep && savedCep.length === 8 && typeof getDeliveryEstimateByCep === 'function') {
    const est = getDeliveryEstimateByCep(savedCep);
    savedEstimateHtml = `
      <div class="drawer-cep-estimate-badge">
        <span>${est.icon} ${est.desc}${savedCity ? ` (${savedCity})` : ''}</span>
      </div>
    `;
  }
  const savedCepFormatted = savedCep.length > 5 ? savedCep.replace(/^(\d{5})(\d)/, '$1-$2') : savedCep;

  summaryEl.innerHTML = `
    <div class="summary-box">
      ${freeShippingBadge}

      <div class="drawer-cep-section">
        <div class="drawer-cep-header">
          <span>🚚 Calcular entrega e prazo</span>
        </div>
        <div class="drawer-cep-input-group">
          <input type="text" id="pageCepInput" placeholder="Ex: 50010-000" maxlength="9" value="${savedCepFormatted}" autocomplete="postal-code">
          <button type="button" id="pageCepBtn" class="btn-drawer-cep">Calcular</button>
        </div>
        <div id="pageCepFeedback" class="drawer-cep-feedback">${savedEstimateHtml}</div>
      </div>

      <div class="summary-row"><span>Subtotal</span><span>${formatBRL(subtotal)}</span></div>
      <div class="summary-row"><span>Entrega ${shipping === 0 ? '' : '<small style="color:var(--ink-soft);font-size:0.75rem;">(acima de R$ 49,90 é grátis)</small>'}</span>${shippingHtml}</div>
      <div class="summary-row total"><span>Total</span><span>${formatBRL(grandTotal)}</span></div>
      <a href="checkout.html"><button class="btn btn-primary btn-block" style="margin-top:16px;">Finalizar pedido</button></a>
    </div>
  `;

  const pageCepInput = summaryEl.querySelector('#pageCepInput');
  const pageCepBtn = summaryEl.querySelector('#pageCepBtn');
  const pageCepFeedback = summaryEl.querySelector('#pageCepFeedback');

  if (pageCepInput && pageCepBtn) {
    const handlePageCepLookup = async () => {
      const rawCep = pageCepInput.value.replace(/\D/g, '');
      if (rawCep.length !== 8) {
        pageCepFeedback.textContent = 'Digite um CEP válido com 8 números.';
        pageCepFeedback.className = 'drawer-cep-feedback error';
        return;
      }
      pageCepFeedback.textContent = 'Calculando prazo...';
      pageCepFeedback.className = 'drawer-cep-feedback';
      pageCepBtn.disabled = true;

      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (data.erro) {
          pageCepFeedback.textContent = 'CEP não encontrado.';
          pageCepFeedback.className = 'drawer-cep-feedback error';
          return;
        }

        const est = typeof getDeliveryEstimateByCep === 'function' ? getDeliveryEstimateByCep(rawCep) : { icon: '🚚', desc: 'Previsão calculada' };
        localStorage.setItem('cupcake_user_cep', rawCep);
        localStorage.setItem('cupcake_user_city', `${data.localidade}/${data.uf}`);
        if (data.logradouro) {
          const parts = [data.logradouro];
          if (data.bairro) parts.push(data.bairro);
          parts.push(`${data.localidade} - ${data.uf}`);
          localStorage.setItem('cupcake_user_address', parts.join(', '));
        }

        pageCepFeedback.innerHTML = `
          <div class="drawer-cep-estimate-badge">
            <span>${est.icon} ${est.desc} (${data.localidade}/${data.uf})</span>
          </div>
        `;
        pageCepFeedback.className = 'drawer-cep-feedback success';
      } catch (err) {
        const est = typeof getDeliveryEstimateByCep === 'function' ? getDeliveryEstimateByCep(rawCep) : { icon: '🚚', desc: 'Previsão calculada' };
        localStorage.setItem('cupcake_user_cep', rawCep);
        pageCepFeedback.innerHTML = `
          <div class="drawer-cep-estimate-badge">
            <span>${est.icon} ${est.desc}</span>
          </div>
        `;
        pageCepFeedback.className = 'drawer-cep-feedback success';
      } finally {
        pageCepBtn.disabled = false;
      }
    };

    pageCepInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 8);
      if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2');
      e.target.value = val;
      if (val.replace(/\D/g, '').length === 8) {
        handlePageCepLookup();
      }
    });

    pageCepInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePageCepLookup();
      }
    });

    pageCepBtn.addEventListener('click', handlePageCepLookup);
  }

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
