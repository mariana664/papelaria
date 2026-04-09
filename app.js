/* ══════════════════════════════════════════
   FLEUR PAPELARIA · APP.JS
   ══════════════════════════════════════════ */

'use strict';

// ── DATA ──────────────────────────────────
const PRODUCTS = [
  { id: 1, name: 'Convite Casamento Floral', emoji: '💌', price: 4.90, category: 'casamento', rating: 5, reviews: 214, popular: true, isNew: false, description: 'Convite elegante com aquarela floral, papel perolado 300g e envelope kraft. Personalizado com nome dos noivos, data e local da cerimônia.', deadline: 7 },
  { id: 2, name: 'Kit Chá de Bebê Rosa', emoji: '🎀', price: 89.90, category: 'infantil', rating: 5, reviews: 156, popular: true, isNew: false, description: 'Kit completo com convites, tags, adesivos e lembrancinhas para o chá de bebê. Inclui 50 peças personalizadas.', deadline: 10 },
  { id: 3, name: 'Lembrancinha Sabonete Floral', emoji: '🌸', price: 12.50, category: 'lembrancas', rating: 4, reviews: 389, popular: false, isNew: true, description: 'Sabonete artesanal em formato de flor com embalagem personalizada. Feito com ingredientes naturais e aroma suave de rosas.', deadline: 5 },
  { id: 4, name: 'Caderno Personalizado A5', emoji: '📓', price: 34.90, category: 'papelaria', rating: 5, reviews: 92, popular: false, isNew: true, description: 'Caderno capa dura com nome personalizado em hot stamping dourado. Papel offset 90g, 120 páginas pautadas.', deadline: 8 },
  { id: 5, name: 'Convite Aniversário Infantil', emoji: '🎉', price: 3.50, category: 'infantil', rating: 4, reviews: 478, popular: true, isNew: false, description: 'Convite colorido e divertido para aniversário infantil. Personalizado com nome, idade, tema e informações da festa.', deadline: 5 },
  { id: 6, name: 'Tag Lembrancinha Casamento', emoji: '💍', price: 1.20, category: 'casamento', rating: 5, reviews: 633, popular: true, isNew: false, description: 'Tag kraft com cordão de juta e carimbo personalizado. Perfeita para lembrancinhas de casamento e noivado.', deadline: 3 },
  { id: 7, name: 'Kit Festa Completo Rosa', emoji: '🎊', price: 149.90, category: 'festa', rating: 4, reviews: 67, popular: false, isNew: true, description: 'Kit completo para festa com 100 peças: convites, topos de bolo, tags, adesivos e lembrancinhas. Tema rosa floral.', deadline: 12 },
  { id: 8, name: 'Lembrancinha Potinho Mel', emoji: '🍯', price: 9.90, category: 'lembrancas', rating: 5, reviews: 241, popular: true, isNew: false, description: 'Mini pote de mel com identificação personalizada. Mel natural, 50g. Ideal para casamentos e chás.', deadline: 5 },
  { id: 9, name: 'Convite Chá de Panela', emoji: '🫖', price: 4.20, category: 'festa', rating: 4, reviews: 188, popular: false, isNew: false, description: 'Convite delicado e romântico para chá de panela. Arte floral aquarela com envelope combinando.', deadline: 5 },
  { id: 10, name: 'Álbum de Memórias Personalizado', emoji: '📷', price: 79.90, category: 'papelaria', rating: 5, reviews: 43, popular: false, isNew: true, description: 'Álbum scrapbook personalizado com capa em linho e nome bordado. 40 páginas com bolsos para fotos.', deadline: 14 },
  { id: 11, name: 'Mini Vela Aromática Tag', emoji: '🕯️', price: 16.90, category: 'lembrancas', rating: 5, reviews: 315, popular: true, isNew: false, description: 'Vela de soja em copo de vidro com tag personalizada. Aromas: lavanda, rosa ou baunilha. 120g, 25h de queima.', deadline: 6 },
  { id: 12, name: 'Convite Digital Animado', emoji: '✨', price: 25.00, category: 'convites', rating: 5, reviews: 182, popular: true, isNew: true, description: 'Convite digital animado para envio por WhatsApp ou e-mail. Arte exclusiva com personalização completa. Entrega em 24h.', deadline: 1 },
];

