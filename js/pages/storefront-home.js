// ==========================================================================
// Quality Glass Emporium — Storefront Home Page
// ==========================================================================

function renderStorefrontHome() {
  const products = DataStore.get('products').filter(p => p.featured);
  
  return `
    ${renderSiteHeader()}
    
    <main class="page-container">
      <!-- Hero Section -->
      <section class="hero-section animate-fade-in" id="hero-banner">
        <div class="hero-content">
          <h1 class="hero-title">Frame Your Memories in Perfect Clarity</h1>
          <p class="hero-desc">Discover our curated collection of premium glass and acrylic frames, designed to protect and showcase your most treasured moments.</p>
          <div class="hero-actions">
            <a href="#/collections" class="btn btn-primary btn-lg">Shop Collections</a>
            <a href="#/collections" class="btn btn-outline btn-lg">Custom Framing</a>
          </div>
        </div>
        <div class="hero-image" style="display:none;">
          <img src="assets/hero_banner_framing.png" alt="Premium artisan frames" />
        </div>
      </section>

      <!-- Search Bar -->
      <div class="search-bar animate-fade-in-up" id="search-bar" style="animation-delay: 0.15s;">
        <span class="material-symbols-outlined">search</span>
        <input type="text" placeholder="Search for frames, materials, or sizes..." id="search-input" />
      </div>

      <!-- Featured Frames -->
      <section class="products-section animate-fade-in-up" style="animation-delay: 0.25s;">
        <div class="section-header">
          <h2 class="text-headline-md">Featured Frames</h2>
          <a href="#/collections">View All</a>
        </div>
        <div class="product-grid stagger-children">
          ${products.map(product => renderProductCard(product)).join('')}
        </div>
      </section>

      <!-- Categories Bento Grid -->
      <section class="products-section animate-fade-in-up" style="animation-delay: 0.35s;">
        <div class="section-header">
          <h2 class="text-headline-md">Shop by Category</h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          ${DataStore.get('categories').map(cat => `
            <a href="#/collections?category=${cat.id}" class="card card-elevated" style="text-align: center; padding: 32px 20px; text-decoration: none; color: inherit;">
              <div style="font-size: 40px; margin-bottom: 12px;">${cat.icon}</div>
              <div class="text-label-md">${cat.name}</div>
              <div class="text-caption text-muted mt-2">${cat.itemCount} items</div>
            </a>
          `).join('')}
        </div>
      </section>
    </main>

    ${renderSiteFooter()}
    ${renderBottomNav('home')}
  `;
}

function renderProductCard(product) {
  return `
    <div class="product-card" onclick="Router.navigate('/product/${product.id}')" id="product-${product.id}">
      <div class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist('${product.id}')">
        <span class="material-symbols-outlined" style="font-size: 20px;">favorite_border</span>
      </div>
      <img src="${product.images[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0edec%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22150%22 font-family=%22Manrope%22 font-size=%2216%22 fill=%22%2377777799%22 text-anchor=%22middle%22 dy=%22.3em%22%3EProduct Image%3C/text%3E%3C/svg%3E'}" 
           alt="${product.name}" class="product-image" loading="lazy" />
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-desc">${product.subtitle}</p>
        <div class="product-price">
          $${product.price.toFixed(2)}
          ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function toggleWishlist(productId) {
  showToast('Added to saved items!', 'success');
}
