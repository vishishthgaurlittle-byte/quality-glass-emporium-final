// ==========================================================================
// Quality Glass Emporium — Admin Pages (Products, Categories, Orders, etc.)
// ==========================================================================

// --- Products & Pricing ---
function renderAdminProducts() {
  const products = DataStore.get('products');
  return renderAdminLayout('products', `
    <div class="admin-page-header">
      <div>
        <h1>Products & Pricing</h1>
        <p class="page-desc">Manage your product catalog, pricing, and inventory levels.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="document.getElementById('addProductModal').showModal()">
          <span class="material-symbols-outlined">add</span> Add Product
        </button>
      </div>
    </div>
    <div class="search-bar mb-6" style="max-width: 400px;">
      <span class="material-symbols-outlined">search</span>
      <input type="text" placeholder="Search products..." />
    </div>
    <table class="data-table">
      <thead>
        <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>
              <div class="flex items-center gap-3">
                <img src="${p.images[0] || ''}" style="width:48px;height:48px;border-radius:var(--radius);object-fit:cover;background:var(--surface-container-low);" />
                <div>
                  <div class="font-semibold">${p.name}</div>
                  <div class="text-caption text-muted">${p.subtitle.substring(0, 40)}...</div>
                </div>
              </div>
            </td>
            <td><span class="chip" style="pointer-events:none;">${getCategoryName(p.category)}</span></td>
            <td>
              <div class="font-bold">$${p.price.toFixed(2)}</div>
              ${p.originalPrice ? `<div class="text-caption text-muted" style="text-decoration:line-through;">$${p.originalPrice.toFixed(2)}</div>` : ''}
            </td>
            <td>
              <span class="${p.stockCount <= 5 ? 'text-error font-bold' : ''}">${p.stockCount}</span>
            </td>
            <td>${p.inStock ? '<span class="badge badge-success">In Stock</span>' : '<span class="badge badge-error">Out</span>'}</td>
            <td>
              <div class="flex gap-2">
                <button class="btn btn-outline btn-sm">Edit</button>
                <button class="btn btn-ghost btn-sm text-error">
                  <span class="material-symbols-outlined" style="font-size:18px;">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <dialog id="addProductModal" class="modal">
      <div class="modal-box" style="max-width: 600px;">
        <h3 class="font-bold text-lg mb-4">Add New Product</h3>
        <div class="flex flex-col gap-4">
          <div class="input-group">
            <label>Product Name</label>
            <input type="text" id="ap_name" class="input-field" placeholder="Product name" />
          </div>
          <div class="input-group">
            <label>Price ($)</label>
            <input type="number" id="ap_price" class="input-field" placeholder="0.00" step="0.01" />
          </div>
          <div class="input-group">
            <label>Description</label>
            <textarea id="ap_desc" class="textarea-field" rows="3" placeholder="Product description"></textarea>
          </div>
          <div class="modal-action mt-6">
            <button class="btn btn-outline" onclick="document.getElementById('addProductModal').close()">Cancel</button>
            <button class="btn btn-primary" onclick="submitNewProduct()">Save Product</button>
          </div>
        </div>
      </div>
    </dialog>
  `);
}

