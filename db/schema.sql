-- MeaMart Multi-Vendor E-Commerce Schema
-- Cloudflare D1 Database Schema
-- SQLite3 Compatible

-- ============================================
-- MERCHANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  bot_id TEXT UNIQUE,
  sheet_url TEXT,
  webhook_secret TEXT NOT NULL,
  plan TEXT DEFAULT 'basic' CHECK(plan IN ('basic', 'pro', 'enterprise')),
  verified BOOLEAN DEFAULT 0,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for merchant lookups by phone
CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone);
-- Index for merchant lookups by bot_id
CREATE INDEX IF NOT EXISTS idx_merchants_bot_id ON merchants(bot_id);
-- Index for plan filtering
CREATE INDEX IF NOT EXISTS idx_merchants_plan ON merchants(plan);
-- Index for active merchant filtering
CREATE INDEX IF NOT EXISTS idx_merchants_active ON merchants(active);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  product_ids TEXT NOT NULL, -- JSON array of product IDs
  product_names TEXT NOT NULL, -- JSON array of product names
  total_amount DECIMAL(10, 2) NOT NULL CHECK(total_amount > 0),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  whatsapp_message_id TEXT,
  payment_method TEXT DEFAULT 'cash_on_delivery',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  delivered_at DATETIME,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- Index for order lookups by merchant
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
-- Index for order lookups by customer phone
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
-- Index for order status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
-- Index for WhatsApp message tracking
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp_message_id ON orders(whatsapp_message_id);
-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
-- Composite index for merchant + status queries
CREATE INDEX IF NOT EXISTS idx_orders_merchant_status ON orders(merchant_id, status);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  merchant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  whatsapp_message_id TEXT,
  is_visible BOOLEAN DEFAULT 1,
  verified BOOLEAN DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Index for review lookups by merchant
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON reviews(merchant_id);
-- Index for review lookups by product
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
-- Index for visible reviews
CREATE INDEX IF NOT EXISTS idx_reviews_is_visible ON reviews(is_visible);
-- Index for verified reviews
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON reviews(verified);
-- Index for rating distribution queries
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
-- Index for WhatsApp message tracking
CREATE INDEX IF NOT EXISTS idx_reviews_whatsapp_message_id ON reviews(whatsapp_message_id);
-- Composite index for merchant + visibility queries
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_visible ON reviews(merchant_id, is_visible);
-- Composite index for product + visibility queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_visible ON reviews(product_id, is_visible);

-- ============================================
-- ANALYTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  product_id TEXT,
  event_type TEXT NOT NULL CHECK(event_type IN ('product_viewed', 'product_clicked', 'order_created', 'review_submitted', 'share_clicked', 'phone_call')),
  source TEXT DEFAULT 'mobile' CHECK(source IN ('mobile', 'web', 'whatsapp', 'api')),
  user_phone TEXT,
  device_type TEXT DEFAULT 'mobile' CHECK(device_type IN ('mobile', 'tablet', 'desktop')),
  session_id TEXT,
  metadata TEXT, -- JSON object with additional data
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- Index for analytics queries by merchant
CREATE INDEX IF NOT EXISTS idx_analytics_merchant_id ON analytics(merchant_id);
-- Index for analytics queries by event type
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
-- Index for product analytics
CREATE INDEX IF NOT EXISTS idx_analytics_product_id ON analytics(product_id);
-- Index for source tracking
CREATE INDEX IF NOT EXISTS idx_analytics_source ON analytics(source);
-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
-- Composite index for merchant + event type queries
CREATE INDEX IF NOT EXISTS idx_analytics_merchant_event ON analytics(merchant_id, event_type);
-- Composite index for merchant + timestamp queries
CREATE INDEX IF NOT EXISTS idx_analytics_merchant_timestamp ON analytics(merchant_id, timestamp DESC);

-- ============================================
-- WEBHOOK LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id TEXT PRIMARY KEY,
  merchant_id TEXT,
  event_type TEXT NOT NULL,
  source TEXT DEFAULT 'whatsapp' CHECK(source IN ('whatsapp', 'external', 'internal')),
  payload TEXT NOT NULL, -- Full JSON payload
  processed BOOLEAN DEFAULT 0,
  error TEXT,
  error_code TEXT,
  retry_count INTEGER DEFAULT 0,
  last_retry_at DATETIME,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- Index for webhook lookups by merchant
