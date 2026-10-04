import Image from 'next/image'; import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { basePrice, discountPct, inr, type Product } from '@/lib/utils';
import { applyOffers } from '@/lib/offers';
import Buy from './Buy';
export const revalidate = 30;
async function get(slug: string) { const { data } = await supabaseServer().from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle(); if (!data) return null; const sb = supabaseServer(); return (await applyOffers(sb, [data as Product]))[0]; }
export async function generateMetadata({ params }: { params: { slug: string } }) { const p = await get(params.slug); return p ? { title: p.name, description: p.short_description ?? undefined, openGraph: { images: p.images[0] ? [p.images[0]] : [] } } : { title: 'Not found' }; }
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await get(params.slug); if (!p) notFound();
  const d = discountPct(p);
  return (<div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2">
    <div className="grid gap-3">{(p.images.length ? p.images : [null]).map((src, i) => <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-chalk">{src && <Image src={src} alt={`${p.name} view ${i + 1}`} fill priority={i === 0} sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />}</div>)}</div>
    <div className="min-w-0"><h1 className="break-words font-display text-3xl font-bold uppercase sm:text-4xl lg:text-5xl">{p.name}</h1>
      <p className="mt-3 flex flex-wrap items-baseline gap-3"><b className="text-2xl sm:text-3xl">{inr(basePrice(p))}</b>{d > 0 && <><s className="text-neutral-500">{inr(p.price)}</s><span className="rounded-full bg-volt px-3 py-1 text-sm font-semibold text-white">{d}% OFF</span></>}</p>
      <p className="mt-4 whitespace-pre-line text-neutral-700">{p.description ?? p.short_description}</p>
      <Buy p={{ ...p, image: p.images[0] }} /></div></div>);
}