// ── STATE ──────────────────────────────────
let cart = [];
let favorites = new Set();
let currentProduct = null;
let currentPage = 'login';

// ── NAVIGATION ──────────────────────────────────
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById(`page-${page}`);
  if (el) {
    el.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage = page;
    updateAllBadges();

    if (page === 'home') {
      renderFeatured();
      renderBestsellers();
    } else if (page === 'catalog') {
      renderCatalog();
    } else if (page === 'cart') {
      renderCart();
    } else if (page === 'checkout') {
      renderCheckoutSummary();
    } else if (page === 'favorites') {
      renderFavorites();
    }
  }
}

function toggleMenu() {
  const links = document.getElementById('nav-links');
  if (links) links.classList.toggle('open');
}

// ── PRODUCTS RENDER ──────────────────────────────────
function createCard(product, showCustomize = true) {
  const isFav = favorites.has(product.id);
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  const badge = product.popular
    ? `<span class="badge-popular">🔥 Popular</span>`
    : product.isNew
    ? `<span class="badge-new">✦ Novo</span>`
    : '';

  return `
    <div class="product-card" onclick="openProduct(${product.id})">
      ${badge}
      <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${product.id})">${isFav ? '♥' : '♡'}</button>
      <div class="product-img">${product.emoji}</div>
      <div class="product-body">
        <div class="product-name">${product.name}</div>
        <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
        <div class="product-rating">${stars} <span>(${product.reviews})</span></div>
        <div class="product-actions">
          <button class="btn-primary btn-sm" onclick="event.stopPropagation(); openProduct(${product.id})">
            ${showCustomize ? '✏️ Personalizar' : 'Ver mais'}
          </button>
          <button class="btn-outline btn-sm" onclick="event.stopPropagation(); quickAdd(${product.id})">+ Carrinho</button>
        </div>
      </div>
    </div>
  `;
}

function renderFeatured() {
  const el = document.getElementById('featured-grid');
  if (!el) return;
  const featured = PRODUCTS.filter(p => p.popular).slice(0, 4);
  el.innerHTML = featured.map(p => createCard(p)).join('');
}

