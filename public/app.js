// ============================================================
// AgroMarket Amravati - Frontend Application (index.html)
// ============================================================

const API = '';
const ENCRYPTION_KEY = 'agromarket_e2e_encryption_key_256bit!';
let token = localStorage.getItem('agromarket_token');
let currentUser = JSON.parse(localStorage.getItem('agromarket_user') || 'null');
let cart = JSON.parse(localStorage.getItem('agromarket_cart') || '[]');
let allProducts = [];
let currentFilter = 'all';
let leafletMap = null;

// Categories
const CATEGORIES = [
  { id: 'crops', name: 'Crops', icon: '🌾', color: '#e6a817' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', color: '#4caf50' },
  { id: 'fruits', name: 'Fruits', icon: '🍊', color: '#ff9800' },
  { id: 'grains', name: 'Grains & Cereals', icon: '🌽', color: '#c6893f' },
  { id: 'pulses', name: 'Pulses & Lentils', icon: '🫘', color: '#8d6e63' },
  { id: 'spices', name: 'Spices', icon: '🌶️', color: '#e53935' },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛', color: '#90caf9' },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻', color: '#fdd835' },
];

const MARKET_LOCATIONS = [
  { name: 'Amravati Main Mandi (APMC)', lat: 20.9320, lng: 77.7523, type: 'main', description: 'Central agricultural produce market committee.', timings: '6:00 AM - 6:00 PM' },
  { name: 'Cotton Market Yard', lat: 20.9370, lng: 77.7620, type: 'cotton', description: 'Dedicated cotton trading market.', timings: '7:00 AM - 5:00 PM' },
  { name: 'Fruit & Vegetable Market', lat: 20.9280, lng: 77.7450, type: 'fruit', description: 'Fresh fruits and vegetables wholesale market.', timings: '4:00 AM - 2:00 PM' },
  { name: 'Grain Market (Dhanya Bazaar)', lat: 20.9350, lng: 77.7490, type: 'grain', description: 'Wholesale grain and cereals market.', timings: '8:00 AM - 6:00 PM' },
  { name: 'Rajkamal Chowk Market', lat: 20.9300, lng: 77.7550, type: 'general', description: 'Mixed market with spices, pulses.', timings: '7:00 AM - 9:00 PM' },
  { name: 'Achalpur Mandi', lat: 21.2560, lng: 77.5110, type: 'main', description: 'Sub-district market in Achalpur.', timings: '6:00 AM - 5:00 PM' },
  { name: 'Morshi Agricultural Market', lat: 21.3000, lng: 78.0100, type: 'main', description: 'Agricultural market in Morshi taluka.', timings: '7:00 AM - 4:00 PM' },
  { name: 'Paratwada Market', lat: 21.2650, lng: 77.5230, type: 'general', description: 'Local market in Paratwada.', timings: '6:00 AM - 8:00 PM' },
  { name: 'Warud Farmers Market', lat: 21.4720, lng: 78.2700, type: 'fruit', description: 'Orange orchards and citrus fruit trading.', timings: '6:00 AM - 4:00 PM' },
  { name: 'Daryapur Oilseed Market', lat: 20.9200, lng: 77.3300, type: 'oilseed', description: 'Hub for soybean and oilseeds.', timings: '7:00 AM - 5:00 PM' },
];

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  renderAuthNav();
  renderCategories();
  renderShopFilters();
  loadProducts();
  updateCartBadge();
  initNavbarScroll();
  initMap();
});

// ---- Encryption ----
function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

// ---- API Helper ----
async function apiFetch(url, opts = {}) {
  opts.headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + url, opts);
  return res.json();
}

// ---- Toast ----
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${msg}`;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ---- Auth Nav ----
function renderAuthNav() {
  const auth = document.getElementById('navAuth');
  if (currentUser) {
    const init = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    auth.innerHTML = `
      <a class="user-menu" href="/dashboard" style="text-decoration:none;color:inherit">
        <div class="user-avatar">${init}</div>
        <span class="user-name">${currentUser.name.split(' ')[0]}</span>
      </a>
      <button class="btn-logout" onclick="logout()">Logout</button>`;
  } else {
    auth.innerHTML = `<a href="/auth" class="btn-login" style="text-decoration:none">Login / Register</a>`;
  }
}

function logout() {
  localStorage.removeItem('agromarket_token');
  localStorage.removeItem('agromarket_user');
  token = null; currentUser = null;
  renderAuthNav();
  showToast('Logged out', 'info');
}

function goToCart() {
  if (!currentUser) { showToast('Please login first', 'info'); window.location.href = '/auth'; return; }
  window.location.href = '/dashboard';
}

// ---- Navbar Scroll ----
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ---- Sections ----
function showSection(id) {
  const el = document.getElementById('section-' + id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ---- Categories ----
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" style="--cat-color:${cat.color}" onclick="filterByCategory('${cat.id}')">
      <span class="category-icon">${cat.icon}</span>
      <div class="category-name">${cat.name}</div>
      <div class="category-count" id="cat-count-${cat.id}">Loading...</div>
    </div>`).join('');
}

function filterByCategory(catId) {
  currentFilter = catId;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === catId));
  showSection('shop');
  loadProducts();
}

// ---- Products ----
function renderShopFilters() {
  const div = document.getElementById('shopFilters');
  let html = `<button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>`;
  CATEGORIES.forEach(cat => {
    html += `<button class="filter-btn" data-filter="${cat.id}" onclick="setFilter('${cat.id}')">${cat.icon} ${cat.name}</button>`;
  });
  div.innerHTML = html;
}

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === f));
  loadProducts();
}

