let currentProduct = null;
let currentQuantity = 1;

function renderPhoto(photoOrEmoji, name) {
  if (photoOrEmoji && (photoOrEmoji.includes('.') || photoOrEmoji.startsWith('http'))) {
    return `<img src="${photoOrEmoji}" alt="${name}" loading="lazy">`;
  }
  return photoOrEmoji || '🧁';
}

async function loadProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || 1;

  try {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    currentProduct = await res.json();

    document.title = `${currentProduct.name} — Nuvem de Açúcar`;

    // Foto principal
    const imgEl = document.getElementById('productImage');
    const photoWrap = document.getElementById('productPhotoWrap');
    if (currentProduct.image_emoji && (currentProduct.image_emoji.includes('.') || currentProduct.image_emoji.startsWith('http'))) {
      imgEl.src = currentProduct.image_emoji;
      imgEl.alt = currentProduct.name;
    } else {
      imgEl.style.display = 'none';
      const emojiDiv = document.createElement('div');
      emojiDiv.style.fontSize = '6rem';
      emojiDiv.textContent = currentProduct.image_emoji || '🧁';
      photoWrap.prepend(emojiDiv);
    }

    // Metadados
    document.getElementById('productTag').textContent = currentProduct.flavor_tag;
    const stockBadge = document.getElementById('productStockBadge');
    if (currentProduct.stock > 0) {
      stockBadge.textContent = '✓ Em estoque para hoje';
      stockBadge.className = 'detail-stock-badge in-stock';
    } else {
      stockBadge.textContent = 'Esgotado';
      stockBadge.className = 'detail-stock-badge out-of-stock';
    }

    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = formatBRL(currentProduct.price);
    document.getElementById('productDetails').textContent = currentProduct.details || currentProduct.description;
    document.getElementById('productIngredients').textContent = currentProduct.ingredients || 'Ingredientes selecionados de alta qualidade.';

    updatePricePreview();
    setupQuantityControls();
    loadRecommendedCarousel(currentProduct.id);
  } catch (err) {
    console.error(err);
    document.getElementById('productName').textContent = 'Cupcake não encontrado';
    document.getElementById('productDetails').textContent = 'O sabor solicitado não foi localizado no cardápio.';
  }
}

function updatePricePreview() {
  if (!currentProduct) return;
  const btnPreview = document.getElementById('btnAddPricePreview');
  const totalPrice = currentProduct.price * currentQuantity;
  if (btnPreview) {
    btnPreview.textContent = `· ${formatBRL(totalPrice)}`;
  }
}

function setupQuantityControls() {
  const decBtn = document.getElementById('qtyDec');
  const incBtn = document.getElementById('qtyInc');
  const valSpan = document.getElementById('qtyVal');
  const addBtn = document.getElementById('btnAddToCart');

  decBtn.addEventListener('click', () => {
    if (currentQuantity > 1) {
      currentQuantity -= 1;
      valSpan.textContent = currentQuantity;
      updatePricePreview();
    }
  });

  incBtn.addEventListener('click', () => {
    if (currentProduct && currentQuantity < (currentProduct.stock || 99)) {
      currentQuantity += 1;
      valSpan.textContent = currentQuantity;
      updatePricePreview();
    }
  });

  addBtn.addEventListener('click', () => {
    if (!currentProduct || currentProduct.stock <= 0) return;

    // Adiciona a quantidade selecionada ao carrinho
    const cart = getCart();
    const existing = cart.find((i) => i.product_id === currentProduct.id);
    if (existing) {
      existing.quantity += currentQuantity;
    } else {
      cart.push({
        product_id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        emoji: currentProduct.image_emoji,
        quantity: currentQuantity
      });
    }

    saveCart(cart);
    triggerCartBump();

    // Feedback visual e abre o Drawer automaticamente
    addBtn.classList.add('added');
    setTimeout(() => addBtn.classList.remove('added'), 1200);

    if (typeof openCartDrawer === 'function') {
      openCartDrawer();
    }
  });
}

async function loadRecommendedCarousel(currentId) {
  const track = document.getElementById('recommendedTrack');
  const viewport = document.getElementById('carouselViewport');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  try {
    const res = await fetch('/api/products');
    const allProducts = await res.json();
    const recommended = allProducts.filter((p) => p.id !== currentId);

    track.innerHTML = recommended
      .map(
        (p) => `
        <div class="carousel-card">
          <a href="produto.html?id=${p.id}" class="carousel-card-photo-link" aria-label="Ver detalhes de ${p.name}">
            <div class="product-photo">${renderPhoto(p.image_emoji, p.name)}</div>
          </a>
          <span class="photo-disclaimer">*Imagem meramente ilustrativa</span>
          <span class="product-tag">${p.flavor_tag}</span>
          <a href="produto.html?id=${p.id}" class="carousel-card-title-link">
            <h4>${p.name}</h4>
          </a>
          <p class="carousel-card-desc">${p.description}</p>
          <div class="carousel-card-footer">
            <span class="price">${formatBRL(p.price)}</span>
            <button type="button" class="btn btn-primary btn-sm" data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
              ${p.stock <= 0 ? 'Esgotado' : 'Adicionar'}
            </button>
          </div>
        </div>
      `
      )
      .join('');

    // Controles de clique das setas
    prevBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: -310, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      viewport.scrollBy({ left: 310, behavior: 'smooth' });
    });

    // Vincula adição ao carrinho nos cards do carrossel
    track.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const prod = allProducts.find((p) => p.id === Number(btn.dataset.add));
        if (prod) {
          addToCart(prod);
          btn.textContent = 'Adicionado ✓';
          setTimeout(() => { btn.textContent = 'Adicionar'; }, 900);
        }
      });
    });
  } catch (err) {
    console.error('Erro ao carregar recomendados:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadProductDetails);
