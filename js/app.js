// ==========================================================================
// Quality Glass Emporium — Main Application
// Initializes all modules, registers routes, and provides shared components
// ==========================================================================

// --- App Init ---
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize mock data store
  DataStore.init();

  // Fetch real data directly from Supabase!
  try {
    const [prodRes, catRes, ordRes, coupRes, banRes, revRes] = await Promise.all([
      supabase.from('products').select('*').order('createdAt', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('orders').select('*').order('date', { ascending: false }),
      supabase.from('coupons').select('*'),
      supabase.from('banners').select('*').order('sequence', { ascending: true }),
      supabase.from('reviews').select('*').order('date', { ascending: false })
    ]);
    if (prodRes.data) DataStore.set('products', prodRes.data);
    if (catRes.data) DataStore.set('categories', catRes.data);
    if (ordRes.data) DataStore.set('orders', ordRes.data);
    if (coupRes.data) DataStore.set('coupons', coupRes.data);
    if (banRes.data) DataStore.set('banners', banRes.data);
    if (revRes.data) DataStore.set('reviews', revRes.data);
  } catch (err) {
    console.error('Error fetching Supabase data:', err);
  }

  // Restore session
  const token = localStorage.getItem('qge_token');
  
  // Transition styling for SPA
  const appEl = document.getElementById('app');
  appEl.style.transition = 'opacity 0.15s ease';

  // Register all routes
  Router
    .on('/', () => renderStorefrontHome())
    .on('/collections', () => renderCollections())
    .on('/product/:id', (params) => renderProductDetail(params))
    .on('/cart', () => renderCart())
    .on('/checkout', () => renderCheckout())
    .on('/login', () => renderLogin())
    .on('/account', () => renderUserDashboard())
    .on('/account/orders', () => renderUserOrders())
    .on('/account/settings', () => renderUserSettings())
    .on('/admin', () => renderAdminDashboard())
    .on('/admin/products', () => renderAdminProducts())
    .on('/admin/categories', () => renderAdminCategories())
    .on('/admin/orders', () => renderAdminOrders())
    .on('/admin/coupons', () => renderAdminCoupons())
    .on('/admin/banners', () => renderAdminBanners())
    .on('/admin/reviews', () => renderAdminReviews())
    .on('/admin/customers', () => renderAdminCustomers())
    .on('/admin/payments', () => renderAdminPayments())
    .on('/admin/shipping', () => renderAdminShipping())
    .on('/admin/seo', () => renderAdminSeo())
    .on('/admin/branding', () => renderAdminBranding())
    .on('/admin/content', () => renderAdminContentEditor());

  // Navigation guards
  Router.beforeEach = (path) => {
    // Require auth for account pages
    if (path.startsWith('/account') && !Auth.isLoggedIn()) {
      Router.navigate('/login');
      return false;
    }
    // Require admin for admin pages
    if (path.startsWith('/admin') && !Auth.isAdmin()) {
      if (!Auth.isLoggedIn()) {
        Router.navigate('/login');
      } else {
        showToast('Admin access required', 'error');
        Router.navigate('/');
      }
      return false;
    }
    return true;
  };

  // Initialize router
  Router.init();

  // Dark mode init
  initTheme();

  // Scroll reveal observer
  initScrollReveal();
});

// ==========================================================================
// Shared Components
// ==========================================================================

