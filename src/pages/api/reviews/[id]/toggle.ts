export const prerender = false;

interface ToggleResult {
  success: boolean;
  is_visible?: number;
  error?: string;
}

export async function POST({ params, locals }: { params: { id: string }, locals: any }) {
  const user = locals?.user;
  const merchantId = user?.merchant_id || user?.merchantId || user?.id || null;

  if (!user || !merchantId) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const reviewId = params.id;
  if (!reviewId) {
    return new Response(JSON.stringify({ success: false, error: 'Missing review id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const runtime = locals.runtime || (globalThis as any).CLOUDFLARE_ENV;
  const db = runtime?.env?.DB;

  if (!db) {
    return new Response(JSON.stringify({ success: false, error: 'Database not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { results } = await db.prepare(
      `SELECT id, is_visible
       FROM reviews
       WHERE id = ? AND merchant_id = ?
       LIMIT 1`
    ).bind(reviewId, merchantId).all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Review not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const current = results[0].is_visible ? 1 : 0;
    const nextValue = current ? 0 : 1;

    await db.prepare(
      `UPDATE reviews
       SET is_visible = ?, updated_at = ?
       WHERE id = ? AND merchant_id = ?`
    ).bind(nextValue, new Date().toISOString(), reviewId, merchantId).run();

    const response: ToggleResult = { success: true, is_visible: nextValue };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Toggle review error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Failed to update review' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