async function loadProducts() {
  const search = document.getElementById('shopSearchInput')?.value || '';
  const params = new URLSearchParams();
  if (currentFilter !== 'all') params.set('category', currentFilter);
  if (search) params.set('search', search);

  try {
    const res = await apiFetch('/api/products?' + params.toString());
    if (res.success) {
      allProducts = res.products;
      renderProducts(res.products);
      // Update stats
      document.getElementById('statProducts').textContent = res.count + '+';
      // Update category counts
      if (currentFilter === 'all' && !search) {
        CATEGORIES.forEach(cat => {
          const count = res.products.filter(p => p.category === cat.id).length;
          const el = document.getElementById('cat-count-' + cat.id);
          if (el) el.textContent = count + ' products';
        });
      }
    }
  } catch (err) {
    document.getElementById('shopGrid').innerHTML = '<div class="no-products">Error loading products. Is the server running?</div>';
  }
}

function renderProducts(products) {
  const grid = document.getElementById('shopGrid');
  if (products.length === 0) {
    grid.innerHTML = '<div class="no-products">😔 No products found.</div>';
    return;
  }
  grid.innerHTML = products.map(p => {
    const inCart = cart.find(c => c.productId === p._id);
    const stars = '⭐'.repeat(Math.floor(p.rating));
    const estDays = 3;
    const estDate = new Date(Date.now() + estDays*24*60*60*1000).toLocaleDateString('en-IN', {day:'numeric', month:'short'});
    return `
      <div class="product-card">
        <div class="product-image"><span>${p.emoji}</span>
          ${p.rating >= 4.7 ? '<span class="product-badge">⭐ Top Rated</span>' : ''}
          ${p.stock <= 0 ? '<span class="product-badge" style="background:var(--error)">Out of Stock</span>' : ''}
        </div>
        <div class="product-info">
          <div class="product-seller">👤 ${p.sellerName}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-location">📍 ${p.location}</div>
          <div style="font-size:0.8rem;color:var(--success);margin-bottom:8px">📦 Est. delivery: ${estDate}</div>
          <div class="product-meta">
            <div><div class="product-price">₹${p.price.toLocaleString('en-IN')}</div><div class="product-unit">per ${p.unit}</div></div>
            <div><div class="product-rating">${stars} ${p.rating}</div><div style="font-size:0.75rem;color:var(--text-muted)">Stock: ${p.stock}</div></div>
          </div>
          <button class="btn-add-cart ${inCart ? 'added' : ''}" onclick="addToCart('${p._id}')" id="btn-${p._id}" ${p.stock<=0?'disabled style="opacity:0.5;cursor:not-allowed"':''}>
            ${p.stock <= 0 ? 'Out of Stock' : inCart ? '✓ In Cart' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>`;
  }).join('');
}

// ---- Cart ----
function addToCart(productId) {
  if (!currentUser) { showToast('Please login first', 'info'); window.location.href = '/auth'; return; }
  const product = allProducts.find(p => p._id === productId);
  if (!product || product.stock <= 0) { showToast('Product out of stock', 'error'); return; }

  const existing = cart.find(c => c.productId === productId);
  if (existing) {
    if (existing.qty >= product.stock) { showToast('Maximum stock reached', 'error'); return; }
    existing.qty++;
    showToast('Quantity updated!', 'success');
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      emoji: product.emoji,
      sellerName: product.sellerName,
      location: product.location,
      qty: 1
    });
    showToast('Added to cart! 🛒', 'success');
  }
  saveCart();
  updateCartBadge();
  const btn = document.getElementById('btn-' + productId);
  if (btn) { btn.classList.add('added'); btn.textContent = '✓ In Cart'; }
}

function saveCart() { localStorage.setItem('agromarket_cart', JSON.stringify(cart)); }
function updateCartBadge() {
  const b = document.getElementById('cartBadge');
  const c = cart.reduce((s, i) => s + i.qty, 0);
  if (b) { b.textContent = c; b.style.display = c > 0 ? 'inline' : 'none'; }
}

// ---- Hero Search ----
function heroSearchAction() {
  const q = document.getElementById('heroSearch').value.trim();
  if (q) {
    currentFilter = 'all';
    const input = document.getElementById('shopSearchInput');
    if (input) input.value = q;
    loadProducts();
    showSection('shop');
  }
}

// ---- Contact Form ----
function submitContactForm(e) {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon.', 'success');
  e.target.reset();
}

// ---- Map ----
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl || leafletMap) return;

  leafletMap = L.map('map').setView([20.9320, 77.7523], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 18
  }).addTo(leafletMap);

  const colors = { main: '#e53935', cotton: '#ff9800', fruit: '#43a047', grain: '#ff9800', general: '#42a5f5', oilseed: '#ff9800' };

  MARKET_LOCATIONS.forEach(loc => {
    const color = colors[loc.type] || '#42a5f5';
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:28px;height:28px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
      iconSize: [28, 28], iconAnchor: [14, 14]
    });
    L.marker([loc.lat, loc.lng], { icon }).addTo(leafletMap)
      .bindPopup(`<div style="font-family:'Inter',sans-serif"><h4 style="margin:0 0 6px;color:#1b5e20">${loc.name}</h4><p style="margin:0 0 4px;font-size:0.85rem;color:#555">${loc.description}</p><p style="margin:0;font-size:0.8rem;color:#888">🕐 ${loc.timings}</p></div>`);
  });

  L.circle([20.9320, 77.7523], { radius: 25000, color: 'rgba(76,175,80,0.4)', fillColor: 'rgba(76,175,80,0.05)', fillOpacity: 0.3, weight: 2 }).addTo(leafletMap);
  setTimeout(() => leafletMap.invalidateSize(), 300);
}
