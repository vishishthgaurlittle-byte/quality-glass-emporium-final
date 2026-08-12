// ==========================================================================
// Quality Glass Emporium — User Dashboard
// ==========================================================================

function renderUserDashboard() {
  const user = Auth.getUser();
  const userDetails = DataStore.findById('users', user.id);
  const orders = DataStore.get('orders').filter(o => o.customerId === user.id);
  const recentOrders = orders.slice(0, 3);
  const activeOrders = orders.filter(o => ['pending_approval', 'processing', 'shipped'].includes(o.status)).length;
  const products = DataStore.get('products');

  return `
    ${renderSiteHeader()}
    <div class="account-layout">
      ${renderAccountSidebar('dashboard')}
      <div class="account-main">
        <!-- Welcome Banner -->
        <div class="welcome-banner animate-fade-in">
          <h1>Welcome back, ${user.name.split(' ')[0]}.</h1>
          <p>Manage your premium framing projects, track shipments, and explore artisan collections curated just for you.</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid animate-fade-in-up" style="animation-delay: 0.1s;">
          <div class="stat-card">
            <div>
              <div class="stat-label">ACTIVE ORDERS</div>
              <div class="stat-value">${activeOrders}</div>
            </div>
            <div class="stat-icon" style="background: #dbeafe; color: var(--secondary);">
              <span class="material-symbols-outlined">local_shipping</span>
            </div>
          </div>
          <div class="stat-card">
            <div>
              <div class="stat-label">REWARD POINTS</div>
              <div class="stat-value">${userDetails?.rewardPoints || 0}</div>
            </div>
            <div class="stat-icon" style="background: #fef3c7; color: #d97706;">
              <span class="material-symbols-outlined">loyalty</span>
            </div>
          </div>
          <div class="stat-card">
            <div>
              <div class="stat-label">SAVED ITEMS</div>
              <div class="stat-value">${userDetails?.savedItems || 0}</div>
            </div>
            <div class="stat-icon" style="background: #f3e8ff; color: #7c3aed;">
              <span class="material-symbols-outlined">bookmark</span>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card mt-6 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-headline-md">Recent Orders</h2>
            <a href="#/account/orders" class="text-secondary text-label-md">View All</a>
          </div>
          ${recentOrders.length > 0 ? `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${recentOrders.map(order => `
                  <tr style="cursor: pointer;" onclick="Router.navigate('/account/orders')">
                    <td class="font-semibold">#${order.id}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${renderStatusBadge(order.status)}</td>
                    <td style="text-align: right; font-weight: 600;">$${order.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <p class="text-body-md text-muted text-center" style="padding: 24px;">No orders yet. Start shopping!</p>
          `}
        </div>

        <!-- Recommended Products -->
        <div class="mt-8 animate-fade-in-up" style="animation-delay: 0.3s;">
          <h2 class="text-headline-md mb-4">Recommended for You</h2>
          <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
            ${products.slice(0, 3).map(p => `
              <div class="product-card" onclick="Router.navigate('/product/${p.id}')">
                <img src="${p.images[0] || ''}" alt="${p.name}" class="product-image" />
                <div class="product-info">
                  <h3 class="product-title" style="font-size: 14px;">${p.name}</h3>
                  <p class="product-desc">${p.subtitle}</p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="font-semibold">From $${p.price.toFixed(0)}</span>
                    <a href="#/product/${p.id}" class="text-secondary text-label-md">Configure →</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    ${renderSiteFooter()}
    ${renderBottomNav('profile')}
  `;
}

// --- User Order History ---
function renderUserOrders() {
  const user = Auth.getUser();
  const orders = DataStore.get('orders').filter(o => o.customerId === user.id);

  return `
    ${renderSiteHeader()}
    <div class="account-layout">
      ${renderAccountSidebar('orders')}
      <div class="account-main">
        <div class="flex items-center justify-between mb-6 animate-fade-in" style="flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 class="text-headline-lg">Order History</h1>
            <p class="text-body-md text-muted">Track, manage, and review your past framing projects.</p>
          </div>
          <div class="flex gap-3" style="flex-wrap: wrap;">
            <div class="search-bar" style="margin-bottom: 0; min-width: 200px;">
              <span class="material-symbols-outlined">search</span>
              <input type="text" placeholder="Search by Order ID" />
            </div>
            <select class="select-field" style="width: auto;">
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div class="stagger-children" style="display: flex; flex-direction: column; gap: 16px;">
          ${orders.map(order => `
            <div class="card" style="padding: 20px;">
              <div class="flex items-center gap-4" style="flex-wrap: wrap;">
                <div style="width: 60px; height: 60px; border-radius: var(--radius); background: var(--surface-container-low); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <span class="material-symbols-outlined" style="color: var(--subtle-gray);">frame_inspect</span>
                </div>
                <div style="flex: 1; min-width: 200px;">
                  <div class="flex items-center gap-3">
                    <span class="font-bold" style="font-size: 18px;">#${order.id}</span>
                    ${renderStatusBadge(order.status)}
                  </div>
                  <div class="text-caption text-muted mt-1">Placed on ${formatDate(order.date)}</div>
                </div>
                <div class="text-right">
                  <div class="font-bold" style="font-size: 20px;">$${order.total.toFixed(2)}</div>
                  <button class="btn btn-outline btn-sm mt-2">View Details</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        ${orders.length > 3 ? `
          <div class="pagination mt-6">
            <button class="page-btn">‹</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">›</button>
          </div>
        ` : ''}
      </div>
    </div>
    ${renderSiteFooter()}
    ${renderBottomNav('profile')}
  `;
}

// --- User Profile Settings ---
function renderUserSettings() {
  const user = Auth.getUser();
  const userDetails = DataStore.findById('users', user.id);

  return `
    ${renderSiteHeader()}
    <div class="account-layout">
      ${renderAccountSidebar('settings')}
      <div class="account-main">
        <h1 class="text-headline-lg mb-2 animate-fade-in">Profile Settings</h1>
        <p class="text-body-md text-muted mb-8 animate-fade-in">Manage your account details, security preferences, and shipping information.</p>

        <!-- Personal Information -->
        <div class="card-tinted card mb-6 animate-fade-in-up">
          <h2 class="text-headline-md mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined">person</span> Personal Information
          </h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" class="settings-grid">
            <div class="input-group">
              <label>Full Name</label>
              <input type="text" class="input-field" id="settings-name" value="${userDetails?.name || user.name}" />
            </div>
            <div class="input-group">
              <label>Email Address</label>
              <input type="email" class="input-field" id="settings-email" value="${user.email}" />
            </div>
            <div class="input-group">
              <label>Phone Number</label>
              <input type="tel" class="input-field" id="settings-phone" value="${userDetails?.phone || ''}" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <div class="flex justify-between mt-6" style="justify-content: flex-end;">
            <button class="btn btn-primary" onclick="saveUserSettings()">Save Changes</button>
          </div>
        </div>

        <!-- Password & Security -->
        <div class="card-tinted card animate-fade-in-up" style="animation-delay: 0.1s;">
          <h2 class="text-headline-md mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined">lock</span> Password & Security
          </h2>
          <div style="max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
            <div class="input-group">
              <label>Current Password</label>
              <input type="password" class="input-field" value="********" />
            </div>
            <div class="input-group">
              <label>New Password</label>
              <input type="password" class="input-field" placeholder="" />
            </div>
            <div class="input-group">
              <label>Confirm New Password</label>
              <input type="password" class="input-field" placeholder="" />
            </div>
          </div>
          <div class="mt-6">
            <button class="btn btn-outline" onclick="showToast('Password updated!', 'success')">Update Password</button>
          </div>
        </div>
      </div>
    </div>
    ${renderSiteFooter()}
    ${renderBottomNav('profile')}
  `;
}

function saveUserSettings() {
  const name = document.getElementById('settings-name')?.value;
  const email = document.getElementById('settings-email')?.value;
  const phone = document.getElementById('settings-phone')?.value;
  
  const user = Auth.getUser();
  DataStore.update('users', user.id, { name, email, phone });
  Auth.updateSession({ name, email });
  showToast('Profile updated successfully!', 'success');
}

// --- Account Sidebar ---
function renderAccountSidebar(active) {
  const user = Auth.getUser();
  const items = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/account' },
    { id: 'orders', icon: 'history', label: 'Order History', path: '/account/orders' },
    { id: 'addresses', icon: 'location_on', label: 'Addresses', path: '#' },
    { id: 'settings', icon: 'person', label: 'Profile Settings', path: '/account/settings' },
    { id: 'support', icon: 'help', label: 'Support', path: '#' }
  ];

  return `
    <aside class="account-sidebar">
      <div class="user-info">
        <div class="user-avatar">
          <div class="avatar avatar-lg">${user.name.split(' ').map(n=>n[0]).join('')}</div>
        </div>
        <div class="user-name">${user.name}</div>
        <div class="user-tier">${user.tier || 'Standard Member'}</div>
      </div>
      <nav class="account-nav">
        ${items.map(item => `
          <a href="#${item.path}" class="account-nav-item ${active === item.id ? 'active' : ''}">
            <span class="material-symbols-outlined" style="font-size: 20px;">${item.icon}</span>
            ${item.label}
          </a>
        `).join('')}
      </nav>
      <button class="btn btn-secondary new-project-btn" onclick="Router.navigate('/collections')">
        + New Frame Project
      </button>
    </aside>
  `;
}
