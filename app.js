// ============================================================
// AgroMarket Amravati - Main Application Logic
// ============================================================

// ---- State Management ----
let currentPage = 'home';
let cart = JSON.parse(localStorage.getItem('agromarket_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('agromarket_user') || 'null');
let users = JSON.parse(localStorage.getItem('agromarket_users') || '[]');
let orders = JSON.parse(localStorage.getItem('agromarket_orders') || '[]');
let userProducts = JSON.parse(localStorage.getItem('agromarket_user_products') || '[]');
let allProducts = [...PRODUCTS, ...userProducts];
let currentFilter = 'all';
let currentSearchQuery = '';
let checkoutStep = 1;
let selectedPaymentMethod = null;
let leafletMap = null;

// ---- Initialize App ----
document.addEventListener('DOMContentLoaded', () => {
  renderAuthNav();
  renderCategories();
  renderFeaturedProducts();
  renderShopFilters();
  renderShopProducts();
  updateCartBadge();
  initNavbarScroll();
  populateSellCategories();
});

// ---- Navigation ----
function navigate(page) {
  // Auth check for protected pages
  if (['sell', 'cart', 'orders', 'checkout'].includes(page) && !currentUser) {
    showToast('Please login first to access this feature', 'info');
    page = 'auth';
  }

  const pages = document.querySelectorAll('[id^="page-"]');
  pages.forEach(p => p.classList.add('hidden'));

  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }

  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  currentPage = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Page-specific initializations
  if (page === 'map') {
    setTimeout(() => initMap(), 100);
  }
  if (page === 'cart') {
    renderCart();
  }
  if (page === 'orders') {
    renderOrders();
  }
  if (page === 'shop') {
    renderShopProducts();
  }
  if (page === 'checkout') {
    checkoutStep = 1;
    renderCheckout();
  }

  // Close mobile nav
  document.getElementById('navLinks')?.classList.remove('show');
}

function toggleMobileNav() {
  document.getElementById('navLinks')?.classList.toggle('show');
}

function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- Auth System ----
function renderAuthNav() {
  const authDiv = document.getElementById('navAuth');
  if (currentUser) {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
    authDiv.innerHTML = `
      <div class="user-menu" onclick="navigate('orders')">
        <div class="user-avatar">${initials}</div>
        <span class="user-name">${currentUser.name.split(' ')[0]}</span>
      </div>
      <button class="btn-logout" onclick="handleLogout()">Logout</button>
    `;
  } else {
    authDiv.innerHTML = `<button class="btn-login" onclick="navigate('auth')">Login / Register</button>`;
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('agromarket_user', JSON.stringify(user));
    renderAuthNav();
    showToast(`Welcome back, ${user.name}! 🌾`, 'success');
    navigate('home');
  } else {
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = 'Invalid email or password. Please try again or register.';
    errorEl.classList.add('show');
    setTimeout(() => errorEl.classList.remove('show'), 4000);
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const role = document.getElementById('regRole').value;
  const location = document.getElementById('regLocation').value.trim();
  const errorEl = document.getElementById('registerError');

  // Validation
  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match!';
    errorEl.classList.add('show');
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters!';
    errorEl.classList.add('show');
    return;
  }
  if (users.find(u => u.email === email)) {
    errorEl.textContent = 'An account with this email already exists!';
    errorEl.classList.add('show');
    return;
  }

  const newUser = {
    id: Date.now(),
    name, email, phone, password, role, location,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('agromarket_users', JSON.stringify(users));

  currentUser = newUser;
  localStorage.setItem('agromarket_user', JSON.stringify(newUser));

  renderAuthNav();
  showToast(`Welcome to AgroMarket, ${name}! 🎉`, 'success');
  navigate('home');
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('agromarket_user');
  renderAuthNav();
  showToast('Logged out successfully', 'info');
  navigate('home');
}

// ---- Categories ----
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = CATEGORIES.map(cat => {
    const count = allProducts.filter(p => p.category === cat.id).length;
    return `
      <div class="category-card" style="--cat-color: ${cat.color}" onclick="shopByCategory('${cat.id}')">
        <span class="category-icon">${cat.icon}</span>
        <div class="category-name">${cat.name}</div>
        <div class="category-count">${count} products</div>
      </div>
    `;
  }).join('');
}

function shopByCategory(categoryId) {
  currentFilter = categoryId;
  navigate('shop');
  setTimeout(() => {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === categoryId);
    });
    renderShopProducts();
  }, 50);
}

// ---- Products ----
function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  const featured = allProducts.filter(p => p.rating >= 4.5).slice(0, 8);
  grid.innerHTML = featured.map(p => createProductCard(p)).join('');
}

