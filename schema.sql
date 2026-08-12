-- Quality Glass Emporium - Complete Supabase Schema

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  customerId VARCHAR(255),
  customerName VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending_approval',
  total NUMERIC(10,2) NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  shippingAddress JSONB DEFAULT '{}'::jsonb,
  paymentProof VARCHAR(255),
  paymentMethod VARCHAR(50)
);

-- 2. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id VARCHAR(255) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50),
  usage INTEGER DEFAULT 0,
  maxUsage INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  expiresAt TIMESTAMP
);

-- 3. Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  link VARCHAR(255),
  sequence INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  tab VARCHAR(50) DEFAULT 'homepage',
  image VARCHAR(255)
);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(255) PRIMARY KEY,
  productId VARCHAR(255),
  userId VARCHAR(255),
  userName VARCHAR(255),
  rating INTEGER DEFAULT 5,
  text TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending'
);

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(255) PRIMARY KEY,
  data JSONB NOT NULL
);

-- Insert Default Settings
INSERT INTO settings (id, data) VALUES (
  'store_config',
  '{"name": "Quality Glass Emporium", "tagline": "Crafting clarity and elegance", "email": "hello@qualityglass.com"}'
) ON CONFLICT (id) DO NOTHING;
