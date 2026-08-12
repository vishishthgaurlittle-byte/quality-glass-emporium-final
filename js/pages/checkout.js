// ==========================================================================
// Quality Glass Emporium — Checkout Page
// ==========================================================================

function renderCheckout() {
  const cart = DataStore.get('cart');
  const user = Auth.getUser();
  
  if (cart.length === 0) {
    return `${renderSiteHeader()}<div class="page-container text-center" style="padding: 64px 20px;">
      <h1 class="text-headline-lg">Your cart is empty</h1>
      <a href="#/collections" class="btn btn-primary mt-6">Browse Collections</a>
    </div>${renderSiteFooter()}${renderBottomNav('cart')}`;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 25.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const userDetails = user ? DataStore.findById('users', user.id) : null;
  const defaultAddr = userDetails?.addresses?.find(a => a.isDefault) || { name: user?.name || '', line1: '', city: '', state: '', zip: '', country: 'United States' };

  return `
    ${renderSiteHeader()}
    <main class="page-container" style="padding-top: 24px; padding-bottom: 48px; max-width: 720px;">
      <h1 class="text-headline-lg mb-2 animate-fade-in">Checkout</h1>
      <p class="text-body-md text-muted mb-6 animate-fade-in">Review your order and complete payment.</p>

      <!-- Order Review -->
      <div class="checkout-section animate-fade-in-up">
        <h3><span class="material-symbols-outlined">shopping_cart_checkout</span> Order Review</h3>
        ${cart.map(item => `
          <div class="flex items-center gap-4 mb-4" style="padding: 12px; background: var(--surface-container-low); border-radius: var(--radius-lg);">
            <img src="${item.image}" alt="${item.name}" style="width: 64px; height: 64px; border-radius: var(--radius); object-fit: cover;" />
            <div style="flex: 1;">
              <div class="font-semibold" style="font-size: 14px;">${item.name}</div>
              <div class="text-caption text-muted">Size: ${item.size}; Qty: ${item.qty}</div>
            </div>
            <div class="font-bold">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Shipping Address -->
      <div class="checkout-section animate-fade-in-up" style="animation-delay: 0.1s;">
        <h3><span class="material-symbols-outlined">local_shipping</span> Shipping Address</h3>
        <div style="padding: 16px; background: var(--surface-container-low); border-radius: var(--radius-lg);">
          <div class="font-bold" style="font-size: 15px; margin-bottom: 4px;">${defaultAddr.name || 'Your Name'}</div>
          ${defaultAddr.line1 ? `
            <div class="text-body-md">${defaultAddr.line1}</div>
            <div class="text-body-md">${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.zip}</div>
            <div class="text-body-md">${defaultAddr.country}</div>
          ` : `
            <div class="input-group mb-3">
              <label>Address Line 1</label>
              <input type="text" class="input-field" id="checkout-addr1" placeholder="Street address" />
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="input-group">
                <label>City</label>
                <input type="text" class="input-field" id="checkout-city" />
              </div>
              <div class="input-group">
                <label>State</label>
                <input type="text" class="input-field" id="checkout-state" />
              </div>
            </div>
            <div class="input-group mt-3">
              <label>ZIP Code</label>
              <input type="text" class="input-field" id="checkout-zip" />
            </div>
          `}
          <a href="#" class="text-secondary text-label-md" style="display: inline-block; margin-top: 8px;">Edit Address</a>
        </div>
      </div>

      <!-- Upload Payment Proof -->
      <div class="checkout-section payment-proof animate-fade-in-up" style="animation-delay: 0.2s;">
        <h3><span class="material-symbols-outlined">receipt_long</span> Upload Payment Proof</h3>
        <p class="text-body-md text-muted mb-4">Please upload a screenshot of your bank transfer or payment receipt for admin verification.</p>
        <div class="file-upload-zone" id="payment-upload-zone" onclick="document.getElementById('payment-file-input').click()">
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--subtle-gray);">cloud_upload</span>
          <div class="font-semibold mt-2">Drag and drop your file here</div>
          <div class="text-caption text-muted">or click to browse (JPG, PNG, PDF up to 5MB)</div>
          <button class="btn btn-primary btn-sm mt-4">Select File</button>
          <input type="file" id="payment-file-input" accept=".jpg,.jpeg,.png,.pdf" style="display: none;" onchange="handlePaymentUpload(this)" />
        </div>
        <div id="payment-preview" style="display: none; margin-top: 16px;"></div>
      </div>

      <!-- Order Summary -->
      <div class="checkout-section animate-fade-in-up" style="animation-delay: 0.3s;">
        <h3 style="font-size: 20px;">Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping (Standard)</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
        <div class="summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="summary-row total">
          <span>Total</span>
          <span class="amount">$${total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Submit -->
      <button class="btn btn-primary btn-lg w-full animate-fade-in-up" style="justify-content: center; animation-delay: 0.4s;" onclick="submitOrder()" id="submit-order-btn">
        <span class="material-symbols-outlined">check_circle</span>
        Submit Order for Approval
      </button>
      <p class="text-caption text-muted text-center mt-3">
        By submitting, you agree to our <a href="#" class="text-secondary">Terms of Service</a> and <a href="#" class="text-secondary">Privacy Policy</a>.
      </p>
    </main>
    ${renderSiteFooter()}
    ${renderBottomNav('cart')}
  `;
}

function handlePaymentUpload(input) {
  const file = input.files[0];
  if (!file) return;
  
  const preview = document.getElementById('payment-preview');
  const zone = document.getElementById('payment-upload-zone');
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `
        <div class="flex items-center gap-3" style="padding: 12px; background: var(--success-container); border-radius: var(--radius-lg);">
          <span class="material-symbols-outlined text-success">check_circle</span>
          <div style="flex: 1;">
            <div class="font-semibold" style="font-size: 14px;">${file.name}</div>
            <div class="text-caption text-muted">${(file.size / 1024).toFixed(1)} KB</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="clearPaymentUpload()">Remove</button>
        </div>
      `;
      preview.style.display = 'block';
      zone.style.borderColor = 'var(--success)';
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = `
      <div class="flex items-center gap-3" style="padding: 12px; background: var(--success-container); border-radius: var(--radius-lg);">
        <span class="material-symbols-outlined text-success">description</span>
        <div style="flex: 1;">
          <div class="font-semibold" style="font-size: 14px;">${file.name}</div>
          <div class="text-caption text-muted">${(file.size / 1024).toFixed(1)} KB</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="clearPaymentUpload()">Remove</button>
      </div>
    `;
    preview.style.display = 'block';
    zone.style.borderColor = 'var(--success)';
  }
}

function clearPaymentUpload() {
  document.getElementById('payment-preview').style.display = 'none';
  document.getElementById('payment-file-input').value = '';
  document.getElementById('payment-upload-zone').style.borderColor = '';
}

function submitOrder() {
  if (!Auth.isLoggedIn()) {
    showToast('Please log in to place an order', 'error');
    Router.navigate('/login');
    return;
  }
  
  const cart = DataStore.get('cart');
  if (cart.length === 0) return;
  
  const user = Auth.getUser();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 25.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  const order = {
    id: 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 900) + 100),
    customerId: user.id,
    customerName: user.name,
    date: new Date().toISOString().split('T')[0],
    status: 'pending_approval',
    total: total,
    items: cart.map(item => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      qty: item.qty,
      price: item.price
    })),
    shippingAddress: { name: user.name },
    paymentProof: 'uploaded',
    paymentMethod: 'bank_transfer'
  };
  
  DataStore.add('orders', order);
  DataStore.set('cart', []);
  
  showToast('Order submitted for approval!', 'success');
  updateCartBadge();
  Router.navigate('/account/orders');
}
