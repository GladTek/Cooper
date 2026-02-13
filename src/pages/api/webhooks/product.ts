/**
 * Webhook endpoint for product updates from external systems
 * POST /api/webhooks/product
 */

import type { APIRoute } from 'astro';
import { handleProductUpdated } from '../../../workers/webhooks';

export const POST: APIRoute = async (context) => {
  try {
    // Verify webhook secret from header
    const signature = context.request.headers.get('x-webhook-signature');
    const secret = context.locals.env?.WEBHOOK_SECRET;

    if (!secret || !signature) {
      return new Response(
        JSON.stringify({
          error: 'Missing webhook signature',
          code: 'MISSING_SIGNATURE',
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    let data;
    try {
      data = await context.request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON payload',
          code: 'INVALID_JSON',
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Call handler with D1 database context
    const response = await handleProductUpdated(data, {
      env: context.locals.env,
      db: context.locals.db,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Product webhook error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Only allow POST requests
export const prerender = false;
