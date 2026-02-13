/**
 * API endpoint to manually trigger synchronization from Google Sheets
 * GET /api/sync
 */

import type { APIRoute } from 'astro';
import DB from '../../lib/db';
import SheetsDB from '../../lib/sheets';

export const GET: APIRoute = async (context) => {
  try {
    // Verify admin token for security
    const token = context.url.searchParams.get('token');
    const adminToken = context.locals.env?.SYNC_TOKEN;

    if (!adminToken || token !== adminToken) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          code: 'UNAUTHORIZED',
          timestamp: new Date().toISOString(),
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const startTime = Date.now();
    const results = {
      productsCount: 0,
      merchantsCount: 0,
      reviewsCount: 0,
      errors: [] as string[],
    };

    try {
      // Fetch products from Google Sheets
      const products = await SheetsDB.getProducts();
      results.productsCount = products.length;

      // Clear and update product cache in KV (if available)
      if (context.locals.env?.CACHE) {
        try {
          await context.locals.env.CACHE.put(
            'products_list',
            JSON.stringify(products),
            { expirationTtl: 300 } // 5 minutes
          );
        } catch (e) {
          results.errors.push(`Cache update failed: ${String(e)}`);
        }
      }
    } catch (error) {
      results.errors.push(`Product sync failed: ${String(error)}`);
    }

    const duration = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        success: results.errors.length === 0,
        results,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Sync endpoint error:', error);

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

// Only allow GET requests
export const prerender = false;
