import { supabaseServer } from '@/lib/supabase/server'; import { applyOffers } from '@/lib/offers'; import ProductCard from '../ProductCard'; import { discountPct, type Product } from '@/lib/utils';
export const metadata = { title: 'Offers' }; export const revalidate = 60;
export default async function Offers() {
  const sb = supabaseServer(); const { data } = await sb.from('products').select('*').eq('active', true).limit(200);
  const items = (await applyOffers(sb, (data ?? []) as Product[])).filter((p) => discountPct(p) > 0);
  return (<div className="mx-auto max-w-7xl px-4 py-8"><h1 className="font-display text-5xl font-bold uppercase">Offers</h1>
    {!items.length && <p className="mt-6 text-neutral-600">No active offers right now. Check back soon or call us for team pricing.</p>}
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div></div>);
}