// --- Site Header ---
function renderSiteHeader() {
  const user = Auth.getUser();
  const cart = DataStore.get('cart');
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="#/" class="logo" style="text-decoration: none;">
          <span style="color: var(--primary);">Quality Glass</span>
          <span style="color: var(--secondary); font-weight: 400;"> Emporium</span>
        </a>
        
        <nav class="header-nav">
          <a href="#/">Home</a>
          <a href="#/collections">Collections</a>
          <a href="#/collections?category=cat_glass">Custom Glass</a>
          <a href="#/collections?category=cat_frames">Frames</a>
        </nav>

        <div class="header-actions">
          <div class="theme-toggle" onclick="toggleTheme()" title="Toggle dark mode">
            <span class="material-symbols-outlined" id="theme-icon">dark_mode</span>
          </div>
          
          <a href="#/cart" style="position: relative; color: var(--on-surface); display: flex; align-items: center;">
            <span class="material-symbols-outlined">shopping_cart</span>
            ${cartCount > 0 ? `<span id="cart-badge" style="position: absolute; top: -6px; right: -8px; background: var(--error); color: white; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 10px; min-width: 18px; text-align: center;">${cartCount}</span>` : '<span id="cart-badge" style="display:none;"></span>'}
          </a>

          ${user ? `
            <a href="#${user.role === 'admin' ? '/admin' : '/account'}" style="color: var(--on-surface); display: flex; align-items: center; gap: 8px; text-decoration: none;">
              <div class="avatar avatar-sm">${user.name.split(' ').map(n => n[0]).join('')}</div>
              <span style="font-size: 14px; font-weight: 500; display: none;" class="user-name-desktop">${user.name.split(' ')[0]}</span>
            </a>
          ` : `
            <a href="#/login" class="btn btn-primary btn-sm" style="display: none;" id="login-header-btn">Sign In</a>
            <a href="#/login" style="color: var(--on-surface);" class="mobile-login-btn">
              <span class="material-symbols-outlined">person</span>
            </a>
          `}
        </div>
      </div>
    </header>
  `;
}

// --- Bottom Navigation (Mobile) ---
function renderBottomNav(active) {
  const user = Auth.getUser();
  return `
    <nav class="bottom-nav" id="bottom-nav">
      <div class="bottom-nav-item ${active === 'home' ? 'active' : ''}" onclick="Router.navigate('/')">
        <span class="material-symbols-outlined">home</span>
        <span>Home</span>
      </div>
      <div class="bottom-nav-item ${active === 'collections' ? 'active' : ''}" onclick="Router.navigate('/collections')">
        <span class="material-symbols-outlined">grid_view</span>
        <span>Collections</span>
      </div>
      <div class="bottom-nav-item ${active === 'cart' ? 'active' : ''}" onclick="Router.navigate('/cart')" style="position: relative;">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span>Cart</span>
      </div>
      <div class="bottom-nav-item ${active === 'profile' ? 'active' : ''}" onclick="Router.navigate(Auth.isLoggedIn() ? '/account' : '/login')">
        <span class="material-symbols-outlined">person</span>
        <span>Profile</span>
      </div>
      ${user && user.role === 'admin' ? `
        <div class="bottom-nav-item admin-nav-btn" onclick="Router.navigate('/admin')">
          <span class="material-symbols-outlined">admin_panel_settings</span>
          <span>Admin</span>
        </div>
      ` : ''}
    </nav>
  `;
}

// --- Site Footer ---
function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">Quality Glass Emporium</div>
        <div class="footer-tagline">Crafting clarity and elegance for your cherished memories.</div>
        <div class="footer-grid">
          <div class="footer-col">
            <h4>Shop</h4>
            <a href="#/collections">All Collections</a>
            <a href="#/collections?category=cat_frames">Frames</a>
            <a href="#/collections?category=cat_glass">Custom Glass</a>
            <a href="#/collections?category=cat_acrylic">Acrylics</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <a href="#">Shipping Policy</a>
            <a href="#">Returns</a>
            <a href="#">FAQ</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} Quality Glass Emporium. All rights reserved.</span>
          <span>Handcrafted with care in Craftstown, CT</span>
        </div>
        <div class="developer-bar" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; font-size: 13px; color: rgba(255,255,255,0.6);">
          <span><strong>Developer:</strong> Vishishth Gaur (Little)</span>
          <span>•</span>
          <a href="https://www.instagram.com/_kaatya_og_?igsh=Y251ZDc2eWx1Y3hy" target="_blank" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 4px;">
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            Instagram
          </a>
          <span>•</span>
          <a href="mailto:vishishthgaurlittle@gmail.com" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 14px;">mail</span>
            vishishthgaurlittle@gmail.com
          </a>
        </div>
        <div class="owner-bar" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; font-size: 13px; color: rgba(255,255,255,0.6);">
          <span><strong>Owner:</strong> Quality Glass Emporium & Photo Framing Center</span>
          <span>•</span>
          <span style="display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 14px;">location_on</span>
            Belliganj Malik Mau Road, Near Hotel Ganesh, PNT Colony, Raebareli-229001, UP
          </span>
          <span>•</span>
          <a href="https://www.justdial.com/Raebareli/Quality-Glass-Emporium-And-Photo-Framing-Center-Near-Hotel-Ganesh-Pnt-Colony/9999PX535-X535-210223144545-F6P5_BZDET" target="_blank" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 4px;">
            <span class="material-symbols-outlined" style="font-size: 14px;">store</span>
            Justdial Profile
          </a>
        </div>
      </div>
    </footer>
  `;
}

