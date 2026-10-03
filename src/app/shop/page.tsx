import { supabaseServer } from '@/lib/supabase/server';
import ProductCard from '../ProductCard';
import { applyOffers } from '@/lib/offers';
import type { Product } from '@/lib/utils';
export const metadata = { title: 'Shop jerseys' };
export default async function Shop({ searchParams }: { searchParams: { q?: string; category?: string; sport?: string; max?: string; custom?: string; offers?: string } }) {
  const sb = supabaseServer();
  const { data: cats } = await sb.from('categories').select('name,slug').eq('active', true).order('name');
  let q = sb.from('products').select(searchParams.category ? '*, categories!inner(slug)' : '*').eq('active', true).order('created_at', { ascending: false });
  if (searchParams.category) q = q.eq('categories.slug', searchParams.category);
  if (searchParams.sport) q = q.ilike('sport', searchParams.sport);
  if (searchParams.max && Number(searchParams.max) > 0) q = q.lte('price', Number(searchParams.max));
  if (searchParams.custom) q = q.eq('customizable', true);
  if (searchParams.offers) q = q.not('sale_price', 'is', null);
  if (searchParams.q) { const t = searchParams.q.replace(/[^\w\s-]/g, ''); q = q.or(`name.ilike.%${t}%,sport.ilike.%${t}%,short_description.ilike.%${t}%,tags.cs.{${t.toLowerCase()}}`); }
  const { data, error } = await q.limit(60);
  const items = await applyOffers(sb, (data ?? []) as unknown as Product[]);
  return (<div className="mx-auto max-w-7xl px-4 py-8"><h1 className="font-display text-5xl font-bold uppercase">Shop</h1>
    <form className="mt-4 flex flex-wrap items-center gap-2"><input name="q" defaultValue={searchParams.q} placeholder="Search jerseys, sports, tags" className="input md:max-w-sm" />
      <select name="category" defaultValue={searchParams.category ?? ''} className="input md:max-w-[200px]"><option value="">All categories</option>{cats?.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
      <input name="max" type="number" min="0" defaultValue={searchParams.max} placeholder="Max price ₹" className="input md:max-w-[160px]" />
      <label className="flex items-center gap-2"><input type="checkbox" name="custom" value="1" defaultChecked={!!searchParams.custom} />Customizable</label>
      <label className="flex items-center gap-2"><input type="checkbox" name="offers" value="1" defaultChecked={!!searchParams.offers} />Offers</label>
      <button className="btn btn-dark">Filter</button></form>
    {error && <p className="mt-6 text-red-600">Could not load products. Please try again.</p>}
    {!error && !items.length && <p className="mt-10 text-neutral-600">No jerseys match. Try clearing filters, or <a className="text-volt underline" href="/custom-jersey">request a custom design</a>.</p>}
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div></div>);
}
