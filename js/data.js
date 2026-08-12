// ==========================================================================
// Quality Glass Emporium — Data Store
// All mock data for the platform, persisted via localStorage
// ==========================================================================

const DataStore = {
  _storageKey: 'qge_data',

  // Initialize data store
  init() {
    if (!localStorage.getItem(this._storageKey)) {
      localStorage.setItem(this._storageKey, JSON.stringify(this._defaultData()));
    }
    return this;
  },

  // Get all data
  getAll() {
    return JSON.parse(localStorage.getItem(this._storageKey));
  },

  // Save all data
  saveAll(data) {
    localStorage.setItem(this._storageKey, JSON.stringify(data));
  },

  // Get specific collection
  get(collection) {
    const data = this.getAll();
    return data[collection] || [];
  },

  // Set specific collection
  set(collection, value) {
    const data = this.getAll();
    data[collection] = value;
    this.saveAll(data);
  },

  // Add to collection
  add(collection, item) {
    const data = this.getAll();
    if (!data[collection]) data[collection] = [];
    item.id = item.id || this._generateId();
    item.createdAt = item.createdAt || new Date().toISOString();
    data[collection].push(item);
    this.saveAll(data);
    return item;
  },

  // Update item in collection
  update(collection, id, updates) {
    const data = this.getAll();
    const idx = data[collection].findIndex(item => item.id === id);
    if (idx > -1) {
      data[collection][idx] = { ...data[collection][idx], ...updates };
      this.saveAll(data);
      return data[collection][idx];
    }
    return null;
  },

  // Delete from collection
  delete(collection, id) {
    const data = this.getAll();
    data[collection] = data[collection].filter(item => item.id !== id);
    this.saveAll(data);
  },

  // Find by ID
  findById(collection, id) {
    const data = this.getAll();
    return (data[collection] || []).find(item => item.id === id);
  },

  // Reset to defaults
  reset() {
    localStorage.setItem(this._storageKey, JSON.stringify(this._defaultData()));
  },

  _generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  },

  // ======================================================================
  // Default Data
  // ======================================================================
  _defaultData() {
    return {
      // --- Store Settings ---
      storeSettings: {
        name: 'Quality Glass Emporium',
        tagline: 'Crafting clarity and elegance for your cherished memories.',
        email: 'hello@qualityglass.com',
        phone: '+1 (555) 123-4567',
        address: '123 Artisan Way\nSuite 400\nCraftstown, CT 06001',
        logo: null,
        favicon: null,
        colors: {
          primary: '#00162c',
          secondary: '#005faf',
          background: '#fcf9f8',
          accent: '#382600'
        },
        seo: {
          siteTitle: 'Quality Glass Emporium',
          metaDescription: 'Premium artisan glass frames and custom display solutions for your most cherished memories. Explore our collection of handcrafted designs.',
          keywords: ['artisan glass', 'custom frames', 'display cases'],
          searchIndexing: true,
          xmlSitemap: true
        },
        shipping: {
          zones: [
            { id: 'zone_1', name: 'Domestic (US)', coverage: 'All 50 states and territories', standard: 12.00, expedited: 25.00, status: 'active' },
            { id: 'zone_2', name: 'International (EU & UK)', coverage: 'Selected European countries', standard: 45.00, expedited: null, status: 'draft' }
          ],
          freeShipping: { enabled: true, minAmount: 150 },
          taxes: {
            autoCalculate: true,
            regions: [
              { state: 'California (CA)', rate: 7.25 },
              { state: 'New York (NY)', rate: 4.00 },
              { state: 'Texas (TX)', rate: 6.25 }
            ]
          }
        },
        payments: {
          upi: { enabled: true, id: 'store@upi' },
          bankTransfer: { enabled: false, accountName: 'Quality Glass Emporium', accountNumber: '**** **** 4567', bankName: 'Global Business Bank', ifsc: 'GBB0001234' },
          stripe: { enabled: true },
          razorpay: { enabled: false }
        }
      },

      // --- Users ---
      users: [],

      // --- Categories ---
      categories: [
        { id: 'cat_frames', name: 'Frames', icon: '🖼️', itemCount: 124, slug: 'frames', active: true, children: [
          { id: 'cat_wood', name: 'Wood Frames', itemCount: 82, slug: 'wood-frames', icon: '🪵' },
          { id: 'cat_metal', name: 'Metal Frames', itemCount: 42, slug: 'metal-frames', icon: '⚙️' }
        ]},
        { id: 'cat_glass', name: 'Custom Glass', icon: '💎', itemCount: 18, slug: 'custom-glass', active: true, children: [] },
        { id: 'cat_mat', name: 'Mat Boards', icon: '📐', itemCount: 56, slug: 'mat-boards', active: true, children: [] },
        { id: 'cat_acrylic', name: 'Acrylics', icon: '✨', itemCount: 24, slug: 'acrylics', active: true, children: [] }
      ],

      // --- Products ---
      products: [],

      // --- Orders ---
      orders: [],

      // --- Cart ---
      cart: [],

      // --- Reviews ---
      reviews: [
        { id: 'rev_1', productId: 'prod_1', userId: 'user_eleanor', userName: 'Eleanor V.', rating: 5, text: 'Absolutely stunning frame. The dark espresso finish is even more beautiful in person. Museum-quality glass is crystal clear.', date: '2024-10-20', status: 'approved' },
        { id: 'rev_2', productId: 'prod_2', userId: 'user_arthur', userName: 'Arthur P.', rating: 5, text: 'Perfect for our gallery. We ordered 20 of these for our latest exhibition. The floating effect is mesmerizing.', date: '2024-10-18', status: 'approved' },
        { id: 'rev_3', productId: 'prod_3', userId: 'user_julianne', userName: 'Julianne D.', rating: 4, text: 'Great quality for the price. Solid wood construction and the glass is very clear. Only wish they had more color options.', date: '2024-10-15', status: 'pending' },
        { id: 'rev_4', productId: 'prod_1', userId: 'user_alex', userName: 'Alex T.', rating: 5, text: 'This is my third order. Consistently excellent quality. The custom sizing option is a game-changer.', date: '2024-10-10', status: 'approved' },
        { id: 'rev_5', productId: 'prod_5', userId: 'user_arthur', userName: 'Arthur P.', rating: 3, text: 'Good quality acrylic but arrived with a minor scratch on one corner. Customer service was helpful though.', date: '2024-10-05', status: 'flagged' }
      ],

      // --- Coupons ---
      coupons: [
        { id: 'coup_1', code: 'SUMMER24', type: '20% Off Order', usage: 142, maxUsage: 500, status: 'active', expiresAt: '2025-08-31' },
        { id: 'coup_2', code: 'FREESHIP', type: 'Free Shipping', usage: 89, maxUsage: null, status: 'active', expiresAt: null },
        { id: 'coup_3', code: 'WELCOME10', type: '10% Off First Order', usage: 231, maxUsage: null, status: 'active', expiresAt: null },
        { id: 'coup_4', code: 'GALLERY50', type: '$50 Off $500+', usage: 12, maxUsage: 50, status: 'inactive', expiresAt: '2025-01-31' }
      ],

      // --- Banners ---
      banners: [
        { id: 'ban_1', title: 'Spring Collection Launch', link: '/collections/spring-2024', sequence: 1, status: 'active', tab: 'homepage', image: 'assets/hero_banner_framing.png' },
        { id: 'ban_2', title: 'Premium Museum Glass', link: '/materials/museum-glass', sequence: 2, status: 'active', tab: 'homepage', image: 'assets/glass_museum_sheet.png' }
      ],

      // --- Dashboard Stats (Admin) ---
      dashboardStats: {
        totalRevenue: 24592.00,
        revenueChange: 12,
        grossSales: 342,
        salesChange: 8,
        activeSessions: 1204,
        avgOrderValue: 71.90,
        aovChange: -2
      },

      // --- Low Stock Alerts ---
      lowStockAlerts: [
        { productId: 'prod_5', name: 'Premium Acrylic Sheet (24x36)', remaining: 2 },
        { productId: 'prod_6', name: 'Matte Black Metal Frame (18x24)', remaining: 5 },
        { productId: 'prod_3', name: 'Non-Glare Museum Glass (11x14)', remaining: 8 }
      ],

      // --- Page Content ---
      pageContent: {
        heroTitle: 'Elevate Your Space',
        heroSubtitle: 'Premium artisan glass for modern framing.',
        heroCta: 'Shop Now',
        heroImage: 'assets/hero_banner_framing.png'
      }
    };
  }
};