function renderBestsellers() {
  const el = document.getElementById('bestseller-grid');
  if (!el) return;
  const best = [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  el.innerHTML = best.map(p => createCard(p)).join('');
}

// ── CATALOG ──────────────────────────────────
function renderCatalog(products = null) {
  const el = document.getElementById('catalog-grid');
  const count = document.getElementById('result-count');
  if (!el) return;

  let list = products || getFilteredProducts();
  if (count) count.textContent = `${list.length} produto${list.length !== 1 ? 's' : ''} encontrado${list.length !== 1 ? 's' : ''}`;
  el.innerHTML = list.length ? list.map(p => createCard(p)).join('') : '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><h3>Nenhum produto encontrado</h3><p>Tente ajustar os filtros</p></div>';
}

function getFilteredProducts() {
  const cat = document.querySelector('input[name="cat"]:checked')?.value || '';
  const minStars = parseInt(document.querySelector('input[name="stars"]:checked')?.value || '0');
  const maxPrice = parseInt(document.getElementById('price-range')?.value || '500');
  const search = document.getElementById('cat-search')?.value.toLowerCase() || '';
  const sort = document.getElementById('sort-select')?.value || 'default';

  let list = PRODUCTS.filter(p => {
    if (cat && p.category !== cat) return false;
    if (p.rating < minStars) return false;
    if (p.price > maxPrice) return false;
    if (search && !p.name.toLowerCase().includes(search)) return false;
    return true;
  });

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') list.sort((a, b) => b.reviews - a.reviews);

  return list;
}

function filterProducts() { renderCatalog(); }
function updatePriceLabel() {
  const val = document.getElementById('price-range')?.value;
  const label = document.getElementById('price-label');
  if (label) label.textContent = val;
}
function resetFilters() {
  const catRad = document.querySelector('input[name="cat"][value=""]');
  const starsRad = document.querySelector('input[name="stars"][value="0"]');
  const range = document.getElementById('price-range');
  const search = document.getElementById('cat-search');
  if (catRad) catRad.checked = true;
  if (starsRad) starsRad.checked = true;
  if (range) range.value = 500;
  if (search) search.value = '';
  updatePriceLabel();
  filterProducts();
}
function filterCategory(cat) {
  goTo('catalog');
  setTimeout(() => {
    const radio = document.querySelector(`input[name="cat"][value="${cat}"]`);
    if (radio) { radio.checked = true; filterProducts(); }
  }, 100);
}
function handleSearch() {
  const val = document.getElementById('search-input')?.value;
  if (val && val.length > 1) {
    goTo('catalog');
    setTimeout(() => {
      const searchEl = document.getElementById('cat-search');
      if (searchEl) { searchEl.value = val; filterProducts(); }
    }, 100);
  }
}

// ── PRODUCT DETAIL ──────────────────────────────────
function openProduct(id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return;
  currentProduct = { ...p, qty: 1, customName: '', customText: '', color: '#E8698A' };

  const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + p.deadline + 5);
  const dateStr = deliveryDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  const colors = [
    { val: '#E8698A', label: 'Rosa' },
    { val: '#C23B65', label: 'Rosa Forte' },
    { val: '#F4A0B5', label: 'Rosa Claro' },
    { val: '#7B68EE', label: 'Lilás' },
    { val: '#FFD700', label: 'Dourado' },
    { val: '#4A90D9', label: 'Azul' },
    { val: '#98C379', label: 'Verde' },
    { val: '#2C1A24', label: 'Carvão' },
  ];

  document.getElementById('product-detail-content').innerHTML = `
    <div class="pd-image-wrap" id="pd-image">
      ${p.emoji}
      <div class="pd-preview-text" id="pd-preview">Seu nome aqui</div>
    </div>
    <div class="pd-info">
      <p class="pd-breadcrumb"><a href="#" onclick="goTo('catalog')">Catálogo</a> · ${getCatLabel(p.category)}</p>
      <h1 class="pd-name">${p.name}</h1>
      <div class="pd-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
      <div class="pd-rating">${stars} <span>${p.reviews} avaliações</span></div>
      <p class="pd-description">${p.description}</p>

      <div class="pd-customize">
        <p class="pd-section-title">✏️ Personalização</p>
        <div class="form-group">
          <label>Nome ou texto principal</label>
          <input class="pd-input" type="text" placeholder="Ex: Maria & João" id="pd-name-input" oninput="updatePreview(this.value)" maxlength="40" />
        </div>
        <div class="form-group">
          <label>Mensagem adicional (opcional)</label>
          <textarea class="pd-input" rows="2" placeholder="Ex: 15 de março de 2025 · São Paulo" id="pd-text-input" style="resize:vertical;"></textarea>
        </div>
      </div>

      <div>
        <p class="pd-section-title">🎨 Cor/Tema</p>
        <div class="pd-colors">
          ${colors.map((c, i) => `
            <div>
              <input type="radio" name="pd-color" id="col-${i}" class="color-opt" value="${c.val}" ${i === 0 ? 'checked' : ''} onchange="selectColor('${c.val}')" />
              <label for="col-${i}" class="color-label" style="background:${c.val};" title="${c.label}"></label>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pd-deadline">
        <span>⏰</span>
        <div>
          <strong>Prazo de produção: ${p.deadline} dias úteis</strong>
          Estimativa de entrega: até ${dateStr}
        </div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <p class="pd-section-title">Quantidade</p>
        <div class="qty-wrap" style="display:inline-flex;">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <span class="qty-val" id="pd-qty">1</span>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <span style="font-size:0.85rem; color:var(--text-light); margin-left:1rem;" id="pd-subtotal">
          Subtotal: R$ ${p.price.toFixed(2).replace('.', ',')}
        </span>
      </div>

      <div class="pd-actions">
        <button class="btn-primary btn-lg" onclick="addToCartFromDetail()">🛒 Adicionar ao carrinho</button>
        <button class="fav-btn" style="position:static;width:auto;height:auto;border-radius:50px;padding:8px 16px;font-size:1.2rem;" onclick="toggleFavBtn(${p.id}, this)">
          ${favorites.has(p.id) ? '♥' : '♡'}
        </button>
        <a class="btn-whatsapp" href="https://wa.me/5551999999999?text=Olá! Tenho interesse no produto: ${encodeURIComponent(p.name)}" target="_blank">💬 Pedir via WhatsApp</a>
      </div>
    </div>
  `;

  goTo('product');
}

function getCatLabel(cat) {
  const map = { convites: 'Convites', lembrancas: 'Lembranças', infantil: 'Infantil', festa: 'Festas', casamento: 'Casamento', papelaria: 'Papelaria' };
  return map[cat] || cat;
}

function updatePreview(val) {
  const el = document.getElementById('pd-preview');
  if (el) el.textContent = val || 'Seu nome aqui';
  if (currentProduct) currentProduct.customName = val;
}

function selectColor(val) {
  if (currentProduct) currentProduct.color = val;
  const preview = document.getElementById('pd-preview');
  if (preview) preview.style.color = val;
}

function changeQty(delta) {
  if (!currentProduct) return;
  currentProduct.qty = Math.max(1, (currentProduct.qty || 1) + delta);
  const qtyEl = document.getElementById('pd-qty');
  const subEl = document.getElementById('pd-subtotal');
  if (qtyEl) qtyEl.textContent = currentProduct.qty;
  if (subEl) subEl.textContent = `Subtotal: R$ ${(currentProduct.price * currentProduct.qty).toFixed(2).replace('.', ',')}`;
}

function addToCartFromDetail() {
  if (!currentProduct) return;
  const nameInput = document.getElementById('pd-name-input');
  const textInput = document.getElementById('pd-text-input');
  const customName = nameInput?.value || '';
  const customText = textInput?.value || '';

  addToCart({ ...currentProduct, customName, customText });
  showToast(`"${currentProduct.name}" adicionado ao carrinho! 🛒`);
}

// ── CART ──────────────────────────────────
function addToCart(product) {
  const existing = cart.find(i => i.id === product.id && i.customName === product.customName);
  if (existing) {
    existing.qty = (existing.qty || 1) + (product.qty || 1);
  } else {
    cart.push({ ...product, cartId: Date.now(), qty: product.qty || 1 });
  }
  updateAllBadges();
}

function quickAdd(id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  if (p) { addToCart({ ...p, qty: 1, customName: '', customText: '' }); showToast(`"${p.name}" adicionado! 🛒`); }
}

function updateAllBadges() {
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = total);
}

function removeFromCart(cartId) {
  cart = cart.filter(i => i.cartId !== cartId);
  updateAllBadges();
  renderCart();
}

function changeCartQty(cartId, delta) {
  const item = cart.find(i => i.cartId === cartId);
  if (item) {
    item.qty = Math.max(1, (item.qty || 1) + delta);
    renderCart();
    updateAllBadges();
  }
}

function getCartTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const frete = subtotal > 150 ? 0 : 15.90;
  const total = subtotal + frete;
  return { subtotal, frete, total };
}

function renderCart() {
  const listEl = document.getElementById('cart-items-list');
  const summEl = document.getElementById('cart-summary');
  if (!listEl || !summEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione produtos para continuar</p>
        <button class="btn-primary" onclick="goTo('catalog')">Explorar produtos</button>
      </div>`;
    summEl.innerHTML = '';
    return;
  }

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-img">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        ${item.customName ? `<div class="ci-custom">✏️ Personalização: "${item.customName}"</div>` : ''}
        <div class="ci-price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</div>
      </div>
      <div class="ci-actions">
        <div class="qty-wrap">
          <button class="qty-btn" onclick="changeCartQty(${item.cartId}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeCartQty(${item.cartId}, 1)">+</button>
        </div>
        <button class="ci-remove" onclick="removeFromCart(${item.cartId})">✕ Remover</button>
      </div>
    </div>
  `).join('');

  const { subtotal, frete, total } = getCartTotals();
  summEl.innerHTML = `
    <h3 class="cs-title">Resumo do pedido</h3>
    <div class="cs-row"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span></div>
    <div class="cs-row"><span>Frete</span><span>${frete === 0 ? '🎉 Grátis' : 'R$ ' + frete.toFixed(2).replace('.', ',')}</span></div>
    ${frete > 0 ? `<div style="font-size:0.78rem;color:var(--text-light);margin-bottom:1rem;">Frete grátis acima de R$ 150,00</div>` : ''}
    <div class="cs-row total"><span>Total</span><span>R$ ${total.toFixed(2).replace('.', ',')}</span></div>
    <button class="btn-primary btn-full" style="margin-top:1.5rem;" onclick="goTo('checkout')">Finalizar pedido →</button>
    <a class="btn-whatsapp btn-full" style="margin-top:0.75rem; justify-content:center;" href="${getWhatsAppLink()}" target="_blank">💬 Finalizar pelo WhatsApp</a>
  `;
}

function getWhatsAppLink() {
  const { total } = getCartTotals();
  const items = cart.map(i => `• ${i.qty}x ${i.name}${i.customName ? ` (${i.customName})` : ''}`).join('%0A');
  const msg = `Olá! Gostaria de finalizar meu pedido:%0A%0A${items}%0A%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}`;
  return `https://wa.me/5551999999999?text=${msg}`;
}

