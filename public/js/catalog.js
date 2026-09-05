let allProducts = [];
let activeFilter = 'Todos';
let scrollObserver = null;

async function loadProducts() {
  const res = await fetch('/api/products');
  allProducts = await res.json();
  renderFilters();
  renderProducts();
}

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          entry.target.addEventListener(
            'transitionend',
            () => {
              entry.target.style.transitionDelay = '0s';
            },
            { once: true }
          );
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.06,
      rootMargin: '0px 0px -20px 0px'
    }
  );

  document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach((el) => {
    scrollObserver.observe(el);
  });
}

function renderFilters() {
  const tags = ['Todos', ...new Set(allProducts.map((p) => p.flavor_tag))];
  const row = document.getElementById('filterRow');
  row.classList.add('reveal-on-scroll');
  row.innerHTML = tags
    .map(
      (tag) => `<button class="filter-chip ${tag === activeFilter ? 'active' : ''}" data-tag="${tag}">${tag}</button>`
    )
    .join('');

  row.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.tag;
      renderFilters();
      renderProducts();
    });
  });

  initScrollReveal();
}

// Função auxiliar para decidir se renderiza foto ou emoji:
function renderPhoto(photoOrEmoji, name) {
  if (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http')) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  const list = activeFilter === 'Todos'
    ? allProducts
    : allProducts.filter((p) => p.flavor_tag === activeFilter);

  grid.innerHTML = list
    .map(
      (p, index) => `
      <div class="product-card reveal-on-scroll" style="transition-delay: ${(index % 6) * 0.07}s;">
        <a href="produto.html?id=${p.id}" class="product-card-link" aria-label="Ver detalhes de ${p.name}">
          <div class="product-photo">${renderPhoto(p.image_emoji, p.name)}</div>
        </a>
        <span class="photo-disclaimer">*Imagem meramente ilustrativa</span>
        <span class="product-tag">${p.flavor_tag}</span>
        <a href="produto.html?id=${p.id}" class="product-title-link">
          <h3>${p.name}</h3>
        </a>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="price">${formatBRL(p.price)}</span>
          <button class="btn btn-primary" data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
            ${p.stock <= 0 ? 'Esgotado' : 'Adicionar'}
          </button>
        </div>
      </div>
    `
    )
    .join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = allProducts.find((p) => p.id === Number(btn.dataset.add));
      addToCart(product);
      btn.textContent = 'Adicionado ✓';
      setTimeout(() => { btn.textContent = 'Adicionar'; }, 900);
    });
  });

  // Feedback tátil com resposta instantânea em telas touch/mobile
  grid.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('pointerdown', (e) => {
      if (e.target.closest('[data-add]')) return;
      card.classList.add('touch-active');
    }, { passive: true });

    const clearTouch = () => card.classList.remove('touch-active');
    card.addEventListener('pointerup', clearTouch, { passive: true });
    card.addEventListener('pointercancel', clearTouch, { passive: true });
    card.addEventListener('pointerleave', clearTouch, { passive: true });
  });

  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', loadProducts);