function renderShopFilters() {
  const filtersDiv = document.getElementById('shopFilters');
  let html = `<button class="filter-btn active" data-filter="all" onclick="setFilter('all')">All</button>`;
  CATEGORIES.forEach(cat => {
    html += `<button class="filter-btn" data-filter="${cat.id}" onclick="setFilter('${cat.id}')">${cat.icon} ${cat.name}</button>`;
  });
  filtersDiv.innerHTML = html;
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderShopProducts();
}

function filterProducts() {
  currentSearchQuery = document.getElementById('shopSearchInput').value.toLowerCase();
  renderShopProducts();
}

function renderShopProducts() {
  const grid = document.getElementById('shopGrid');
  let filtered = [...allProducts];

  if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilter);
  }
  if (currentSearchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(currentSearchQuery) ||
      p.seller.toLowerCase().includes(currentSearchQuery) ||
      p.location.toLowerCase().includes(currentSearchQuery) ||
      p.category.toLowerCase().includes(currentSearchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-products">😔 No products found. Try a different search or category.</div>`;
  } else {
    grid.innerHTML = filtered.map(p => createProductCard(p)).join('');
  }
}

function createProductCard(product) {
  const inCart = cart.find(c => c.id === product.id);
  const stars = '⭐'.repeat(Math.floor(product.rating));
  return `
    <div class="product-card">
      <div class="product-image">
        <span>${product.emoji}</span>
        ${product.rating >= 4.7 ? '<span class="product-badge">⭐ Top Rated</span>' : ''}
      </div>
      <div class="product-info">
        <div class="product-seller">👤 ${product.seller}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-location">📍 ${product.location}</div>
        <div class="product-meta">
          <div>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
            <div class="product-unit">per ${product.unit}</div>
          </div>
          <div class="product-rating">${stars} ${product.rating}</div>
        </div>
        <button class="btn-add-cart ${inCart ? 'added' : ''}" onclick="addToCart(${product.id})" id="btn-cart-${product.id}">
          ${inCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  `;
}

// ---- Cart System ----
function addToCart(productId) {
  if (!currentUser) {
    showToast('Please login to add items to cart', 'info');
    navigate('auth');
    return;
  }

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
    showToast('Quantity updated! 🛒', 'success');
  } else {
    cart.push({ id: productId, qty: 1 });
    showToast('Added to cart! 🛒', 'success');
  }

  saveCart();
  updateCartBadge();

  // Update button
  const btn = document.getElementById(`btn-cart-${productId}`);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✓ Added to Cart';
  }
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('Item removed from cart', 'info');
}

function updateQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('agromarket_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'inline' : 'none';
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const container = document.getElementById('cartContent');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <button class="btn-shop-now" onclick="navigate('shop')">Start Shopping</button>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const delivery = subtotal > 2000 ? 0 : 99;
  const total = subtotal + delivery;

  let itemsHtml = cart.map(cartItem => {
    const p = allProducts.find(pr => pr.id === cartItem.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-emoji">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-seller">by ${p.seller} • ${p.location}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty(${p.id}, -1)">−</button>
          <span class="qty-value">${cartItem.qty}</span>
          <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
        </div>
        <div class="cart-item-price">₹${(p.price * cartItem.qty).toLocaleString('en-IN')}</div>
        <button class="btn-remove" onclick="removeFromCart(${p.id})" title="Remove">🗑️</button>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="cart-container">
      <div class="cart-items">${itemsHtml}</div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal (${cart.reduce((s, c) => s + c.qty, 0)} items)</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="summary-row">
          <span>Delivery</span>
          <span>${delivery === 0 ? '<span style="color: var(--success)">FREE</span>' : '₹' + delivery}</span>
        </div>
        ${delivery === 0 ? '' : '<div class="summary-row" style="font-size:0.8rem; color: var(--text-muted)">Free delivery on orders above ₹2,000</div>'}
        <div class="summary-row total">
          <span>Total</span>
          <span>₹${total.toLocaleString('en-IN')}</span>
        </div>
        <button class="btn-checkout" onclick="navigate('checkout')">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  `;
}

// ---- Checkout & Payment ----
function renderCheckout() {
  const container = document.getElementById('checkoutContainer');
  const subtotal = getCartTotal();
  const delivery = subtotal > 2000 ? 0 : 99;
  const total = subtotal + delivery;

  // Step indicators
  let stepsHtml = `
    <div class="checkout-steps">
      <div class="checkout-step ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}">
        <div class="step-number">${checkoutStep > 1 ? '✓' : '1'}</div>
        <span class="step-label">Address</span>
      </div>
      <div class="checkout-step ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'completed' : ''}">
        <div class="step-number">${checkoutStep > 2 ? '✓' : '2'}</div>
        <span class="step-label">Payment</span>
      </div>
      <div class="checkout-step ${checkoutStep >= 3 ? 'active' : ''}">
        <div class="step-number">3</div>
        <span class="step-label">Confirmation</span>
      </div>
    </div>
  `;

  let formHtml = '';

  if (checkoutStep === 1) {
    // Address Step
    formHtml = `
      <div class="checkout-form-panel">
        <h3>📍 Delivery Address</h3>
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="checkoutName" value="${currentUser?.name || ''}" placeholder="Enter full name" required>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="checkoutPhone" value="${currentUser?.phone || ''}" placeholder="Enter phone number" required>
        </div>
        <div class="form-group">
          <label>Address Line 1</label>
          <input type="text" id="checkoutAddr1" placeholder="House/Building No., Street name" required>
        </div>
        <div class="form-group">
          <label>Address Line 2</label>
          <input type="text" id="checkoutAddr2" placeholder="Area, Landmark">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" id="checkoutCity" value="Amravati" placeholder="City">
          </div>
          <div class="form-group">
            <label>Pincode</label>
            <input type="text" id="checkoutPincode" placeholder="444601" maxlength="6">
          </div>
        </div>
        <div class="form-group">
          <label>State</label>
          <input type="text" id="checkoutState" value="Maharashtra" placeholder="State">
        </div>
        <div class="checkout-actions">
          <button class="btn-back" onclick="navigate('cart')">← Back to Cart</button>
          <button class="btn-next" onclick="nextCheckoutStep()">Continue to Payment →</button>
        </div>
      </div>
    `;
  } else if (checkoutStep === 2) {
    // Payment Step
    formHtml = `
      <div class="checkout-form-panel">
        <h3>💳 Select Payment Method</h3>
        <div class="payment-methods" id="paymentMethods">
          ${PAYMENT_METHODS.map(pm => `
            <div class="payment-method" data-method="${pm.id}" onclick="selectPaymentMethod('${pm.id}')">
              <div class="payment-method-icon">${pm.icon}</div>
              <div class="payment-method-info">
                <h4>${pm.name}</h4>
                <p>${pm.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Payment forms (shown based on selection) -->
        <div id="paymentFormArea"></div>

        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 20px; margin-top: 20px;">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>
          </div>
          <div class="summary-row total">
            <span>Total to Pay</span>
            <span>₹${total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="checkout-actions">
          <button class="btn-back" onclick="prevCheckoutStep()">← Back to Address</button>
          <button class="btn-pay" id="btnPay" onclick="processPayment()" style="flex:1; display:none;">
            Pay ₹${total.toLocaleString('en-IN')} →
          </button>
        </div>
      </div>
    `;
  } else if (checkoutStep === 3) {
    // Confirmation
    const orderId = 'AGM' + Date.now().toString().slice(-8);
    const order = {
      id: orderId,
      items: cart.map(c => {
        const p = allProducts.find(pr => pr.id === c.id);
        return { ...p, qty: c.qty };
      }),
      total,
      subtotal,
      delivery,
      paymentMethod: selectedPaymentMethod,
      status: selectedPaymentMethod === 'cod' ? 'confirmed' : 'processing',
      date: new Date().toISOString(),
      userId: currentUser?.id
    };

    orders.push(order);
    localStorage.setItem('agromarket_orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();
    updateCartBadge();

    const pmLabel = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)?.name || 'N/A';

    formHtml = `
      <div class="checkout-form-panel">
        <div class="order-success">
          <div class="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p class="order-id">Order ID: <strong>${orderId}</strong></p>
          <div class="order-details-card">
            <div class="order-detail-row">
              <span class="label">Items</span>
              <span class="value">${order.items.length} products</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Payment</span>
              <span class="value">${pmLabel}</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Status</span>
              <span class="value" style="color: var(--success)">${selectedPaymentMethod === 'cod' ? 'Confirmed' : 'Payment Processing'}</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Total Amount</span>
              <span class="value" style="color: var(--accent); font-size: 1.2rem;">₹${total.toLocaleString('en-IN')}</span>
            </div>
            <div class="order-detail-row">
              <span class="label">Estimated Delivery</span>
              <span class="value">2-4 Business Days</span>
            </div>
          </div>
          <button class="btn-continue" onclick="navigate('orders')">View My Orders →</button>
          <button class="btn-continue" onclick="navigate('shop')" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-primary); margin-left: 12px;">Continue Shopping</button>
        </div>
      </div>
    `;
  }

  container.innerHTML = stepsHtml + formHtml;
}

function nextCheckoutStep() {
  if (checkoutStep === 1) {
    // Validate address
    const name = document.getElementById('checkoutName')?.value.trim();
    const phone = document.getElementById('checkoutPhone')?.value.trim();
    const addr1 = document.getElementById('checkoutAddr1')?.value.trim();
    const city = document.getElementById('checkoutCity')?.value.trim();
    const pincode = document.getElementById('checkoutPincode')?.value.trim();

    if (!name || !phone || !addr1 || !city || !pincode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
  }
  checkoutStep++;
  renderCheckout();
}

function prevCheckoutStep() {
  checkoutStep = Math.max(1, checkoutStep - 1);
  renderCheckout();
}

function selectPaymentMethod(methodId) {
  selectedPaymentMethod = methodId;
  document.querySelectorAll('.payment-method').forEach(el => {
    el.classList.toggle('selected', el.dataset.method === methodId);
  });

  // Show payment form
  const formArea = document.getElementById('paymentFormArea');
  const payBtn = document.getElementById('btnPay');
  payBtn.style.display = 'block';

  if (methodId === 'upi') {
    formArea.innerHTML = `
      <div class="upi-form">
        <div class="form-group">
          <label>UPI ID</label>
          <input type="text" id="upiId" placeholder="yourname@upi or phone@paytm">
        </div>
      </div>
    `;
  } else if (methodId === 'card') {
    formArea.innerHTML = `
      <div class="card-form">
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5">
          </div>
          <div class="form-group">
            <label>CVV</label>
            <input type="password" id="cardCvv" placeholder="***" maxlength="3">
          </div>
        </div>
        <div class="form-group">
          <label>Cardholder Name</label>
          <input type="text" id="cardName" placeholder="Name on card">
        </div>
      </div>
    `;
  } else if (methodId === 'netbanking') {
    formArea.innerHTML = `
      <div class="netbanking-form">
        <div class="form-group">
          <label>Select Bank</label>
          <select id="bankSelect">
            <option value="">Choose your bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="kotak">Kotak Mahindra Bank</option>
            <option value="bob">Bank of Baroda</option>
            <option value="pnb">Punjab National Bank</option>
            <option value="bom">Bank of Maharashtra</option>
          </select>
        </div>
      </div>
    `;
  } else if (methodId === 'cod') {
    formArea.innerHTML = `
      <div style="padding: 20px; background: rgba(102,187,106,0.1); border-radius: var(--radius-md); border: 1px solid rgba(102,187,106,0.3); margin-top: 16px;">
        <p style="color: var(--success); font-weight: 600;">💵 Cash on Delivery Selected</p>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Pay with cash when your order is delivered. Please keep exact change ready.</p>
      </div>
    `;
  }
}

function processPayment() {
  if (!selectedPaymentMethod) {
    showToast('Please select a payment method', 'error');
    return;
  }

  // Validation for specific methods
  if (selectedPaymentMethod === 'upi') {
    const upiId = document.getElementById('upiId')?.value.trim();
    if (!upiId) {
      showToast('Please enter your UPI ID', 'error');
      return;
    }
  } else if (selectedPaymentMethod === 'card') {
    const cardNum = document.getElementById('cardNumber')?.value.trim();
    const expiry = document.getElementById('cardExpiry')?.value.trim();
    const cvv = document.getElementById('cardCvv')?.value.trim();
    if (!cardNum || !expiry || !cvv) {
      showToast('Please fill all card details', 'error');
      return;
    }
  } else if (selectedPaymentMethod === 'netbanking') {
    const bank = document.getElementById('bankSelect')?.value;
    if (!bank) {
      showToast('Please select your bank', 'error');
      return;
    }
  }

  // Show processing animation
  showProcessing();

  setTimeout(() => {
    hideProcessing();
    checkoutStep = 3;
    renderCheckout();
  }, 2500);
}

function showProcessing() {
  const overlay = document.createElement('div');
  overlay.className = 'processing-overlay';
  overlay.id = 'processingOverlay';
  overlay.innerHTML = `
    <div class="spinner"></div>
    <div class="processing-text">Processing your payment...</div>
    <p style="color: var(--text-muted); font-size: 0.9rem;">Please wait while we confirm your transaction</p>
  `;
  document.body.appendChild(overlay);
}

function hideProcessing() {
  const overlay = document.getElementById('processingOverlay');
  if (overlay) overlay.remove();
}

// ---- Sell Products ----
function populateSellCategories() {
  const select = document.getElementById('sellCategory');
  if (!select) return;
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.icon} ${cat.name}`;
    select.appendChild(opt);
  });
}

function submitProduct() {
  if (!currentUser) {
    showToast('Please login to list products', 'info');
    navigate('auth');
    return;
  }

  const name = document.getElementById('sellName').value.trim();
  const category = document.getElementById('sellCategory').value;
  const price = parseFloat(document.getElementById('sellPrice').value);
  const unit = document.getElementById('sellUnit').value;
  const stock = parseInt(document.getElementById('sellStock').value);
  const location = document.getElementById('sellLocation').value.trim();
  const description = document.getElementById('sellDescription').value.trim();

  if (!name || !category || !price || !stock || !location) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const catData = CATEGORIES.find(c => c.id === category);
  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    unit,
    emoji: catData?.icon || '📦',
    seller: currentUser.name,
    location,
    rating: 4.0,
    stock,
    description: description || `Fresh ${name} from ${location}.`
  };

  userProducts.push(newProduct);
  allProducts.push(newProduct);
  localStorage.setItem('agromarket_user_products', JSON.stringify(userProducts));

  showToast(`"${name}" listed successfully! 🎉`, 'success');

  // Reset form
  document.getElementById('sellName').value = '';
  document.getElementById('sellCategory').value = '';
  document.getElementById('sellPrice').value = '';
  document.getElementById('sellStock').value = '';
  document.getElementById('sellLocation').value = '';
  document.getElementById('sellDescription').value = '';

  renderCategories();
}

// ---- Orders ----
function renderOrders() {
  const container = document.getElementById('ordersList');
  const userOrders = orders.filter(o => o.userId === currentUser?.id);

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">📋</div>
        <p>No orders yet</p>
        <button class="btn-shop-now" onclick="navigate('shop')">Start Shopping</button>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.reverse().map(order => {
    const date = new Date(order.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const pmLabel = PAYMENT_METHODS.find(m => m.id === order.paymentMethod)?.name || 'N/A';

    return `
      <div class="order-card">
        <div class="order-card-header">
          <div>
            <strong>Order #${order.id}</strong>
            <p style="color: var(--text-muted); font-size: 0.85rem;">${date}</p>
          </div>
          <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        <div class="order-items-list">
          ${order.items.map(item => `
            <span class="order-item-chip">${item.emoji} ${item.name} × ${item.qty}</span>
          `).join('')}
        </div>
        <div class="order-card-footer">
          <span style="font-size: 0.9rem; color: var(--text-muted);">Payment: ${pmLabel}</span>
          <span class="order-total">₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ---- Map ----
function initMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  // Destroy existing map if any
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map('map').setView([20.9320, 77.7523], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(leafletMap);

  // Marker colors
  const markerColors = {
    main: '#e53935',
    cotton: '#ff9800',
    fruit: '#43a047',
    grain: '#ff9800',
    general: '#42a5f5',
    oilseed: '#ff9800'
  };

  MARKET_LOCATIONS.forEach(loc => {
    const color = markerColors[loc.type] || '#42a5f5';

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width: 28px; height: 28px;
        background: ${color};
        border: 3px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker([loc.lat, loc.lng], { icon })
      .addTo(leafletMap)
      .bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 6px; font-size: 1rem; color: #1b5e20;">${loc.name}</h4>
          <p style="margin: 0 0 4px; font-size: 0.85rem; color: #555;">${loc.description}</p>
          <p style="margin: 0; font-size: 0.8rem; color: #888;">🕐 ${loc.timings}</p>
        </div>
      `);
  });

  // Amravati district boundary marker
  L.circle([20.9320, 77.7523], {
    radius: 25000,
    color: 'rgba(76, 175, 80, 0.4)',
    fillColor: 'rgba(76, 175, 80, 0.05)',
    fillOpacity: 0.3,
    weight: 2
  }).addTo(leafletMap);

  setTimeout(() => leafletMap.invalidateSize(), 200);
}

// ---- Hero Search ----
function heroSearchAction() {
  const query = document.getElementById('heroSearch').value.trim();
  if (query) {
    currentSearchQuery = query.toLowerCase();
    currentFilter = 'all';
    navigate('shop');
    setTimeout(() => {
      const shopInput = document.getElementById('shopSearchInput');
      if (shopInput) shopInput.value = query;
      renderShopProducts();
    }, 50);
  } else {
    navigate('shop');
  }
}

// ---- Toast Notifications ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${message}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Handle enter key on hero search
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement?.id === 'heroSearch') {
    heroSearchAction();
  }
});