CREATE INDEX IF NOT EXISTS idx_webhook_logs_merchant_id ON webhook_logs(merchant_id);
-- Index for event type filtering
CREATE INDEX IF NOT EXISTS idx_webhook_logs_event_type ON webhook_logs(event_type);
-- Index for processed status
CREATE INDEX IF NOT EXISTS idx_webhook_logs_processed ON webhook_logs(processed);
-- Index for errors
CREATE INDEX IF NOT EXISTS idx_webhook_logs_error ON webhook_logs(error_code);
-- Index for time-series queries
CREATE INDEX IF NOT EXISTS idx_webhook_logs_timestamp ON webhook_logs(timestamp);
-- Composite index for merchant + processed queries
CREATE INDEX IF NOT EXISTS idx_webhook_logs_merchant_processed ON webhook_logs(merchant_id, processed);
-- Composite index for unprocessed with errors
CREATE INDEX IF NOT EXISTS idx_webhook_logs_pending ON webhook_logs(processed, error) WHERE processed = 0 AND error IS NOT NULL;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Merchant Sales Summary View
CREATE VIEW IF NOT EXISTS merchant_stats AS
SELECT 
  m.id,
  m.name,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_revenue,
  AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE NULL END) as avg_rating,
  COUNT(DISTINCT r.id) as total_reviews,
  COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as delivered_orders
FROM merchants m
LEFT JOIN orders o ON m.id = o.merchant_id
LEFT JOIN reviews r ON m.id = r.merchant_id AND r.is_visible = 1
GROUP BY m.id, m.name;

-- Product Performance View
CREATE VIEW IF NOT EXISTS product_stats AS
SELECT 
  p.id,
  p.merchant_id,
  COUNT(DISTINCT o.id) as total_sales,
  AVG(CASE WHEN r.rating IS NOT NULL THEN r.rating ELSE NULL END) as avg_rating,
  COUNT(DISTINCT r.id) as review_count,
  COUNT(DISTINCT a.id) as view_count
FROM (
  SELECT DISTINCT product_id as id, merchant_id FROM reviews
  UNION
  SELECT DISTINCT product_id as id, merchant_id FROM analytics
) p
LEFT JOIN orders o ON JSON_CONTAINS(o.product_ids, JSON_QUOTE(p.id))
LEFT JOIN reviews r ON p.id = r.product_id AND r.is_visible = 1
LEFT JOIN analytics a ON p.id = a.product_id AND a.event_type = 'product_viewed'
GROUP BY p.id, p.merchant_id;

-- Daily Revenue View
CREATE VIEW IF NOT EXISTS daily_revenue AS
SELECT 
  merchant_id,
  DATE(created_at) as date,
  COUNT(DISTINCT id) as order_count,
  SUM(total_amount) as daily_revenue,
  COUNT(DISTINCT CASE WHEN status = 'delivered' THEN id END) as delivered_count
FROM orders
GROUP BY merchant_id, DATE(created_at);

-- ============================================
-- INITIAL DATA CONSTRAINTS AND TRIGGERS
-- ============================================

-- Trigger to update merchant updated_at timestamp
CREATE TRIGGER IF NOT EXISTS merchants_update_timestamp
AFTER UPDATE ON merchants
BEGIN
  UPDATE merchants SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- Trigger to update order updated_at timestamp
CREATE TRIGGER IF NOT EXISTS orders_update_timestamp
AFTER UPDATE ON orders
BEGIN
  UPDATE orders SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- Trigger to update review updated_at timestamp
CREATE TRIGGER IF NOT EXISTS reviews_update_timestamp
AFTER UPDATE ON reviews
BEGIN
  UPDATE reviews SET updated_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.id;
END;

-- ============================================
-- DATABASE VERSION AND METADATA
-- ============================================

CREATE TABLE IF NOT EXISTS _db_meta (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR REPLACE INTO _db_meta (key, value) VALUES 
  ('schema_version', '1.0.0'),
  ('created_at', CURRENT_TIMESTAMP),
  ('last_migration', CURRENT_TIMESTAMP);

-- ============================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- ============================================

-- Get top merchants by revenue (last 30 days)
-- SELECT m.id, m.name, SUM(o.total_amount) as revenue
-- FROM merchants m
-- LEFT JOIN orders o ON m.id = o.merchant_id 
--   AND DATE(o.created_at) >= DATE('now', '-30 days')
-- WHERE m.active = 1
-- GROUP BY m.id, m.name
-- ORDER BY revenue DESC
-- LIMIT 10;

-- Get pending webhook logs for retry
-- SELECT id, event_type, payload, retry_count
-- FROM webhook_logs
-- WHERE processed = 0 AND error IS NOT NULL AND retry_count < 5
-- ORDER BY timestamp ASC
-- LIMIT 100;

-- Get customer order history
-- SELECT id, total_amount, status, created_at, delivered_at
-- FROM orders
-- WHERE customer_phone = ?
-- ORDER BY created_at DESC;

-- Get merchant daily analytics
-- SELECT DATE(timestamp) as date, event_type, COUNT(*) as count
-- FROM analytics
-- WHERE merchant_id = ? AND DATE(timestamp) >= DATE('now', '-30 days')
-- GROUP BY DATE(timestamp), event_type
-- ORDER BY date DESC;

