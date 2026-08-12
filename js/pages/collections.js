// ==========================================================================
// Quality Glass Emporium — Collections Page
// ==========================================================================

function renderCollections() {
  const products = DataStore.get('products');
  const categories = DataStore.get('categories');
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const selectedCategory = urlParams.get('category');

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory || categories.find(c => c.id === selectedCategory)?.children?.some(ch => ch.id === p.category))
    : products;

  return `
    ${renderSiteHeader()}
    <main class="page-container" style="padding-top: 24px; padding-bottom: 48px;">
      <h1 class="text-headline-lg mb-4 animate-fade-in">Collections</h1>
      <p class="text-body-md text-muted mb-6 animate-fade-in">Explore our curated collection of premium frames and glass products.</p>

      <!-- Category Filter Chips -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;" class="animate-fade-in-up">
        <button class="chip ${!selectedCategory ? 'active' : ''}" onclick="Router.navigate('/collections')">All Products</button>
        ${categories.map(cat => `
          <button class="chip ${selectedCategory === cat.id ? 'active' : ''}" onclick="Router.navigate('/collections?category=${cat.id}')">${cat.icon} ${cat.name}</button>
        `).join('')}
      </div>

      <!-- Search & Sort -->
      <div class="flex items-center gap-4 mb-6 animate-fade-in-up" style="flex-wrap: wrap;">
        <div class="search-bar" style="flex: 1; margin-bottom: 0; min-width: 250px;">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search products..." id="collection-search" oninput="filterCollectionProducts()" />
        </div>
        <select class="select-field" style="width: auto; min-width: 160px;" id="sort-select" onchange="filterCollectionProducts()">
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <!-- Product Grid -->
      <div class="product-grid stagger-children" id="collection-grid">
        ${filteredProducts.map(product => renderProductCard(product)).join('')}
      </div>

      ${filteredProducts.length === 0 ? `
        <div class="text-center" style="padding: 64px 20px;">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--subtle-gray);">search_off</span>
          <p class="text-body-lg text-muted mt-4">No products found in this category.</p>
          <a href="#/collections" class="btn btn-outline mt-4">View All Products</a>
        </div>
      ` : ''}
    </main>
    ${renderSiteFooter()}
    ${renderBottomNav('collections')}
  `;
}

function filterCollectionProducts() {
  // Client-side filter after render
  const search = document.getElementById('collection-search')?.value?.toLowerCase() || '';
  const sort = document.getElementById('sort-select')?.value || 'featured';
  const grid = document.getElementById('collection-grid');
  if (!grid) return;
  
  let products = DataStore.get('products');
  
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.subtitle.toLowerCase().includes(search)
    );
  }
  
  switch (sort) {
    case 'price-low': products.sort((a, b) => a.price - b.price); break;
    case 'price-high': products.sort((a, b) => b.price - a.price); break;
    case 'rating': products.sort((a, b) => b.rating - a.rating); break;
  }
  
  grid.innerHTML = products.map(p => renderProductCard(p)).join('');
}
