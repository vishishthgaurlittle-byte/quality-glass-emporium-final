// ==========================================================================
// Quality Glass Emporium — SPA Router
// Hash-based routing for single-page navigation
// ==========================================================================

const Router = {
  routes: {},
  currentRoute: null,
  beforeEach: null,

  // Register a route
  on(path, handler) {
    this.routes[path] = handler;
    return this;
  },

  // Navigate to a route
  navigate(path) {
    window.location.hash = '#' + path;
  },

  // Get current hash path
  getPath() {
    return window.location.hash.slice(1) || '/';
  },

  // Parse path with params (e.g., /product/:id)
  matchRoute(path) {
    // Exact match first
    if (this.routes[path]) {
      return { handler: this.routes[path], params: {} };
    }

    // Pattern matching
    for (const routePath in this.routes) {
      const routeParts = routePath.split('/');
      const pathParts = path.split('/');

      if (routeParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { handler: this.routes[routePath], params };
      }
    }

    return null;
  },

  // Handle route change
  async handleRoute() {
    const rawPath = this.getPath();
    const path = rawPath.split('?')[0];
    const match = this.matchRoute(path);

    if (this.beforeEach) {
      const allowed = this.beforeEach(path);
      if (!allowed) return;
    }

    if (match) {
      this.currentRoute = path;
      const appEl = document.getElementById('app');
      
      // Fade out
      appEl.style.opacity = '0';
      
      await new Promise(r => setTimeout(r, 150));
      
      try {
        const html = await match.handler(match.params);
        appEl.innerHTML = html;
        
        // Fade in
        requestAnimationFrame(() => {
          appEl.style.opacity = '1';
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Trigger page-specific init
        const event = new CustomEvent('routeChanged', { detail: { path, params: match.params } });
        document.dispatchEvent(event);
        
      } catch (err) {
        console.error('Route handler error:', err);
        appEl.innerHTML = `<div class="page-container" style="padding: 64px 20px; text-align: center;">
          <h1 class="text-headline-lg">Something went wrong</h1>
          <p class="text-body-md text-muted mt-4">Please try again later.</p>
          <a href="#/" class="btn btn-primary mt-6">Go Home</a>
        </div>`;
        appEl.style.opacity = '1';
      }
    } else {
      // 404
      const appEl = document.getElementById('app');
      appEl.innerHTML = `<div class="page-container" style="padding: 64px 20px; text-align: center;">
        <h1 class="text-display-lg">404</h1>
        <p class="text-body-lg text-muted mt-4">Page not found</p>
        <a href="#/" class="btn btn-primary mt-6">Go Home</a>
      </div>`;
      appEl.style.opacity = '1';
    }
  },

  // Initialize router
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    // Handle initial load
    if (!window.location.hash) {
      window.location.hash = '#/';
    } else {
      this.handleRoute();
    }
    return this;
  }
};
