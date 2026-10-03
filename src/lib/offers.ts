import type { supabaseServer } from './supabase/server';
import { basePrice, type Product } from './utils';
export async function applyOffers<T extends Product>(sb: ReturnType<typeof supabaseServer>, items: T[]): Promise<T[]> {
  if (!items.length) return items;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await sb.from('offers').select('product_id,discount_type,discount_value,start_date,end_date').eq('active', true);
  const live = (data ?? []).filter((o) => (!o.start_date || o.start_date <= today) && (!o.end_date || o.end_date >= today));
  return items.map((p) => {
    const prices = live.filter((o) => o.product_id === p.id).map((o) => Math.max(0, Math.round(o.discount_type === 'percent' ? p.price * (1 - Number(o.discount_value) / 100) : p.price - Number(o.discount_value))));
    const best = Math.min(basePrice(p), ...prices);
    return best < basePrice(p) ? { ...p, sale_price: best } : p;
  });
}
