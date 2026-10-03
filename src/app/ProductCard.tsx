import Image from 'next/image'; import Link from 'next/link';
import { basePrice, discountPct, inr, type Product } from '@/lib/utils';
export default function ProductCard({ p }: { p: Product }) {
  const d = discountPct(p);
  return (
    <Link href={`/product/${p.slug}`} className="group block overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-xl">
      <div className="relative aspect-[4/5] bg-chalk">
        {p.images[0] ? <Image src={p.images[0]} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" /> : <div className="grid h-full place-items-center font-display text-4xl text-neutral-300">SN</div>}
        {d > 0 && <span className="absolute left-2 top-2 rounded-full bg-volt px-3 py-1 text-sm font-semibold text-white">{d}% OFF</span>}
        {p.stock <= 0 && !p.preorder && <span className="absolute right-2 top-2 rounded-full bg-ink px-3 py-1 text-sm text-white">Out of stock</span>}
      </div>
      <div className="p-3"><h3 className="font-display text-xl font-bold uppercase leading-tight">{p.name}</h3>
        <p className="mt-1 flex items-baseline gap-2"><b className="text-lg">{inr(basePrice(p))}</b>{d > 0 && <s className="text-neutral-500">{inr(p.price)}</s>}</p>
        <p className="mt-1 text-xs text-neutral-600">{p.sizes.join(' · ')}{p.customizable ? ' · Customizable' : ''}</p></div>
    </Link>);
}
