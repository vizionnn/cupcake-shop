let allProducts = [];
let activeFilter = 'Todos';

async function loadProducts() {
  const res = await fetch('/api/products');
  allProducts = await res.json();
  renderFilters();
  renderProducts();
}

function renderFilters() {
  const tags = ['Todos', ...new Set(allProducts.map((p) => p.flavor_tag))];
  const row = document.getElementById('filterRow');
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
      (p) => `
      <div class="product-card">
        <div class="product-photo">${renderPhoto(p.image_emoji, p.name)}</div>
        <span class="photo-disclaimer">*Imagem meramente ilustrativa</span>
        <span class="product-tag">${p.flavor_tag}</span>
        <h3>${p.name}</h3>
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
}

document.addEventListener('DOMContentLoaded', loadProducts);
