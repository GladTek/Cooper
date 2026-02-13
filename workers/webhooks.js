/**
 * MeaChat Webhook Handler
 * Processes incoming webhooks from MeaChat (WhatsApp Business API)
 * Handles review submissions and order updates
 */

/**
 * Custom error class for webhook operations
 */
class WebhookError extends Error {
  constructor(message, code = 'WEBHOOK_ERROR') {
    super(message);
    this.name = 'WebhookError';
    this.code = code;
  }
}

/**
 * Extract rating from Arabic text
 * 
 * Supports:
 * - Star count: ⭐⭐⭐⭐⭐ = 5 stars
 * - Arabic keywords:
 *   - ممتاز (excellent) = 5
 *   - جيد جداً (very good) = 4
 *   - جيد (good) = 3
 *   - مقبول (acceptable) = 2
 *   - سيء (bad) = 1
 * 
 * @param {string} text - Message text to extract rating from
 * @returns {number|null} Rating 1-5 or null if not found
 */
function extractRating(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Count star emojis
  const starCount = (text.match(/⭐/g) || []).length;
  if (starCount >= 1 && starCount <= 5) {
    return starCount;
  }

  // Match Arabic keywords
  const lowerText = text.toLowerCase().trim();
  
  if (lowerText.includes('ممتاز') || lowerText.includes('ممتازة')) {
    return 5;
  }
  if (lowerText.includes('جيد جداً') || lowerText.includes('جيدة جدا')) {
    return 4;
  }
  if (lowerText.includes('جيد') || lowerText.includes('جيدة')) {
    return 3;
  }
  if (lowerText.includes('مقبول') || lowerText.includes('مقبولة')) {
    return 2;
  }
  if (lowerText.includes('سيء') || lowerText.includes('سيئة')) {
    return 1;
  }

  return null;
}

/**
 * Create standard response for webhook processing
 * 
 * @param {object} data - Response data
 * @returns {object} Standard response object
 */
function createResponse(data = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    ...data,
  };
}

/**
 * Find merchant by phone number
 * 
 * @param {object} db - D1 database
 * @param {string} phone - Phone number
 * @returns {Promise<object|null>} Merchant object or null
 */
async function findMerchantByPhone(db, phone) {
  try {
    const { results } = await db.prepare(
      'SELECT * FROM merchants WHERE phone = ? LIMIT 1'
    ).bind(phone).all();

    return results && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error finding merchant:', error);
    return null;
  }
}

/**
 * Find order by customer phone
 * 
 * @param {object} db - D1 database
 * @param {string} merchantId - Merchant ID
 * @param {string} customerPhone - Customer phone
 * @returns {Promise<object|null>} Order object or null
 */
async function findOrderByPhone(db, merchantId, customerPhone) {
  try {
    const { results } = await db.prepare(
      `SELECT * FROM orders 
       WHERE merchant_id = ? AND customer_phone = ? 
       ORDER BY created_at DESC LIMIT 1`
    ).bind(merchantId, customerPhone).all();

    return results && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error finding order:', error);
    return null;
  }
}

/**
 * Log webhook event to database
 * 
 * @param {object} db - D1 database
 * @param {object} logData - Log data
 * @returns {Promise<void>}
 */
