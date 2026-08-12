// ==========================================================================
// Quality Glass Emporium — Authentication Module (Vercel Serverless)
// ==========================================================================

const Auth = {
  _sessionKey: 'qge_session',
  _tokenKey: 'qge_token',
  _guestKey: 'qge_guest_id',
  _apiUrl: '/api', // Relative path since frontend and backend are on Vercel

  // Initialize Guest Session
  initGuest() {
    if (!localStorage.getItem(this._guestKey) && !this.isLoggedIn()) {
      const guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(this._guestKey, guestId);
    }
  },

  getGuestId() {
    return localStorage.getItem(this._guestKey);
  },

  // Get current user session
  getUser() {
    const session = localStorage.getItem(this._sessionKey);
    return session ? JSON.parse(session) : null;
  },

  getToken() {
    return localStorage.getItem(this._tokenKey);
  },

  // Check if logged in
  isLoggedIn() {
    return !!this.getUser() && !!this.getToken();
  },

  // Check if admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // Login via Vercel API
  async login(email, password) {
    try {
      const response = await fetch(`${this._apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          guestId: this.getGuestId()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem(this._tokenKey, data.token);
        localStorage.setItem(this._sessionKey, JSON.stringify(data.user));
        localStorage.removeItem(this._guestKey); // Clear guest ID after merging
        
        await this.syncCartFromServer(data.user.id);
        
        return { success: true, user: data.user };
      }
      
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error connecting to Vercel API' };
    }
  },

  // Signup via Vercel API
  async signup(name, email, password) {
    try {
      const response = await fetch(`${this._apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          guestId: this.getGuestId()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem(this._tokenKey, data.token);
        localStorage.setItem(this._sessionKey, JSON.stringify(data.user));
        localStorage.removeItem(this._guestKey);
        
        await this.syncCartFromServer(data.user.id);
        
        return { success: true, user: data.user };
      }
      
      return { success: false, error: data.error || 'Signup failed' };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'Network error connecting to Vercel API' };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(this._sessionKey);
    localStorage.removeItem(this._tokenKey);
    this.initGuest();
    DataStore.set('cart', []); // Clear local cart
    Router.navigate('/');
  },

  // Sync cart from server
  async syncCartFromServer(userId) {
    try {
      const response = await fetch(`${this._apiUrl}/cart?userId=${userId}`);
      const data = await response.json();
      if (data.items) {
        DataStore.set('cart', data.items);
        updateCartBadge();
      }
    } catch (err) {
      console.error('Cart sync error:', err);
    }
  },

  // Push local cart to server (called by frontend when adding to cart)
  async updateServerCart(items) {
    try {
      await fetch(`${this._apiUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.getUser()?.id,
          guestId: this.getGuestId(),
          items: items
        })
      });
    } catch (err) {
      console.error('Failed to sync cart to Vercel', err);
    }
  }
};

// Initialize guest session on load
Auth.initGuest();
