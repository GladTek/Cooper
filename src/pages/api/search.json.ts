import { getCollection } from 'astro:content';

export const prerender = false;

export async function GET() {
  const docs = await getCollection('docs').catch(() => []);
  const blog = await getCollection('blog').catch(() => []);
  const portfolio = await getCollection('portfolio').catch(() => []);

  const results = [];

  for (const doc of docs) {
    if (doc.data?.noindex) continue;
    const slug = doc.id.replace(/\.[^/.]+$/, "");
    results.push({
      title: doc.data?.title || slug,
      description: doc.data?.description || '',
      url: `/docs/${slug}`,
      body: doc.body || ''
    });
  }

  for (const post of blog) {
    if (post.data?.noindex) continue;
    const [lang, ...slugParts] = post.id.replace(/\.[^/.]+$/, "").split('/');
    const slug = slugParts.join('/');
    results.push({
      title: post.data?.title || slug,
      description: post.data?.description || '',
      url: `/${lang}/blog/${slug}`,
      body: post.body || ''
    });
  }

  for (const item of portfolio) {
    if (item.data?.noindex) continue;
    const [lang, ...slugParts] = item.id.replace(/\.[^/.]+$/, "").split('/');
    const slug = slugParts.join('/');
    results.push({
      title: item.data?.title || slug,
      description: item.data?.description || '',
      url: `/${lang}/portfolio/${slug}`,
      body: item.body || ''
    });
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