async function logWebhookEvent(db, logData) {
  try {
    await db.prepare(
      `INSERT INTO webhook_logs 
       (id, merchant_id, event_type, source, payload, processed, error, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      logData.id,
      logData.merchantId || null,
      logData.eventType,
      'meachat',
      JSON.stringify(logData.payload),
      logData.processed ? 1 : 0,
      logData.error || null,
      new Date().toISOString()
    ).run();
  } catch (error) {
    console.error('Error logging webhook:', error);
  }
}

/**
 * Handle message_received events from MeaChat
 * 
 * Processes review submissions that come through the review_request_flow
 * 
 * @param {object} event - Webhook event data
 * @param {object} db - D1 database
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<object>} Processing result
 */
async function handleMessageReceived(event, db, merchantId) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventType: 'message_received',
    merchantId,
    payload: event,
    processed: false,
  };

  try {
    // Check if this is a review flow message
    if (event.context?.flow_id !== 'review_request_flow') {
      logEntry.processed = false;
      await logWebhookEvent(db, logEntry);
      return { processed: false, reason: 'not_review_flow' };
    }

    const customerPhone = event.from;
    const messageText = event.text?.body || '';

    // Extract rating from message
    const rating = extractRating(messageText);
    if (!rating) {
      logEntry.processed = false;
      await logWebhookEvent(db, logEntry);
      return { processed: false, reason: 'no_rating_found' };
    }

    // Find the customer's most recent order
    const order = await findOrderByPhone(db, merchantId, customerPhone);
    if (!order) {
      logEntry.error = 'Order not found for customer';
      logEntry.processed = false;
      await logWebhookEvent(db, logEntry);
      return { processed: false, reason: 'no_order_found' };
    }

    // Extract product IDs from order
    let productIds = [];
    try {
      productIds = JSON.parse(order.product_ids || '[]');
    } catch (e) {
      productIds = [order.product_ids]; // Fallback if not JSON
    }

    // Create review entry for first product (or all if needed)
    const primaryProductId = productIds[0];
    if (!primaryProductId) {
      logEntry.error = 'No products in order';
      logEntry.processed = false;
      await logWebhookEvent(db, logEntry);
      return { processed: false, reason: 'no_products' };
    }

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await db.prepare(
      `INSERT INTO reviews 
       (id, order_id, merchant_id, product_id, customer_phone, customer_name, 
        rating, comment, whatsapp_message_id, is_visible, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      reviewId,
      order.id,
      merchantId,
      primaryProductId,
      customerPhone,
      order.customer_name || 'Anonymous',
      rating,
      messageText,
      event.id || null,
      1, // is_visible
      new Date().toISOString()
    ).run();

    logEntry.processed = true;
    await logWebhookEvent(db, logEntry);

    return {
      processed: true,
      reviewId,
      rating,
      productId: primaryProductId,
    };
  } catch (error) {
    console.error('Error processing message_received:', error);
    logEntry.error = error.message;
    logEntry.processed = false;
    await logWebhookEvent(db, logEntry);

    throw new WebhookError(`Failed to process review: ${error.message}`);
  }
}

/**
 * Handle message_sent events from MeaChat
 * Useful for logging or triggering follow-ups
 * 
 * @param {object} event - Webhook event data
 * @param {object} db - D1 database
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<object>} Processing result
 */
async function handleMessageSent(event, db, merchantId) {
  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    eventType: 'message_sent',
    merchantId,
    payload: event,
    processed: true,
  };

  try {
    await logWebhookEvent(db, logEntry);
    return { processed: true, eventType: 'message_sent' };
  } catch (error) {
    console.error('Error logging message_sent:', error);
    return { processed: false, error: error.message };
  }
}

/**
 * Verify webhook signature using HMAC-SHA256
 * 
 * @param {string} payload - Request body as string
 * @param {string} signature - X-MeaChat-Signature header value
 * @param {string} secret - Webhook secret
 * @returns {boolean} True if signature is valid
 */
async function verifyWebhookSignature(payload, signature, secret) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const data = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const digest = Array.from(new Uint8Array(data))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return digest === signature;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

/**
 * Main webhook handler for Cloudflare Worker
 * 
 * @param {Request} request - Incoming request
 * @param {object} env - Environment variables (DB, MEACHAT_WEBHOOK_SECRET)
 * @returns {Response} JSON response
 */
async function handleWebhook(request, env) {
  try {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get raw body for signature verification
    const bodyText = await request.text();
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify webhook secret
    const signature = request.headers.get('X-MeaChat-Signature');
    const secret = env.MEACHAT_WEBHOOK_SECRET;

    if (!secret || !signature) {
      console.warn('Missing webhook credentials');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature (skip in development)
    if (env.ENVIRONMENT !== 'development') {
      const isValid = await verifyWebhookSignature(bodyText, signature, secret);
      if (!isValid) {
        console.warn('Invalid webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Parse merchant ID from webhook (stored in context or as part of registration)
    const merchantId = body.merchant_id || body.context?.merchant_id;
    if (!merchantId) {
      return new Response(
        JSON.stringify({ error: 'Missing merchant_id' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get D1 database binding
    const db = env.DB;
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database not available' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process event based on type
    const eventType = body.event_type || body.type;
    let result;

    switch (eventType) {
      case 'message_received':
        result = await handleMessageReceived(body, db, merchantId);
        break;

      case 'message_sent':
        result = await handleMessageSent(body, db, merchantId);
        break;

      default:
        // Log unhandled event types
        const logEntry = {
          id: `log_${Date.now()}`,
          eventType: eventType || 'unknown',
          merchantId,
          payload: body,
          processed: false,
        };
        await logWebhookEvent(db, logEntry);
        result = { processed: false, reason: 'unknown_event_type' };
    }

    return new Response(
      JSON.stringify(createResponse({ result })),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook handler error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: error.code || 'UNKNOWN_ERROR',
        message: env.DEBUG ? error.message : undefined,
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Export for Cloudflare Worker
 */
export default {
  async fetch(request, env) {
    return handleWebhook(request, env);
  }
};