// --- Admin Layout Wrapper ---
function renderAdminLayout(activePage, content) {
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard Overview', path: '/admin' },
    { id: 'content', icon: 'edit_note', label: 'Edit Main Page Website', path: '/admin/content' },
    { id: 'products', icon: 'inventory_2', label: 'Products & Pricing', path: '/admin/products' },
    { id: 'categories', icon: 'category', label: 'Categories Taxonomy', path: '/admin/categories' },
    { id: 'orders', icon: 'local_shipping', label: 'Orders & Logistics', path: '/admin/orders' },
    { id: 'coupons', icon: 'sell', label: 'Coupons & Discounts', path: '/admin/coupons' },
    { id: 'banners', icon: 'view_carousel', label: 'Banners & Carousels', path: '/admin/banners' },
    { id: 'reviews', icon: 'star_rate', label: 'Reviews Moderation', path: '/admin/reviews' },
    { id: 'customers', icon: 'group', label: 'Customer Accounts', path: '/admin/customers' },
    { id: 'payments', icon: 'credit_card', label: 'Payment Gateways', path: '/admin/payments' },
    { id: 'shipping', icon: 'local_shipping', label: 'Shipping & Taxes', path: '/admin/shipping' },
    { id: 'seo', icon: 'search', label: 'SEO & Meta Settings', path: '/admin/seo' },
    { id: 'branding', icon: 'storefront', label: 'Branding & Store Info', path: '/admin/branding' },
  ];

  return `
    <div class="admin-layout">
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="sidebar-header">
          <div class="sidebar-badge">
            <span>SECURE CONTROL PANEL</span>
            <span class="dev-badge">DEVELOPER</span>
          </div>
          <div class="store-name">Quality Glass<br />Emporium</div>
          <div class="store-handle">@ADMIN_PORTAL_2024</div>
        </div>
        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <a href="#${item.path}" class="nav-item ${activePage === item.id ? 'active' : ''}" style="text-decoration: none;">
              <span class="material-symbols-outlined">${item.icon}</span>
              ${item.label}
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="view-site-btn" onclick="Router.navigate('/')">
            <span class="material-symbols-outlined" style="font-size:18px;">visibility</span>
            View Live Customer Site
          </div>
          <div class="logout-btn" onclick="Auth.logout(); showToast('Logged out', 'success');">
            <span class="material-symbols-outlined" style="font-size:18px;">logout</span>
            Log Out Admin
          </div>
        </div>
      </aside>
      <main class="admin-main">
        <!-- Mobile menu toggle -->
        <button class="btn btn-outline mb-4" id="admin-menu-toggle" style="display:none;" onclick="document.getElementById('admin-sidebar').classList.toggle('open')">
          <span class="material-symbols-outlined">menu</span> Menu
        </button>
        ${content}
      </main>
    </div>
  `;
}

// ==========================================================================
// Utility Functions
// ==========================================================================

// --- Status Badge ---
function renderStatusBadge(status) {
  const statusMap = {
    'pending_approval': { label: 'Pending', class: 'badge-warning' },
    'processing': { label: 'Processing', class: 'badge-info' },
    'shipped': { label: 'Shipped', class: 'badge-info' },
    'delivered': { label: 'Delivered', class: 'badge-success' },
    'cancelled': { label: 'Cancelled', class: 'badge-error' },
    'approved': { label: 'Approved', class: 'badge-success' },
    'flagged': { label: 'Flagged', class: 'badge-error' },
    'pending': { label: 'Pending', class: 'badge-warning' }
  };
  const s = statusMap[status] || { label: status, class: 'badge-neutral' };
  return `<span class="badge ${s.class}">${s.label}</span>`;
}

// --- Date Formatter ---
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Toast Notification ---
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size: 20px;">${icons[type] || 'info'}</span>
    ${message}
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Cart Badge Update ---
function updateCartBadge() {
  const cart = DataStore.get('cart');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badges = document.querySelectorAll('#cart-badge');
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  });
}

// --- Theme Toggle ---
function initTheme() {
  const stored = localStorage.getItem('qge_theme');
  if (stored === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  
  if (newTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  localStorage.setItem('qge_theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}

// --- Scroll Reveal ---
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.addEventListener('routeChanged', () => {
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      // Add body class for bottom nav padding
      const bottomNav = document.getElementById('bottom-nav');
      if (bottomNav) {
        document.body.classList.add('has-bottom-nav');
      } else {
        document.body.classList.remove('has-bottom-nav');
      }
      // Show mobile admin menu toggle
      const toggle = document.getElementById('admin-menu-toggle');
      if (toggle && window.innerWidth <= 1024) {
        toggle.style.display = '';
      }
      // Show login button on desktop
      const loginBtn = document.getElementById('login-header-btn');
      if (loginBtn && window.innerWidth >= 768) {
        loginBtn.style.display = '';
      }
      // Show user name on desktop
      document.querySelectorAll('.user-name-desktop').forEach(el => {
        if (window.innerWidth >= 768) el.style.display = '';
      });
    }, 100);
  });
}
