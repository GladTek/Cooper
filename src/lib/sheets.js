/**
 * Google Sheets integration for MeaMart
 * Uses google-spreadsheet package with service account authentication
 * Handles merchant product data management
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Custom error class for Google Sheets operations
 */
export class SheetsError extends Error {
  constructor(message, code = 'SHEETS_ERROR', status = 500) {
    super(message);
    this.name = 'SheetsError';
    this.code = code;
    this.status = status;
  }
}

/**
 * Cache for sheet data with TTL
 */
const sheetsCache = new Map();

/**
 * Extract document ID from Google Sheets URL
 * Supports formats:
 * - https://docs.google.com/spreadsheets/d/{docId}/edit
 * - https://docs.google.com/spreadsheets/d/{docId}
 * 
 * @param {string} sheetUrl - Google Sheets URL
 * @returns {string} Document ID
 * @throws {SheetsError} If URL is invalid
 */
function extractDocumentId(sheetUrl) {
  if (!sheetUrl || typeof sheetUrl !== 'string') {
    throw new SheetsError('Invalid sheet URL: must be a non-empty string', 'INVALID_URL', 400);
  }

  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match || !match[1]) {
    throw new SheetsError(
      'Invalid Google Sheets URL. Expected format: https://docs.google.com/spreadsheets/d/{docId}/edit',
      'INVALID_URL_FORMAT',
      400
    );
  }

  return match[1];
}

/**
 * Get cached data if available and not expired
 * 
 * @param {string} docId - Document ID
 * @returns {object|null} Cached data or null if expired/not found
 */
function getCachedData(docId) {
  const cached = sheetsCache.get(docId);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    sheetsCache.delete(docId);
    return null;
  }

  return cached.data;
}

/**
 * Set cache data
 * 
 * @param {string} docId - Document ID
 * @param {array} data - Data to cache
 */