// ── CHECKOUT ──────────────────────────────────
function renderCheckoutSummary() {
  const el = document.getElementById('checkout-summary');
  if (!el) return;
  const { subtotal, frete, total } = getCartTotals();

  el.innerHTML = `
    <h3 class="cs-title">📋 Seu pedido</h3>
    ${cart.map(i => `
      <div style="display:flex;justify-content:space-between;font-size:0.88rem;color:var(--text-mid);margin-bottom:0.5rem;">
        <span>${i.qty}x ${i.name}${i.customName ? ` <em style="font-size:0.8rem">(${i.customName})</em>` : ''}</span>
        <span>R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')}</span>
      </div>
    `).join('')}
    <div class="cs-row" style="margin-top:1rem;"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span></div>
    <div class="cs-row"><span>Frete</span><span>${frete === 0 ? 'Grátis' : 'R$ ' + frete.toFixed(2).replace('.', ',')}</span></div>
    <div class="cs-row total"><span>Total</span><span>R$ ${total.toFixed(2).replace('.', ',')}</span></div>
    <button class="btn-primary btn-full" style="margin-top:1.5rem;" onclick="placeOrder()">✓ Confirmar pedido</button>
    <a class="btn-whatsapp btn-full" style="margin-top:0.75rem;justify-content:center;" href="${getWhatsAppLink()}" target="_blank">💬 Pedir pelo WhatsApp</a>
    <p style="font-size:0.75rem;color:var(--text-light);text-align:center;margin-top:1rem;">🔒 Pagamento 100% seguro</p>
  `;
}

