// ==========================================================================
// Quality Glass Emporium — Cart Page
// ==========================================================================

function renderCart() {
  const cart = DataStore.get('cart');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 12.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return `
    ${renderSiteHeader()}
    <main class="page-container" style="padding-top: 24px; padding-bottom: 48px;">
      <h1 class="text-headline-lg mb-2 animate-fade-in">Shopping Cart</h1>
      <p class="text-body-md text-muted mb-6 animate-fade-in">${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart</p>

      ${cart.length === 0 ? `
        <div class="text-center" style="padding: 64px 20px;">
          <span class="material-symbols-outlined" style="font-size: 64px; color: var(--subtle-gray);">shopping_cart</span>
          <h2 class="text-headline-md mt-4">Your cart is empty</h2>
          <p class="text-body-md text-muted mt-2">Discover our premium frames and start framing your memories.</p>
          <a href="#/collections" class="btn btn-primary btn-lg mt-6">Browse Collections</a>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: 1fr; gap: 32px;" class="animate-fade-in-up">
          <div style="display: grid; grid-template-columns: 1fr; gap: 32px;" id="cart-layout">
            <!-- Cart Items -->
            <div>
              <div class="cart-items" id="cart-items-list">
                ${cart.map(item => `
                  <div class="cart-item" id="cart-item-${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
                    <div class="cart-item-info">
                      <div class="cart-item-name">${item.name}</div>
                      <div class="cart-item-meta">Size: ${item.size}; Qty: ${item.qty}</div>
                      <div class="flex items-center gap-3 mt-2">
                        <div class="quantity-control" style="transform: scale(0.85); transform-origin: left;">
                          <button onclick="updateCartQty('${item.id}', -1)">−</button>
                          <div class="qty-value">${item.qty}</div>
                          <button onclick="updateCartQty('${item.id}', 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
                      </div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary-card">
              <h3>Order Summary</h3>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Shipping ${shipping === 0 ? '(Free!)' : '(Standard)'}</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span class="amount">$${total.toFixed(2)}</span>
              </div>
              ${shipping > 0 ? `
                <p class="text-caption text-muted mt-2" style="text-align: center;">Add $${(150 - subtotal).toFixed(2)} more for free shipping!</p>
              ` : ''}
              <a href="#/checkout" class="btn btn-primary btn-lg w-full mt-4" style="justify-content: center;">
                <span class="material-symbols-outlined">lock</span>
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      `}
    </main>
    ${renderSiteFooter()}
    ${renderBottomNav('cart')}
  `;
}

function updateCartQty(itemId, delta) {
  const cart = DataStore.get('cart');
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    DataStore.set('cart', cart);
    Router.handleRoute(); // Re-render
  }
}

function removeFromCart(itemId) {
  const cart = DataStore.get('cart').filter(i => i.id !== itemId);
  DataStore.set('cart', cart);
  showToast('Item removed from cart', 'success');
  Router.handleRoute();
  updateCartBadge();
}
