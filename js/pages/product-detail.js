// ==========================================================================
// Quality Glass Emporium — Product Detail Page
// ==========================================================================

function renderProductDetail(params) {
  const product = DataStore.findById('products', params.id);
  if (!product) {
    return `${renderSiteHeader()}<div class="page-container text-center" style="padding: 64px 20px;">
      <h1 class="text-headline-lg">Product Not Found</h1>
      <a href="#/collections" class="btn btn-primary mt-6">Browse Collections</a>
    </div>${renderSiteFooter()}${renderBottomNav('collections')}`;
  }

  const reviews = DataStore.get('reviews').filter(r => r.productId === product.id && r.status === 'approved');

  return `
    ${renderSiteHeader()}
    <main class="page-container" style="padding-top: 24px; padding-bottom: 48px;">
      <div class="product-detail-layout animate-fade-in">
        <!-- Gallery -->
        <div class="product-gallery">
          <img src="${product.images[0] || ''}" alt="${product.name}" class="main-image" id="main-product-image" />
          <div class="thumb-strip">
            ${product.images.map((img, i) => `
              <div class="thumb ${i === 0 ? 'active' : ''}" onclick="changeProductImage('${img}', this)">
                <img src="${img}" alt="View ${i+1}" />
              </div>
            `).join('')}
            <div class="thumb" style="display: flex; align-items: center; justify-content: center; background: var(--surface-container-low);">
              <span class="material-symbols-outlined" style="color: var(--subtle-gray);">play_circle</span>
            </div>
          </div>
        </div>

        <!-- Product Config -->
        <div class="product-config">
          <div>
            <h1 class="product-name">${product.name}</h1>
            <p class="product-subtitle">${product.subtitle}</p>
          </div>

          <div class="price-block">
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="orig-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>

          ${product.sizes.length > 0 ? `
          <div class="config-group">
            <div class="config-label">
              <span>Size</span>
              <a href="#" class="text-secondary">Size Guide</a>
            </div>
            <div class="size-options" id="size-options">
              ${product.sizes.map((size, i) => `
                <div class="size-option ${i === 1 ? 'selected' : ''}" onclick="selectOption(this, 'size-options')">${size}</div>
              `).join('')}
            </div>
            <div style="margin-top: 8px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--on-surface-variant); cursor: pointer;">
                <input type="checkbox" id="custom-size-toggle" onchange="toggleCustomSize()" style="accent-color: var(--secondary);" />
                Need a custom size?
              </label>
              <div id="custom-size-fields" style="display: none; margin-top: 12px; display: none;">
                <div style="display: flex; gap: 12px; align-items: center;">
                  <div class="input-group" style="flex: 1;">
                    <label>Width (in)</label>
                    <input type="number" class="input-field" value="11" />
                  </div>
                  <span style="font-size: 18px; color: var(--subtle-gray); margin-top: 20px;">×</span>
                  <div class="input-group" style="flex: 1;">
                    <label>Height (in)</label>
                    <input type="number" class="input-field" value="14" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          ` : ''}

          ${product.finishes.length > 0 ? `
          <div class="config-group">
            <div class="config-label">
              <span>Finish: <strong id="finish-name">${product.finishes[0].name}</strong></span>
            </div>
            <div class="color-swatches" id="finish-swatches">
              ${product.finishes.map((finish, i) => `
                <div class="color-swatch ${i === 0 ? 'selected' : ''}" 
                     style="background-color: ${finish.color};" 
                     title="${finish.name}"
                     onclick="selectFinish(this, '${finish.name}')">
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${product.matStyles.length > 0 ? `
          <div class="config-group">
            <div class="config-label"><span>Mat Style</span></div>
            <div class="mat-options" id="mat-options">
              ${product.matStyles.map((mat, i) => `
                <div class="mat-option ${i === 0 ? 'selected' : ''}" onclick="selectOption(this, 'mat-options')">${mat}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Upload Photo -->
          <button class="btn btn-outline w-full" style="justify-content: center;" onclick="showToast('Photo upload feature coming soon!', 'info')">
            <span class="material-symbols-outlined">upload</span>
            Upload Your Photo
          </button>

          <!-- Quantity + Add to Cart -->
          <div class="add-to-cart-row">
            <div class="quantity-control">
              <button onclick="updateQty(-1)">−</button>
              <div class="qty-value" id="qty-display">1</div>
              <button onclick="updateQty(1)">+</button>
            </div>
            <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="addToCart('${product.id}')" id="add-to-cart-btn">
              Add to Cart
            </button>
          </div>

          <!-- Accordions -->
          <div style="margin-top: 8px;">
            <div class="accordion-item open">
              <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>Description</span>
                <span class="material-symbols-outlined icon">expand_more</span>
              </div>
              <div class="accordion-body">
                <div class="accordion-body-inner">
                  <p class="text-body-md">${product.description}</p>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>Specifications</span>
                <span class="material-symbols-outlined icon">expand_more</span>
              </div>
              <div class="accordion-body">
                <div class="accordion-body-inner">
                  ${Object.entries(product.specs).map(([key, val]) => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--surface-container-high);">
                      <span class="text-label-md text-muted" style="text-transform: capitalize;">${key}</span>
                      <span class="text-body-md">${val}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <div class="accordion-header" onclick="toggleAccordion(this)">
                <span>Shipping & Returns</span>
                <span class="material-symbols-outlined icon">expand_more</span>
              </div>
              <div class="accordion-body">
                <div class="accordion-body-inner">
                  <p class="text-body-md">Free shipping on orders over $150. Standard delivery 5-7 business days. Expedited 2-3 business days. 30-day return policy for unused items in original packaging.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      ${reviews.length > 0 ? `
      <section class="mt-8">
        <h2 class="text-headline-md mb-4">Customer Reviews</h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${reviews.map(review => `
            <div class="card" style="padding: 20px;">
              <div class="flex items-center gap-3 mb-2">
                <div class="avatar avatar-sm">${review.userName.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div class="font-semibold" style="font-size: 14px;">${review.userName}</div>
                  <div class="text-caption text-muted">${review.date}</div>
                </div>
                <div style="margin-left: auto; color: #f59e0b;">
                  ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                </div>
              </div>
              <p class="text-body-md">${review.text}</p>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}
    </main>
    ${renderSiteFooter()}
    ${renderBottomNav('collections')}
  `;
}

let currentQty = 1;

function updateQty(delta) {
  currentQty = Math.max(1, Math.min(99, currentQty + delta));
  const display = document.getElementById('qty-display');
  if (display) display.textContent = currentQty;
}

function selectOption(el, containerId) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.size-option, .mat-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function selectFinish(el, name) {
  document.querySelectorAll('#finish-swatches .color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  const nameEl = document.getElementById('finish-name');
  if (nameEl) nameEl.textContent = name;
}

function toggleCustomSize() {
  const fields = document.getElementById('custom-size-fields');
  const toggle = document.getElementById('custom-size-toggle');
  if (fields) fields.style.display = toggle.checked ? 'block' : 'none';
}

function toggleAccordion(header) {
  const item = header.parentElement;
  item.classList.toggle('open');
}

function changeProductImage(src, thumbEl) {
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function addToCart(productId) {
  const product = DataStore.findById('products', productId);
  if (!product) return;
  
  const cart = DataStore.get('cart');
  const sizeEl = document.querySelector('#size-options .selected');
  const size = sizeEl ? sizeEl.textContent : product.sizes[0] || '';
  
  const existing = cart.find(item => item.productId === productId && item.size === size);
  if (existing) {
    existing.qty += currentQty;
  } else {
    cart.push({
      id: 'cart_' + Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      size: size,
      qty: currentQty,
      image: product.images[0] || ''
    });
  }
  
  DataStore.set('cart', cart);
  currentQty = 1;
  showToast(`${product.name} added to cart!`, 'success');
  updateCartBadge();
}
