'use client';
import Link from 'next/link'; import { useCart } from '@/lib/cart'; import { useBusinessSettings } from '@/lib/business-settings'; import { inr } from '@/lib/utils'; import { orderMessage, waLink } from '@/lib/whatsapp';
export default function Cart() {
  const { items, setQty, remove, clear, total, count } = useCart();
  const { phone, whatsapp } = useBusinessSettings();
  if (!items.length) return <div className="px-4 py-16 text-center sm:py-20"><h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">Your cart is empty</h1><Link href="/shop" className="btn btn-blue mt-6">Shop jerseys</Link></div>;
  return (<div className="mx-auto max-w-3xl px-4 py-8"><h1 className="font-display text-3xl font-bold uppercase sm:text-4xl md:text-5xl">Cart</h1>
    <ul className="mt-6 grid gap-3">{items.map((i) => <li key={i.key} className="rounded-2xl border p-4"><div className="flex min-w-0 flex-wrap items-start justify-between gap-2"><b className="min-w-0 break-words">{i.name}</b><b className="shrink-0">{inr(i.unit * i.qty)}</b></div>
      <p className="text-sm text-neutral-600">Size {i.size}{i.color && ` · ${i.color}`}{i.playerName && ` · ${i.playerName}`}{i.playerNumber && ` #${i.playerNumber}`}{i.teamName && ` · ${i.teamName}`}{i.logo && ' · Logo'}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2"><button className="btn min-h-11 !px-3 !py-2 btn-line" aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)}>−</button><span className="min-w-8 text-center">{i.qty}</span><button className="btn min-h-11 !px-3 !py-2 btn-line" aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)}>+</button><button className="ml-auto min-h-11 px-3 text-sm text-red-600" onClick={() => remove(i.key)}>Remove</button></div></li>)}</ul>
    <p className="mt-6 text-2xl">Total: <b>{inr(total)}</b></p>
    {count >= 20 && <p className="mt-2 rounded-xl bg-chalk p-3">Large team order? <Link className="text-volt underline" href="/bulk-order">Request a bulk quote</Link> for the best price.</p>}
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">{whatsapp && <a className="btn min-h-11 w-full btn-blue" target="_blank" rel="noreferrer" href={waLink(orderMessage(items), whatsapp)}>Order via WhatsApp</a>}{phone && <a className="btn min-h-11 w-full btn-line" href={`tel:${phone}`}>Call now</a>}<Link href="/shop" className="btn min-h-11 w-full btn-line">Continue shopping</Link><button className="btn min-h-11 w-full btn-line" onClick={clear}>Clear cart</button></div></div>);
}
