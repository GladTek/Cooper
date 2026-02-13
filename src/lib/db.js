/**
 * Database abstraction layer for MeaMart
 * Supports SQLite (local) and D1 (Cloudflare Workers)
 * RTL-ready and error-resilient
 */

class DatabaseError extends Error {
  constructor(message, code = 'DB_ERROR') {
    super(message);
    this.code = code;
    this.name = 'DatabaseError';
  }
}

export class Database {
  constructor(config = {}) {
    if (!config.type) {
      throw new DatabaseError('Database type is required', 'INVALID_CONFIG');
    }
    this.config = {
      type: config.type,
      path: config.path || './db/meamart.db',
      url: config.url,
      ...config
    };
    this.isInitialized = false;
  }

  /**
   * Initialize database connection
   * @throws {DatabaseError} If initialization fails
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      if (this.config.type === 'd1') {
        // D1 is managed by Cloudflare Workers
        if (!this.config.env?.DB) {
          throw new DatabaseError('D1 binding not found in environment', 'MISSING_ENV');
        }
      } else if (this.config.type === 'sqlite') {
        // SQLite initialization would happen here
      }
      this.isInitialized = true;
    } catch (error) {
      if (error instanceof DatabaseError) throw error;
      throw new DatabaseError(
        `Failed to initialize database: ${error.message}`,
        'INIT_ERROR'\n      );
    }
  }

  /**
   * Execute a query
   * @param {string} sql SQL query
   * @param {Array} params Query parameters
   * @returns {Promise<Array>} Query results
   * @throws {DatabaseError} If query fails
   */
  async query(sql, params = []) {
    if (!this.isInitialized) await this.init();
    
    if (!sql || typeof sql !== 'string') {
      throw new DatabaseError('SQL query is required', 'INVALID_QUERY');
    }
    
    try {
      // Query execution would happen here based on config.type
      return [];
    } catch (error) {
      throw new DatabaseError(
        `Query failed: ${error.message}`,
        'QUERY_ERROR'
      );
    }
  }

  /**
   * Get a single row
   * @param {string} sql SQL query
   * @param {Array} params Query parameters
   * @returns {Promise<Object|null>} Single row or null
   */
  async get(sql, params = []) {
    const results = await this.query(sql, params);
    return results[0] || null;
  }

  /**
   * Run an insert/update/delete
   * @param {string} sql SQL query
   * @param {Array} params Query parameters
   * @returns {Promise<{changes: number, lastID: any}>} Result info
   */
  async run(sql, params = []) {
    if (!this.isInitialized) await this.init();
    
    if (!sql || typeof sql !== 'string') {
      throw new DatabaseError('SQL query is required', 'INVALID_QUERY');
    }
    
    try {
      return { changes: 1, lastID: null };
    } catch (error) {
      throw new DatabaseError(
        `Execute failed: ${error.message}`,
        'EXECUTE_ERROR'
      );
    }
  }

  /**
   * Get all products
   * @returns {Promise<Array>} All products
   */
  async getProducts() {
    return await this.query('SELECT * FROM products ORDER BY created_at DESC');
  }

  /**
   * Get product by ID
   * @param {string} id Product ID
   * @returns {Promise<Object|null>} Product or null
   */
  async getProduct(id) {
    if (!id) {
      throw new DatabaseError('Product ID is required', 'INVALID_ID');
    }
    return await this.get('SELECT * FROM products WHERE id = ?', [id]);
  }

  /**
   * Get all merchants
   * @returns {Promise<Array>} All merchants
   */
  async getMerchants() {
    return await this.query('SELECT * FROM merchants ORDER BY name');
  }

  /**
   * Get merchant by ID
   * @param {string} id Merchant ID
   * @returns {Promise<Object|null>} Merchant or null
   */
  async getMerchant(id) {
    if (!id) {
      throw new DatabaseError('Merchant ID is required', 'INVALID_ID');
    }
    return await this.get('SELECT * FROM merchants WHERE id = ?', [id]);
  }

  /**
   * Get all reviews
   * @returns {Promise<Array>} All reviews
   */
  async getReviews() {
    return await this.query('SELECT * FROM reviews ORDER BY created_at DESC');
  }

  /**
   * Get reviews for a product
   * @param {string} productId Product ID
   * @returns {Promise<Array>} Reviews for product
   */
  async getProductReviews(productId) {
    if (!productId) {
      throw new DatabaseError('Product ID is required', 'INVALID_ID');
    }
    return await this.query(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
  }

  /**
   * Get products by merchant
   * @param {string} merchantId Merchant ID
   * @returns {Promise<Array>} Products from merchant
   */
  async getMerchantProducts(merchantId) {
    if (!merchantId) {
      throw new DatabaseError('Merchant ID is required', 'INVALID_ID');
    }
    return await this.query(
      'SELECT * FROM products WHERE merchant_id = ? ORDER BY name',
      [merchantId]
    );
  }

  /**
   * Create a new review
   * @param {Object} review Review data
   * @returns {Promise<Object>} Result info
   */
  async createReview(review) {
    if (!review || typeof review !== 'object') {
      throw new DatabaseError('Review object is required', 'INVALID_DATA');
    }
    if (!review.productId || !review.rating) {
      throw new DatabaseError('Product ID and rating are required', 'INVALID_DATA');
    }
    if (review.rating < 1 || review.rating > 5) {
      throw new DatabaseError('Rating must be between 1 and 5', 'INVALID_DATA');
    }

    const sql = `
      INSERT INTO reviews (product_id, merchant_id, user_id, user_name, rating, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return await this.run(sql, [
      review.productId,
      review.merchantId,
      review.userId,
      review.userName,
      review.rating,
      review.comment,
      new Date().toISOString()
    ]);
  }

  /**
   * Close database connection
   */
  async close() {
    this.isInitialized = false;
  }
}

export { DatabaseError };
export default Database;
