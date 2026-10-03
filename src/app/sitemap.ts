import { supabaseServer } from '@/lib/supabase/server';
export default async function sitemap() { const u = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { data } = await supabaseServer().from('products').select('slug,updated_at').eq('active', true);
  return [...['', '/shop', '/custom-jersey', '/tournament', '/league', '/bulk-order', '/contact'].map((p) => ({ url: u + p })), ...(data ?? []).map((p) => ({ url: `${u}/product/${p.slug}`, lastModified: p.updated_at }))]; }
