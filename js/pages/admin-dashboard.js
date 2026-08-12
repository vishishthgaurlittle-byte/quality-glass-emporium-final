// ==========================================================================
// Quality Glass Emporium — Admin Dashboard
// ==========================================================================

function renderAdminDashboard() {
  const stats = DataStore.get('dashboardStats');
  const orders = DataStore.get('orders').slice(0, 4);
  const alerts = DataStore.get('lowStockAlerts');

  return renderAdminLayout('dashboard', `
    <div class="animate-fade-in">
      <h1 class="text-display-lg mb-2" style="font-size: 36px;">Store Overview</h1>
      <p class="text-body-md text-muted mb-8">Welcome back. Here's a summary of your store's performance today.</p>
    </div>

    <!-- KPI Cards -->
    <div class="stats-grid stagger-children">
      <div class="stat-card">
        <div>
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">$${stats.totalRevenue.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          <div class="stat-change positive">↗ +${stats.revenueChange}% from last month</div>
        </div>
        <div class="stat-icon" style="background: #dbeafe; color: var(--secondary);">
          <span class="material-symbols-outlined">payments</span>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Gross Sales</div>
          <div class="stat-value">${stats.grossSales}</div>
          <div class="stat-change positive">↗ +${stats.salesChange}% from last month</div>
        </div>
        <div class="stat-icon" style="background: #dcfce7; color: var(--success);">
          <span class="material-symbols-outlined">receipt</span>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Active Sessions</div>
          <div class="stat-value">${stats.activeSessions.toLocaleString()}</div>
          <div class="stat-change" style="color: var(--subtle-gray);">Real-time visitors</div>
        </div>
        <div class="stat-icon" style="background: #f3e8ff; color: #7c3aed;">
          <span class="material-symbols-outlined">group</span>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Avg. Order Value</div>
          <div class="stat-value">$${stats.avgOrderValue.toFixed(2)}</div>
          <div class="stat-change negative">↘ ${stats.aovChange}% from last month</div>
        </div>
        <div class="stat-icon" style="background: #fef3c7; color: #d97706;">
          <span class="material-symbols-outlined">analytics</span>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="card mt-8 animate-fade-in-up" style="animation-delay: 0.3s;">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-headline-md">Recent Orders</h2>
        <a href="#/admin/orders" class="text-secondary text-label-md">View All</a>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${orders.map(order => `
            <tr>
              <td class="font-semibold">#${order.id}</td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="avatar avatar-sm">${order.customerName.split(' ').map(n=>n[0]).join('')}</div>
                  ${order.customerName}
                </div>
              </td>
              <td>${formatDate(order.date)}</td>
              <td>${renderStatusBadge(order.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Low Stock Alerts -->
    <div class="card mt-6 animate-fade-in-up" style="animation-delay: 0.4s;">
      <div class="flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined" style="color: var(--warning);">warning</span>
        <h2 class="text-headline-md">Low Stock Alerts</h2>
      </div>
      <div class="alert-list">
        ${alerts.map(alert => `
          <div class="alert-item">
            <div class="alert-icon">
              <span class="material-symbols-outlined" style="font-size: 18px;">inventory_2</span>
            </div>
            <div class="alert-text">
              <div class="item-name">${alert.name}</div>
              <div class="item-count">${alert.remaining} units remaining</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-outline w-full mt-4" style="justify-content: center;" onclick="Router.navigate('/admin/products')">
        Manage Inventory
      </button>
    </div>
  `);
}