window.submitNewProduct = async function() {
  const name = document.getElementById('ap_name').value;
  const price = document.getElementById('ap_price').value;
  const desc = document.getElementById('ap_desc').value;
  
  if (!name || !price) {
    showToast('Name and price are required', 'error');
    return;
  }
  
  const product = { 
    id: 'prod_' + Date.now().toString(36),
    name, 
    price, 
    description: desc, 
    subtitle: '', 
    category: 'cat_frames', 
    inStock: true, 
    stockCount: 10, 
    images: [] 
  };
  
  try {
    const { data, error } = await supabase.from('products').insert([product]).select();
    
    if (!error && data && data.length > 0) {
      DataStore.add('products', data[0]);
      document.getElementById('addProductModal').close();
      showToast('Product added directly to Supabase!', 'success');
      setTimeout(() => Router.navigate('/admin/products'), 500);
    } else {
      showToast(error ? error.message : 'Error saving product', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
};


// --- Categories Taxonomy ---
function renderAdminCategories() {
  const categories = DataStore.get('categories');
  return renderAdminLayout('categories', `
    <div class="admin-page-header">
      <div>
        <h1>Categories Taxonomy</h1>
        <p class="page-desc">Organize your product hierarchy and catalog structure.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" onclick="toggleCategoryTree('expand')">
          <span class="material-symbols-outlined" style="font-size:18px;">unfold_more</span> Expand All
        </button>
        <button class="btn btn-outline" onclick="toggleCategoryTree('collapse')">
          <span class="material-symbols-outlined" style="font-size:18px;">unfold_less</span> Collapse
        </button>
      </div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <h2 class="text-headline-md mb-4">Manage Categories</h2>
        <div class="category-tree">
          ${categories.map(cat => `
            <div class="tree-item" id="tree-${cat.id}">
              <div class="tree-item-header" onclick="toggleTreeItem('${cat.id}')">
                <span class="material-symbols-outlined" style="font-size:18px;transition:transform 0.2s;">${cat.children?.length ? 'expand_more' : 'remove'}</span>
                <span>${cat.icon}</span>
                <span class="font-semibold" style="flex:1;">${cat.name}</span>
                <span class="badge badge-neutral">${cat.itemCount} Items</span>
              </div>
              ${cat.children?.length ? `
                <div class="tree-children" style="display:none;">
                  ${cat.children.map(child => `
                    <div class="tree-child">
                      <span class="material-symbols-outlined" style="font-size:16px;color:var(--subtle-gray);">subdirectory_arrow_right</span>
                      <span>${child.icon || ''}</span>
                      <span style="flex:1;">${child.name}</span>
                      <span class="badge badge-neutral">${child.itemCount} Items</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
          <div class="add-card" style="min-height: auto; padding: 20px;" onclick="showToast('Add category form coming soon!', 'info')">
            <span class="material-symbols-outlined">add_circle_outline</span>
            <span class="text-label-md">Add Root Category</span>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <h3 class="text-headline-md mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined">settings</span> Add New Category
          </h3>
          <div class="flex flex-col gap-4">
            <div class="input-group">
              <label>Category Name *</label>
              <input type="text" class="input-field" placeholder="e.g. Acrylic Sheets" />
            </div>
            <div class="input-group">
              <label>Parent Category</label>
              <select class="select-field">
                <option>— None (Root Level) —</option>
                ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="input-group">
              <label>URL Slug</label>
              <div class="flex items-center gap-0">
                <span style="padding:12px;background:var(--surface-container-high);border:1px solid var(--subtle-gray);border-right:none;border-radius:var(--radius) 0 0 var(--radius);font-size:14px;color:var(--subtle-gray);">/category/</span>
                <input type="text" class="input-field" style="border-radius:0 var(--radius) var(--radius) 0;" placeholder="acrylic-sheets" />
              </div>
            </div>
            <div class="input-group">
              <label>Description</label>
              <textarea class="textarea-field" rows="3" placeholder="Brief description for SEO and catalog display..."></textarea>
            </div>
            <div class="file-upload-zone" style="padding:24px;">
              <span class="material-symbols-outlined" style="color:var(--subtle-gray);">image</span>
              <div class="text-caption mt-2"><a href="#" class="text-secondary">Upload a file</a> or drag and drop</div>
              <div class="text-caption text-muted">PNG, JPG up to 2MB</div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-label-md">Active on Storefront</span>
              <label class="toggle-switch"><input type="checkbox" id="ac_active" checked /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
            </div>
            <div class="flex gap-3 mt-2">
              <button class="btn btn-outline" style="flex:1;">Cancel</button>
              <button class="btn btn-primary" style="flex:1;" onclick="submitNewCategory()">Save Category</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

window.submitNewCategory = async function() {
  const name = document.querySelector('.input-field[placeholder="e.g. Acrylic Sheets"]').value;
  const slug = document.querySelector('.input-field[placeholder="acrylic-sheets"]').value;
  const active = document.getElementById('ac_active').checked;
  
  if (!name) {
    showToast('Category name is required', 'error');
    return;
  }
  
  const category = { 
    id: 'cat_' + Date.now().toString(36),
    name, 
    slug, 
    active, 
    itemCount: 0, 
    children: [], 
    icon: '📁' 
  };
  
  try {
    const { data, error } = await supabase.from('categories').insert([category]).select();
    
    if (!error && data && data.length > 0) {
      DataStore.add('categories', data[0]);
      showToast('Category saved to Supabase!', 'success');
      setTimeout(() => Router.navigate('/admin/categories'), 500);
    } else {
      showToast(error ? error.message : 'Error saving category', 'error');
    }
  } catch (err) {
    showToast('Network error', 'error');
  }
};


// --- Orders & Logistics ---
function renderAdminOrders() {
  const orders = DataStore.get('orders');
  const pendingCount = orders.filter(o => o.status === 'pending_approval').length;
  const shippingCount = orders.filter(o => o.status === 'processing').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  return renderAdminLayout('orders', `
    <div class="admin-page-header">
      <div>
        <h1>Orders & Logistics</h1>
        <p class="page-desc">Manage customer orders and approve payment proofs.</p>
      </div>
    </div>
    <div class="stats-grid stagger-children">
      <div class="stat-card">
        <div><div class="stat-label">Pending Approvals</div><div class="stat-value">${pendingCount}</div></div>
        <div class="stat-icon" style="background:#fef3c7;color:#d97706;"><span class="material-symbols-outlined">pending_actions</span></div>
      </div>
      <div class="stat-card">
        <div><div class="stat-label">Orders to Ship</div><div class="stat-value">${shippingCount}</div></div>
        <div class="stat-icon" style="background:#dbeafe;color:var(--secondary);"><span class="material-symbols-outlined">local_shipping</span></div>
      </div>
      <div class="stat-card">
        <div><div class="stat-label">Delivered Today</div><div class="stat-value">${deliveredCount}</div></div>
        <div class="stat-icon" style="background:#dcfce7;color:var(--success);"><span class="material-symbols-outlined">check_circle</span></div>
      </div>
    </div>

    <div class="card mt-6">
      <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:12px;">
        <h2 class="text-headline-md">Recent Orders</h2>
        <div class="search-bar" style="margin-bottom:0;max-width:250px;">
          <span class="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search orders..." />
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td class="font-semibold">${o.id}</td>
              <td><div class="flex items-center gap-2"><div class="avatar avatar-sm">${o.customerName.split(' ').map(n=>n[0]).join('')}</div>${o.customerName}</div></td>
              <td class="font-bold">$${o.total.toFixed(2)}</td>
              <td>${renderStatusBadge(o.status)}</td>
              <td>
                <div class="flex gap-2">
                  ${o.status === 'pending_approval' ? `
                    <button class="btn btn-primary btn-sm" onclick="approveOrder('${o.id}')">Approve</button>
                    <button class="btn btn-outline btn-sm text-error" onclick="rejectOrder('${o.id}')">Reject</button>
                  ` : `
                    <button class="btn btn-outline btn-sm">Details</button>
                  `}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="flex items-center justify-between mt-4">
        <span class="text-caption text-muted">Showing 1-${orders.length} of ${orders.length} orders</span>
        <div class="pagination">
          <button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">›</button>
        </div>
      </div>
    </div>
  `);
}

// --- Coupons & Discounts ---
function renderAdminCoupons() {
  const coupons = DataStore.get('coupons');
  return renderAdminLayout('coupons', `
    <div class="admin-page-header">
      <div>
        <h1>Coupons & Discounts</h1>
        <p class="page-desc">Manage active promotions, generate new vouchers, and oversee campaign performance.</p>
      </div>
    </div>
    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="card card-elevated" style="cursor:pointer;" onclick="showToast('Voucher creator coming soon!', 'info')">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="background:#dbeafe;color:var(--secondary);"><span class="material-symbols-outlined">add_circle</span></div>
          <div><div class="font-semibold">Create Voucher</div><div class="text-caption text-muted">Generate unique codes</div></div>
        </div>
      </div>
      <div class="card card-elevated" style="cursor:pointer;" onclick="Router.navigate('/admin/seo')">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="background:#f3e8ff;color:#7c3aed;"><span class="material-symbols-outlined">language</span></div>
          <div><div class="font-semibold">SEO & Meta Settings</div><div class="text-caption text-muted">Optimize campaign reach</div></div>
        </div>
      </div>
      <div class="card card-elevated" style="cursor:pointer;" onclick="Router.navigate('/admin/banners')">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="background:#fef3c7;color:#d97706;"><span class="material-symbols-outlined">view_carousel</span></div>
          <div><div class="font-semibold">Banners/Carousels</div><div class="text-caption text-muted">Update promo visuals</div></div>
        </div>
      </div>
    </div>
    <div class="card mt-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-headline-md">Active Campaigns</h2>
        <a href="#" class="text-secondary text-label-md">View All</a>
      </div>
      <table class="data-table">
        <thead><tr><th>Code</th><th>Type</th><th>Usage</th><th>Status</th></tr></thead>
        <tbody>
          ${coupons.map(c => `
            <tr>
              <td class="font-bold" style="font-family:monospace;">${c.code}</td>
              <td>${c.type}</td>
              <td>${c.usage}${c.maxUsage ? ' / ' + c.maxUsage : ' / Unlimited'}</td>
              <td>${c.status === 'active' ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-neutral">Inactive</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `);
}

// --- Banners & Carousels ---
function renderAdminBanners() {
  const banners = DataStore.get('banners');
  return renderAdminLayout('banners', `
    <div class="admin-page-header">
      <div>
        <h1>Banners & Carousels</h1>
        <p class="page-desc">Manage active marketing graphics and display sequences.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" onclick="showToast('Upload feature coming soon!', 'info')">
          <span class="material-symbols-outlined">upload</span> Upload New Graphic
        </button>
      </div>
    </div>
    <div class="tabs mb-6">
      <div class="tab-item active">Homepage Carousel</div>
      <div class="tab-item">Category Banners</div>
      <div class="tab-item">Promotional Pop-ups</div>
    </div>
    <div class="banner-grid">
      ${banners.filter(b => b.tab === 'homepage').map(banner => `
        <div class="banner-card">
          <div style="position:relative;">
            <img src="${banner.image}" alt="${banner.title}" class="banner-image" style="aspect-ratio:16/9;object-fit:cover;" />
            <div style="position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;">
              <span class="chip" style="background:rgba(255,255,255,0.9);font-size:12px;padding:4px 10px;">
                <span class="material-symbols-outlined" style="font-size:14px;">drag_indicator</span> Seq: ${banner.sequence}
              </span>
              <span class="badge badge-success">● Active</span>
            </div>
          </div>
          <div class="banner-info">
            <div class="banner-title">${banner.title}</div>
            <div class="banner-link">Link: ${banner.link}</div>
          </div>
          <div class="banner-actions">
            <button class="btn btn-outline btn-sm" style="flex:1;"><span class="material-symbols-outlined" style="font-size:16px;">edit</span> Edit</button>
            <button class="btn btn-ghost btn-sm text-error"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>
          </div>
        </div>
      `).join('')}
      <div class="add-card">
        <span class="material-symbols-outlined" style="font-size:40px;color:var(--secondary);">add_photo_alternate</span>
        <div class="font-semibold">Add New Banner</div>
        <div class="text-caption text-muted">Upload graphics for the carousel</div>
      </div>
    </div>
  `);
}

// --- Reviews Moderation ---
function renderAdminReviews() {
  const reviews = DataStore.get('reviews');
  return renderAdminLayout('reviews', `
    <div class="admin-page-header">
      <div>
        <h1>Reviews Moderation</h1>
        <p class="page-desc">Manage customer reviews and ratings across your products.</p>
      </div>
    </div>
    <div class="tabs mb-6">
      <div class="tab-item active">All Reviews (${reviews.length})</div>
      <div class="tab-item">Pending (${reviews.filter(r=>r.status==='pending').length})</div>
      <div class="tab-item">Flagged (${reviews.filter(r=>r.status==='flagged').length})</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:16px;" class="stagger-children">
      ${reviews.map(review => {
        const product = DataStore.findById('products', review.productId);
        return `
          <div class="card" style="padding:20px;">
            <div class="flex items-center justify-between mb-3" style="flex-wrap:wrap;gap:8px;">
              <div class="flex items-center gap-3">
                <div class="avatar avatar-sm">${review.userName.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <div class="font-semibold">${review.userName}</div>
                  <div class="text-caption text-muted">on ${product?.name || 'Unknown Product'} • ${review.date}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span style="color:#f59e0b;">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                ${renderStatusBadge(review.status === 'approved' ? 'delivered' : review.status === 'pending' ? 'pending_approval' : 'cancelled')}
              </div>
            </div>
            <p class="text-body-md mb-3">${review.text}</p>
            <div class="flex gap-2">
              ${review.status !== 'approved' ? `<button class="btn btn-primary btn-sm" onclick="moderateReview('${review.id}', 'approved')">Approve</button>` : ''}
              ${review.status !== 'flagged' ? `<button class="btn btn-outline btn-sm" onclick="moderateReview('${review.id}', 'flagged')">Flag</button>` : ''}
              <button class="btn btn-ghost btn-sm text-error" onclick="moderateReview('${review.id}', 'delete')">Delete</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `);
}

// --- Customer Accounts ---
function renderAdminCustomers() {
  const users = DataStore.get('users').filter(u => u.role === 'customer');
  return renderAdminLayout('customers', `
    <div class="admin-page-header">
      <div>
        <h1>Customers</h1>
        <p class="page-desc">Manage customer accounts, view histories, and segment data.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary"><span class="material-symbols-outlined">person_add</span> New Customer</button>
        <button class="btn btn-outline"><span class="material-symbols-outlined">download</span> Export</button>
      </div>
    </div>
    <div class="flex items-center gap-4 mb-6" style="flex-wrap:wrap;">
      <div class="search-bar" style="flex:1;margin-bottom:0;min-width:250px;">
        <span class="material-symbols-outlined">search</span>
        <input type="text" placeholder="Search by name, email, or ID..." />
      </div>
      <select class="select-field" style="width:auto;min-width:140px;">
        <option>All Segments</option><option>Retail</option><option>Wholesale</option><option>VIP</option>
      </select>
      <select class="select-field" style="width:auto;min-width:140px;">
        <option>Sort by: Spend</option><option>Sort by: Orders</option><option>Sort by: Name</option>
      </select>
    </div>
    <div class="customer-grid stagger-children">
      ${users.map(user => `
        <div class="customer-card">
          ${user.isVip ? '<div style="position:absolute;top:12px;right:12px;"><span class="badge badge-vip">VIP</span></div>' : ''}
          <div class="card-top">
            <div class="avatar">${user.name.split(' ').map(n=>n[0]).join('')}</div>
            <div style="flex:1;">
              <div class="customer-name">${user.name}</div>
              <div class="customer-type">${user.tier || 'Retail'} • ID: #C-${user.id.slice(-5).toUpperCase()}</div>
            </div>
            <button class="btn btn-ghost btn-sm" style="padding:4px;">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          <div style="font-size:13px;color:var(--on-surface-variant);display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
            <div class="flex items-center gap-2"><span class="material-symbols-outlined" style="font-size:16px;">mail</span> ${user.email}</div>
            ${user.phone ? `<div class="flex items-center gap-2"><span class="material-symbols-outlined" style="font-size:16px;">call</span> ${user.phone}</div>` : ''}
            ${user.company ? `<div class="flex items-center gap-2"><span class="material-symbols-outlined" style="font-size:16px;">business</span> ${user.company}</div>` : ''}
            ${user.location ? `<div class="flex items-center gap-2"><span class="material-symbols-outlined" style="font-size:16px;">location_on</span> ${user.location}</div>` : ''}
          </div>
          <div class="customer-stats">
            <div class="stat-item"><div class="stat-label">Total Spend</div><div class="stat-val">$${(user.totalSpend || 0).toLocaleString('en-US', {minimumFractionDigits:2})}</div></div>
            <div class="stat-item"><div class="stat-label">Orders</div><div class="stat-val">${user.orderCount || 0}</div></div>
          </div>
          <div class="card-footer">
            <span>Last active: ${user.lastActive || 'N/A'}</span>
            <a href="#" class="text-secondary font-semibold">View Profile</a>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="pagination mt-6">
      <button class="page-btn">‹</button><button class="page-btn active">1</button><button class="page-btn">2</button><button class="page-btn">3</button><button class="page-btn">…</button><button class="page-btn">›</button>
    </div>
  `);
}

// --- Payment Gateways ---
function renderAdminPayments() {
  const settings = DataStore.get('storeSettings');
  return renderAdminLayout('payments', `
    <div class="admin-page-header">
      <div>
        <h1>Payment Methods</h1>
        <p class="page-desc">Configure and manage how your customers can pay during checkout.</p>
      </div>
      <div class="header-actions"><button class="btn btn-primary" onclick="showToast('Settings saved!', 'success')"><span class="material-symbols-outlined">save</span> Save Settings</button></div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <!-- UPI -->
        <div class="card mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-headline-md flex items-center gap-2"><span class="material-symbols-outlined">qr_code_2</span> UPI Configurations</h2>
            <div class="flex items-center gap-2"><span class="text-label-md ${settings.payments.upi.enabled ? 'text-success' : 'text-error'}">${settings.payments.upi.enabled ? 'Active' : 'Inactive'}</span>
              <label class="toggle-switch"><input type="checkbox" ${settings.payments.upi.enabled ? 'checked' : ''} /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
            </div>
          </div>
          <div class="flex items-center gap-4 p-4" style="background:var(--surface-container-low);border-radius:var(--radius-lg);">
            <div class="stat-icon" style="background:var(--surface-container-high);"><span class="material-symbols-outlined">qr_code</span></div>
            <div style="flex:1;"><div class="font-semibold">Primary Store UPI</div><div class="text-caption text-muted">${settings.payments.upi.id}</div></div>
            <button class="btn btn-outline btn-sm">View QR</button>
            <button class="btn btn-ghost btn-sm text-error"><span class="material-symbols-outlined" style="font-size:18px;">delete</span></button>
          </div>
          <div class="add-card mt-4" style="padding:16px;min-height:auto;">
            <span class="material-symbols-outlined">add_circle_outline</span><span class="text-label-md">Add New UPI ID</span>
          </div>
        </div>
        <!-- Bank Transfer -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-headline-md flex items-center gap-2"><span class="material-symbols-outlined">account_balance</span> Bank Transfer Details</h2>
            <span class="text-label-md text-muted">Inactive</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div class="input-group"><label>Account Name</label><input type="text" class="input-field" value="${settings.payments.bankTransfer.accountName}" /></div>
            <div class="input-group"><label>Account Number</label><input type="text" class="input-field" value="${settings.payments.bankTransfer.accountNumber}" /></div>
            <div class="input-group"><label>Bank Name</label><input type="text" class="input-field" value="${settings.payments.bankTransfer.bankName}" /></div>
            <div class="input-group"><label>Routing / IFSC Code</label><input type="text" class="input-field" value="${settings.payments.bankTransfer.ifsc}" /></div>
          </div>
          <p class="text-caption text-muted mt-3"><span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">info</span> These details will be shown to customers at checkout when 'Bank Transfer' is selected. Orders will remain pending until manually verified.</p>
        </div>
      </div>
      <div>
        <div class="card">
          <h3 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">credit_card</span> Standard Gateways</h3>
          <div class="flex flex-col gap-4">
            <div style="padding:16px;border:1px solid var(--outline-variant);border-radius:var(--radius-lg);">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2"><div class="avatar avatar-sm" style="background:var(--secondary);font-size:14px;">S</div><span class="font-semibold">Stripe</span></div>
                <label class="toggle-switch"><input type="checkbox" checked /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              </div>
              <button class="btn btn-outline btn-sm w-full mt-2"><span class="material-symbols-outlined" style="font-size:16px;">settings</span> Configure API Keys</button>
            </div>
            <div style="padding:16px;border:1px solid var(--outline-variant);border-radius:var(--radius-lg);opacity:0.6;">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2"><div class="avatar avatar-sm" style="background:#4a5568;font-size:14px;">R</div><span class="font-semibold">Razorpay</span></div>
                <label class="toggle-switch"><input type="checkbox" /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
              </div>
              <button class="btn btn-outline btn-sm w-full mt-2"><span class="material-symbols-outlined" style="font-size:16px;">settings</span> Configure API Keys</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

// --- Shipping & Taxes ---
function renderAdminShipping() {
  const settings = DataStore.get('storeSettings');
  return renderAdminLayout('shipping', `
    <div class="admin-page-header">
      <div><h1>Shipping & Taxes</h1><p class="page-desc">Configure logistics, delivery zones, and tax compliance for your storefront.</p></div>
      <div class="header-actions"><button class="btn btn-primary" onclick="showToast('Settings saved!', 'success')"><span class="material-symbols-outlined">save</span> Save Settings</button><button class="btn btn-outline">Discard Changes</button></div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <div class="card mb-6">
          <h2 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">local_shipping</span> Shipping Zones & Rates</h2>
          ${settings.shipping.zones.map(zone => `
            <div class="shipping-zone">
              <div class="zone-header">
                <div><div class="font-bold">${zone.name}</div><div class="text-caption text-muted">${zone.coverage}</div></div>
                <div class="flex items-center gap-3"><span class="badge ${zone.status === 'active' ? 'badge-success' : 'badge-neutral'}">${zone.status}</span>
                <button class="btn btn-ghost btn-sm"><span class="material-symbols-outlined" style="font-size:18px;">edit</span></button></div>
              </div>
              <div class="zone-rates">
                <div class="rate-item"><div class="rate-label">Standard Flat Rate</div><div class="rate-value">$${zone.standard.toFixed(2)}</div></div>
                ${zone.expedited ? `<div class="rate-item"><div class="rate-label">Expedited</div><div class="rate-value">$${zone.expedited.toFixed(2)}</div></div>` : ''}
              </div>
            </div>
          `).join('')}
          <div class="add-card" style="padding:16px;min-height:auto;"><span class="material-symbols-outlined">add</span><span class="text-label-md">Add New Shipping Zone</span></div>
        </div>
        <div class="card">
          <h2 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">redeem</span> Free Shipping Thresholds</h2>
          <p class="text-body-md text-muted mb-4">Encourage larger orders by waiving shipping fees.</p>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2" style="cursor:pointer;"><input type="checkbox" ${settings.shipping.freeShipping.enabled ? 'checked' : ''} style="accent-color:var(--secondary);width:18px;height:18px;" /><span class="font-semibold">Enable Free Domestic Shipping</span></label>
            <span class="text-body-md">on orders over</span>
            <div class="flex items-center gap-0"><span style="padding:12px;background:var(--surface-container-high);border:1px solid var(--subtle-gray);border-right:none;border-radius:var(--radius) 0 0 var(--radius);">$</span><input type="number" class="input-field" style="width:80px;border-radius:0 var(--radius) var(--radius) 0;" value="${settings.shipping.freeShipping.minAmount}" /></div>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <h3 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">calculate</span> Regional Taxes</h3>
          <div class="flex items-center justify-between mb-4">
            <span class="text-label-md">Auto-calculate taxes</span>
            <label class="toggle-switch"><input type="checkbox" ${settings.shipping.taxes.autoCalculate ? 'checked' : ''} /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
          </div>
          <div class="text-label-md mb-3">Base Tax Regions</div>
          ${settings.shipping.taxes.regions.map(region => `
            <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--surface-container-high);">
              <span>${region.state}</span>
              <span class="font-semibold" style="padding:4px 10px;border:1px solid var(--outline-variant);border-radius:var(--radius);">${region.rate}%</span>
            </div>
          `).join('')}
          <a href="#" class="text-secondary text-label-md flex items-center gap-1 mt-4"><span class="material-symbols-outlined" style="font-size:16px;">settings</span> Manage Tax Nexus</a>
        </div>
      </div>
    </div>
  `);
}

// --- SEO & Meta Settings ---
function renderAdminSeo() {
  const settings = DataStore.get('storeSettings');
  return renderAdminLayout('seo', `
    <div class="admin-page-header">
      <div><h1>SEO & Meta Settings</h1><p class="page-desc">Manage your site's search engine presence and metadata.</p></div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <div class="card mb-6">
          <h2 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">language</span> Global Metadata</h2>
          <div class="flex flex-col gap-4">
            <div class="input-group"><label>Site Title</label><input type="text" class="input-field" id="seo-title" value="${settings.seo.siteTitle}" oninput="updateSerpPreview()" /></div>
            <div class="input-group">
              <label>Meta Description</label>
              <textarea class="textarea-field" id="seo-desc" rows="3" oninput="updateSerpPreview()">${settings.seo.metaDescription}</textarea>
              <div class="flex justify-between mt-1"><span class="text-caption text-muted">Recommended: 150-160 characters.</span><span class="text-caption" id="seo-char-count" style="color:var(--success);">${settings.seo.metaDescription.length} chars</span></div>
            </div>
            <div class="input-group"><label>Target Keywords</label>
              <div class="flex items-center gap-2 flex-wrap mb-2" id="keyword-chips">
                ${settings.seo.keywords.map(kw => `<span class="chip">${kw} <span class="chip-remove" onclick="this.parentElement.remove()">×</span></span>`).join('')}
              </div>
              <input type="text" class="input-field" placeholder="Add keyword..." onkeydown="if(event.key==='Enter'){event.preventDefault();addKeyword(this);}" />
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="text-headline-md mb-4">Advanced Settings</h2>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between" style="padding:14px;background:var(--surface-container-low);border-radius:var(--radius-lg);">
              <div><div class="font-semibold">Search Engine Indexing</div><div class="text-caption text-muted">Allow search engines to index your site.</div></div>
              <label class="toggle-switch"><input type="checkbox" ${settings.seo.searchIndexing ? 'checked' : ''} /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
            </div>
            <div class="flex items-center justify-between" style="padding:14px;background:var(--surface-container-low);border-radius:var(--radius-lg);">
              <div><div class="font-semibold">XML Sitemap Generation</div><div class="text-caption text-muted">Automatically generate and update sitemap.xml.</div></div>
              <label class="toggle-switch"><input type="checkbox" ${settings.seo.xmlSitemap ? 'checked' : ''} /><span class="toggle-track"></span><span class="toggle-thumb"></span></label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="card" style="position:sticky;top:80px;">
          <h3 class="text-label-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined" style="font-size:18px;">search</span> SERP Preview</h3>
          <div class="serp-preview" id="serp-preview">
            <div class="serp-url">◉ https://qualityglass.com</div>
            <div class="serp-title" id="serp-title">${settings.seo.siteTitle}</div>
            <div class="serp-desc" id="serp-desc-preview">${settings.seo.metaDescription.substring(0, 160)}...</div>
          </div>
          <div class="flex gap-3 mt-4">
            <button class="btn btn-primary" style="flex:1;" onclick="showToast('SEO settings saved!', 'success')">Save Changes</button>
            <button class="btn btn-outline" style="flex:1;">Discard</button>
          </div>
        </div>
      </div>
    </div>
  `);
}

// --- Branding & Store Info ---
function renderAdminBranding() {
  const settings = DataStore.get('storeSettings');
  return renderAdminLayout('branding', `
    <div class="admin-page-header">
      <div><h1>Branding & Store Info</h1><p class="page-desc">Manage your brand identity, visuals, and business contact information.</p></div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <div class="card-tinted card mb-6">
          <h2 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">image</span> Store Logo & Icon</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
            <div>
              <div class="text-label-md mb-2">Primary Logo</div>
              <div style="width:160px;height:160px;border:1px solid var(--outline-variant);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;background:var(--surface-container-lowest);margin-bottom:8px;">
                <div style="text-align:center;padding:20px;"><div style="font-size:24px;font-weight:700;color:var(--primary);letter-spacing:0.05em;">AURELIA</div><div class="text-caption text-muted">GLASS & FRAME</div></div>
              </div>
              <div class="text-caption text-muted">Recommended: 512x512px, PNG</div>
            </div>
            <div>
              <div class="file-upload-zone" style="height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <span class="material-symbols-outlined" style="font-size:32px;color:var(--secondary);">cloud_upload</span>
                <div class="font-semibold mt-2">Click to upload</div>
                <div class="text-caption text-muted">or drag and drop a new logo</div>
                <div class="text-caption text-muted">SVG, PNG, JPG (max. 2MB)</div>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-4 mt-4">
            <div class="text-label-md">Favicon</div>
            <div style="width:32px;height:32px;border:1px solid var(--outline-variant);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;background:var(--primary);"><span style="color:white;font-size:14px;font-weight:700;">Q</span></div>
            <a href="#" class="text-secondary text-label-md">Change Favicon</a>
          </div>
        </div>
        <div class="card">
          <h2 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">palette</span> Brand Colors</h2>
          <div class="brand-color-grid">
            ${Object.entries(settings.colors).map(([name, color]) => `
              <div class="brand-color-item">
                <div class="text-caption font-medium" style="text-transform:capitalize;">${name}</div>
                <div class="brand-color-preview" style="background-color:${color};"></div>
                <div class="brand-color-hex">${color}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <h3 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">store</span> Store Details</h3>
          <div class="flex flex-col gap-4">
            <div class="input-group"><label>Store Name</label><input type="text" class="input-field" value="${settings.name}" /></div>
            <div class="input-group"><label>Public Contact Email</label><input type="email" class="input-field" value="${settings.email}" /></div>
            <div class="input-group"><label>Phone Number</label><input type="tel" class="input-field" value="${settings.phone}" /></div>
            <div class="input-group"><label>Business Address</label><textarea class="textarea-field" rows="3">${settings.address}</textarea></div>
          </div>
          <button class="btn btn-primary w-full mt-6" onclick="showToast('Brand settings saved!', 'success')"><span class="material-symbols-outlined">save</span> Save Brand Settings</button>
        </div>
      </div>
    </div>
  `);
}

// --- Edit Main Page / Content Editor ---
function renderAdminContentEditor() {
  const content = DataStore.get('pageContent');
  return renderAdminLayout('content', `
    <div class="page-builder-header">
      <h2 class="text-headline-md">Page Builder: Home</h2>
      <div class="flex gap-3"><button class="btn btn-outline">Discard</button><button class="btn btn-primary" onclick="showToast('Changes published!', 'success')">Publish Changes</button></div>
    </div>
    <div class="admin-content-grid sidebar-right">
      <div>
        <!-- Hero Module -->
        <div class="module-block">
          <div class="module-header"><span>Hero Banner Module</span><span class="material-symbols-outlined" style="font-size:18px;cursor:grab;">drag_indicator</span></div>
          <div class="module-content" style="position:relative;min-height:200px;background:var(--glass-tint);display:flex;align-items:center;justify-content:center;">
            <img src="${content.heroImage || 'assets/hero_banner_framing.png'}" style="width:100%;height:250px;object-fit:cover;opacity:0.3;" />
            <div class="overlay-text">
              <h2 class="text-headline-lg">${content.heroTitle}</h2>
              <p class="text-body-md text-muted">${content.heroSubtitle}</p>
              <button class="btn btn-primary">${content.heroCta}</button>
            </div>
          </div>
        </div>
        <!-- Bento Grid Module -->
        <div class="module-block">
          <div class="module-header"><span>Bento Grid: Categories</span><span class="material-symbols-outlined" style="font-size:18px;cursor:grab;">drag_indicator</span></div>
          <div class="module-content" style="padding:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;">
              <div style="grid-row:1/3;background:var(--surface-container-low);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:flex-end;min-height:200px;">
                <span class="font-semibold">Museum Quality</span>
              </div>
              <div style="background:var(--surface-container-high);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:flex-end;">
                <span class="text-label-md">Acrylic</span>
              </div>
              <div style="background:var(--surface-container-high);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:flex-end;">
                <span class="text-label-md">Frosted</span>
              </div>
              <div style="grid-column:2/4;background:var(--surface-container-low);border-radius:var(--radius-lg);padding:16px;display:flex;align-items:center;justify-content:center;">
                <span class="material-symbols-outlined text-secondary">add_circle</span>
                <span class="text-label-md text-secondary ml-2">Add Tile</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Add Module -->
        <div class="add-card" style="margin-top:16px;">
          <span class="material-symbols-outlined" style="font-size:32px;">add_box</span>
          <div class="font-semibold">Add New Module</div>
        </div>
      </div>
      <div>
        <div class="card" style="position:sticky;top:80px;">
          <h3 class="text-headline-md mb-4 flex items-center gap-2"><span class="material-symbols-outlined">tune</span> Properties</h3>
          <div style="text-align:center;padding:40px 20px;color:var(--subtle-gray);">
            <span class="material-symbols-outlined" style="font-size:48px;">touch_app</span>
            <p class="text-body-md mt-2">Select a module on the canvas to edit its properties.</p>
          </div>
        </div>
      </div>
    </div>
  `);
}

// ==========================================================================
// Helper Functions
// ==========================================================================

function approveOrder(orderId) {
  DataStore.update('orders', orderId, { status: 'processing', paymentProof: 'approved' });
  showToast('Order approved!', 'success');
  Router.handleRoute();
}

function rejectOrder(orderId) {
  DataStore.update('orders', orderId, { status: 'cancelled' });
  showToast('Order rejected.', 'error');
  Router.handleRoute();
}

function moderateReview(reviewId, action) {
  if (action === 'delete') {
    DataStore.delete('reviews', reviewId);
    showToast('Review deleted.', 'success');
  } else {
    DataStore.update('reviews', reviewId, { status: action });
    showToast(`Review ${action}!`, 'success');
  }
  Router.handleRoute();
}

function toggleTreeItem(catId) {
  const item = document.getElementById('tree-' + catId);
  if (!item) return;
  const children = item.querySelector('.tree-children');
  const icon = item.querySelector('.tree-item-header .material-symbols-outlined');
  if (children) {
    const isHidden = children.style.display === 'none';
    children.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : '';
  }
}

function toggleCategoryTree(action) {
  document.querySelectorAll('.tree-children').forEach(el => {
    el.style.display = action === 'expand' ? 'block' : 'none';
  });
}

function updateSerpPreview() {
  const title = document.getElementById('seo-title')?.value || '';
  const desc = document.getElementById('seo-desc')?.value || '';
  const titleEl = document.getElementById('serp-title');
  const descEl = document.getElementById('serp-desc-preview');
  const countEl = document.getElementById('seo-char-count');
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc.substring(0, 160) + (desc.length > 160 ? '...' : '');
  if (countEl) {
    countEl.textContent = desc.length + ' chars';
    countEl.style.color = desc.length >= 150 && desc.length <= 160 ? 'var(--success)' : desc.length > 160 ? 'var(--error)' : 'var(--warning)';
  }
}

function addKeyword(input) {
  const keyword = input.value.trim();
  if (keyword) {
    const container = document.getElementById('keyword-chips');
    container.insertAdjacentHTML('beforeend', `<span class="chip">${keyword} <span class="chip-remove" onclick="this.parentElement.remove()">×</span></span>`);
    input.value = '';
  }
}

function getCategoryName(catId) {
  const categories = DataStore.get('categories');
  for (const cat of categories) {
    if (cat.id === catId) return cat.name;
    if (cat.children) {
      const child = cat.children.find(c => c.id === catId);
      if (child) return child.name;
    }
  }
  return 'Unknown';
}