function togglePayment() {
  const val = document.querySelector('input[name="payment"]:checked')?.value;
  const creditFields = document.getElementById('credit-fields');
  if (creditFields) creditFields.style.display = val === 'credit' ? 'block' : 'none';
}

function placeOrder() {
  const orderNum = Math.floor(Math.random() * 90000) + 10000;
  document.getElementById('order-num').textContent = orderNum;
  cart = [];
  updateAllBadges();
  goTo('success');
}

// ── FAVORITES ──────────────────────────────────
function toggleFav(event, id) {
  event.stopPropagation();
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  // re-render current grid
  if (currentPage === 'home') { renderFeatured(); renderBestsellers(); }
  else if (currentPage === 'catalog') renderCatalog();
  else if (currentPage === 'favorites') renderFavorites();
  showToast(favorites.has(id) ? '♥ Adicionado aos favoritos!' : '♡ Removido dos favoritos');
}

function toggleFavBtn(id, btn) {
  if (favorites.has(id)) { favorites.delete(id); btn.textContent = '♡'; }
  else { favorites.add(id); btn.textContent = '♥'; }
  showToast(favorites.has(id) ? '♥ Adicionado aos favoritos!' : '♡ Removido dos favoritos');
}

function renderFavorites() {
  const el = document.getElementById('favorites-grid');
  if (!el) return;
  const favs = PRODUCTS.filter(p => favorites.has(p.id));
  el.innerHTML = favs.length
    ? favs.map(p => createCard(p)).join('')
    : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">♡</div><h3>Nenhum favorito ainda</h3><p>Explore o catálogo e salve o que amar</p><button class="btn-primary" onclick="goTo('catalog')">Explorar produtos</button></div>`;
}

// ── TOAST ──────────────────────────────────
let toastTimeout;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('show'), 3000);
}

// ── INIT ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  goTo('login');
  updatePriceLabel();
});