function setCachedData(docId, data) {
  sheetsCache.set(docId, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Validate product row data
 * 
 * @param {object} row - Row object from sheet
 * @param {number} rowIndex - Row index for error reporting
 * @returns {object} Validated product object
 * @throws {Error} If required fields are missing or invalid
 */
function validateProductRow(row, rowIndex) {
  const product = {
    id: (row.id || row.ID || '').toString().trim(),
    title: (row.title || row.Title || row.name || row.Name || '').toString().trim(),
    description: (row.description || row.Description || '').toString().trim(),
    price: parseFloat(row.price || row.Price || 0),
    image_link: (row.image_link || row.Image || row.image || '').toString().trim(),
    availability: (row.availability || row.Availability || row.stock || row.Stock || 'in_stock').toString().trim().toLowerCase(),
  };

  // Validate required fields
  if (!product.id) {
    throw new Error(`Row ${rowIndex}: Missing required field 'id'`);
  }
  if (!product.title) {
    throw new Error(`Row ${rowIndex}: Missing required field 'title'`);
  }

  // Validate price is a valid number
  if (isNaN(product.price) || product.price < 0) {
    throw new Error(`Row ${rowIndex}: Invalid price value (must be positive number)`);
  }

  // Normalize availability
  const validStatuses = ['in_stock', 'out_of_stock', 'available', 'unavailable'];
  if (!validStatuses.includes(product.availability)) {
    product.availability = 'in_stock';
  }

  return product;
}

/**
 * Authenticate with Google Sheets using service account
 * 
 * @returns {JWT} JWT auth object
 * @throws {SheetsError} If credentials are missing or invalid
 */
function getAuthClient() {
  const serviceEmail = process.env.GOOGLE_SERVICE_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!serviceEmail || !privateKey) {
    throw new SheetsError(
      'Google service account credentials not configured. Set GOOGLE_SERVICE_EMAIL and GOOGLE_PRIVATE_KEY environment variables.',
      'MISSING_CREDENTIALS',
      500
    );
  }

  try {
    return new JWT({
      email: serviceEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } catch (error) {
    throw new SheetsError(
      `Failed to initialize Google authentication: ${error.message}`,
      'AUTH_ERROR',
      500
    );
  }
}

/**
 * Fetch products from a merchant's Google Sheet
 * 
 * Reads all rows from the first sheet and returns normalized product data.
 * Caches results for 5 minutes to avoid quota limits.
 * 
 * @param {string} sheetUrl - Google Sheets URL (public or shared with service account)
 * @returns {Promise<array>} Array of product objects with: id, title, description, price, image_link, availability
 * @throws {SheetsError} On authentication, network, or validation errors
 * 
 * @example
 * const products = await fetchMerchantProducts(
 *   'https://docs.google.com/spreadsheets/d/1abc123.../edit'
 * );
 * console.log(products[0]);
 * // {
 * //   id: 'PROD001',
 * //   title: 'Product Name',
 * //   description: 'Product description',
 * //   price: 99.99,
 * //   image_link: 'https://example.com/image.jpg',
 * //   availability: 'in_stock'
 * // }
 */
export async function fetchMerchantProducts(sheetUrl) {
  try {
    // Validate and extract document ID
    const docId = extractDocumentId(sheetUrl);

    // Check cache first
    const cachedProducts = getCachedData(docId);
    if (cachedProducts) {
      console.log(`[Sheets] Cache hit for document ${docId} (${cachedProducts.length} products)`);
      return cachedProducts;
    }

    // Get authentication client
    const auth = getAuthClient();

    // Initialize spreadsheet
    const doc = new GoogleSpreadsheet(docId, auth);
    
    try {
      await doc.loadInfo();
    } catch (error) {
      if (error.message && error.message.includes('404')) {
        throw new SheetsError(
          `Google Sheet not found. Verify the URL is correct and the service account has access.`,
          'SHEET_NOT_FOUND',
          404
        );
      }
      if (error.message && error.message.includes('403')) {
        throw new SheetsError(
          `Access denied. Ensure the sheet is shared with: ${process.env.GOOGLE_SERVICE_EMAIL}`,
          'ACCESS_DENIED',
          403
        );
      }
      throw new SheetsError(
        `Failed to load spreadsheet: ${error.message}`,
        'LOAD_ERROR',
        500
      );
    }

    // Get first sheet
    const sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      throw new SheetsError(
        'No sheets found in the spreadsheet',
        'NO_SHEETS',
        400
      );
    }

    console.log(`[Sheets] Reading sheet: "${sheet.title}" (${sheet.rowCount} rows)`);

    // Load all rows
    let rows = [];
    try {
      rows = await sheet.getRows();
    } catch (error) {
      throw new SheetsError(
        `Failed to read sheet rows: ${error.message}`,
        'READ_ERROR',
        500
      );
    }

    if (rows.length === 0) {
      console.log(`[Sheets] No data rows found in sheet`);
      return [];
    }

    // Parse and validate products
    const products = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        
        // Skip empty rows
        if (!row.id && !row.title && !row.name) {
          continue;
        }

        const product = validateProductRow(row, i + 2); // +2: header + 1-based indexing
        products.push(product);
      } catch (error) {
        errors.push(error.message);
        // Continue processing other rows
      }
    }

    // Log any validation errors but don't fail
    if (errors.length > 0) {
      console.warn(`[Sheets] Validation errors encountered:`, errors);
    }

    if (products.length === 0) {
      throw new SheetsError(
        `No valid products found in sheet. Ensure columns include: id, title, price, availability`,
        'NO_VALID_PRODUCTS',
        400
      );
    }

    // Cache results
    setCachedData(docId, products);
    console.log(`[Sheets] Loaded ${products.length} products from sheet (cached for 5 min)`);

    return products;
  } catch (error) {
    if (error instanceof SheetsError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new SheetsError(
      `Unexpected error fetching products: ${error.message}`,
      'UNKNOWN_ERROR',
      500
    );
  }
}

/**
 * Fetch a single product by ID
 * 
 * @param {string} sheetUrl - Google Sheets URL
 * @param {string} productId - Product ID to find
 * @returns {Promise<object>} Product object
 * @throws {SheetsError} If product not found or other errors
 */
export async function fetchProductById(sheetUrl, productId) {
  try {
    if (!productId) {
      throw new SheetsError('Product ID is required', 'MISSING_ID', 400);
    }

    const products = await fetchMerchantProducts(sheetUrl);
    const product = products.find(p => p.id.toString() === productId.toString());

    if (!product) {
      throw new SheetsError(
        `Product with ID "${productId}" not found`,
        'PRODUCT_NOT_FOUND',
        404
      );
    }

    return product;
  } catch (error) {
    if (error instanceof SheetsError) {
      throw error;
    }
    throw new SheetsError(
      `Error fetching product: ${error.message}`,
      'FETCH_ERROR',
      500
    );
  }
}

/**
 * Search products by title or description
 * 
 * @param {string} sheetUrl - Google Sheets URL
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @returns {Promise<array>} Matching products
 * @throws {SheetsError} On validation or other errors
 */
export async function searchProducts(sheetUrl, query, limit = 10) {
  try {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new SheetsError('Search query is required', 'MISSING_QUERY', 400);
    }

    const products = await fetchMerchantProducts(sheetUrl);
    const normalizedQuery = query.toLowerCase();

    const results = products
      .filter(p =>
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, limit);

    return results;
  } catch (error) {
    if (error instanceof SheetsError) {
      throw error;
    }
    throw new SheetsError(
      `Error searching products: ${error.message}`,
      'SEARCH_ERROR',
      500
    );
  }
}

/**
 * Get cache statistics for monitoring
 * 
 * @returns {object} Cache stats
 */
export function getCacheStats() {
  const stats = {
    cacheSize: sheetsCache.size,
    entries: [],
  };

  for (const [docId, cached] of sheetsCache.entries()) {
    const age = Date.now() - cached.timestamp;
    const remaining = CACHE_TTL - age;
    stats.entries.push({
      docId,
      products: cached.data.length,
      ageMs: age,
      remainingMs: remaining,
      expired: remaining <= 0,
    });
  }

  return stats;
}

/**
 * Clear all cached data
 */
export function clearCache() {
  const size = sheetsCache.size;
  sheetsCache.clear();
  console.log(`[Sheets] Cleared cache (${size} entries)`);
}

/**
 * Default export with all functions
 */
export default {
  fetchMerchantProducts,
  fetchProductById,
  searchProducts,
  getCacheStats,
  clearCache,
  SheetsError,
};
