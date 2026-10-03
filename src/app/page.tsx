import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import ProductCard from './ProductCard';
import { applyOffers } from '@/lib/offers';
import type { Product } from '@/lib/utils';
export const revalidate = 60;
const sports = [['Tennis Cricket', 'tennis-cricket'], ['Cricket', 'cricket'], ['Football', 'football'], ['Tournament', 'tournament'], ['League', 'league'], ['Custom', 'custom']];
export default async function Home() {
  const sb = supabaseServer();
  const [{ data: feat }, { data: fresh }] = await Promise.all([
    sb.from('products').select('*').eq('active', true).eq('featured', true).limit(8),
    sb.from('products').select('*').eq('active', true).eq('new_arrival', true).limit(8)]);
  const F = await applyOffers(sb, (feat ?? []) as Product[]), N = await applyOffers(sb, (fresh ?? []) as Product[]);
  return (<>
    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 md:py-32">
      <h1 className="max-w-4xl font-display text-6xl font-extrabold uppercase leading-[0.9] md:text-9xl">Jerseys made for your game.</h1>
      <p className="mt-6 max-w-xl text-lg text-neutral-300">Custom sports jerseys for players, teams, tournaments and leagues.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/shop" className="btn btn-blue">Shop jerseys</Link><Link href="/custom-jersey" className="btn border-2 border-white hover:bg-white hover:text-ink">Design your jersey</Link><Link href="/bulk-order" className="btn border-2 border-white hover:bg-white hover:text-ink">Bulk team order</Link></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-12"><h2 className="font-display text-4xl font-bold uppercase">Shop by sport</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">{sports.map(([n, s]) => <Link key={s} href={`/shop?category=${s}`} className="rounded-2xl bg-chalk p-6 font-display text-2xl font-bold uppercase hover:bg-volt hover:text-white">{n}</Link>)}</div></section>
    {!!F.length && <Grid title="Featured" items={F} />}
    {!!N.length && <Grid title="New arrivals" items={N} />}
    {!F.length && !N.length && <p className="px-4 pb-16 text-center text-neutral-600">Products added in the admin panel will appear here.</p>}
  </>);
}
const Grid = ({ title, items }: { title: string; items: Product[] }) => (<section className="mx-auto max-w-7xl px-4 pb-12"><h2 className="font-display text-4xl font-bold uppercase">{title}</h2><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div></section>);
