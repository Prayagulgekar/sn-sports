'use client';
import Link from 'next/link'; import { useCart } from '@/lib/cart'; import { inr, PHONE } from '@/lib/utils'; import { orderMessage, waLink } from '@/lib/whatsapp';
export default function Cart() {
  const { items, setQty, remove, clear, total, count } = useCart();
  if (!items.length) return <div className="px-4 py-20 text-center"><h1 className="font-display text-5xl font-bold uppercase">Your cart is empty</h1><Link href="/shop" className="btn btn-blue mt-6">Shop jerseys</Link></div>;
  return (<div className="mx-auto max-w-3xl px-4 py-8"><h1 className="font-display text-5xl font-bold uppercase">Cart</h1>
    <ul className="mt-6 grid gap-3">{items.map((i) => <li key={i.key} className="rounded-2xl border p-4"><div className="flex justify-between"><b>{i.name}</b><b>{inr(i.unit * i.qty)}</b></div>
      <p className="text-sm text-neutral-600">Size {i.size}{i.color && ` · ${i.color}`}{i.playerName && ` · ${i.playerName}`}{i.playerNumber && ` #${i.playerNumber}`}{i.teamName && ` · ${i.teamName}`}{i.logo && ' · Logo'}</p>
      <div className="mt-2 flex items-center gap-2"><button className="btn btn-line !px-3 !py-1" aria-label="Decrease" onClick={() => setQty(i.key, i.qty - 1)}>−</button><span>{i.qty}</span><button className="btn btn-line !px-3 !py-1" aria-label="Increase" onClick={() => setQty(i.key, i.qty + 1)}>+</button><button className="ml-auto text-sm text-red-600" onClick={() => remove(i.key)}>Remove</button></div></li>)}</ul>
    <p className="mt-6 text-2xl">Total: <b>{inr(total)}</b></p>
    {count >= 20 && <p className="mt-2 rounded-xl bg-chalk p-3">Large team order? <Link className="text-volt underline" href="/bulk-order">Request a bulk quote</Link> for the best price.</p>}
    <div className="mt-4 grid gap-3 md:grid-cols-2"><a className="btn btn-blue" target="_blank" rel="noreferrer" href={waLink(orderMessage(items))}>Order via WhatsApp</a><a className="btn btn-line" href={`tel:${PHONE}`}>Call now</a><Link href="/shop" className="btn btn-line">Continue shopping</Link><button className="btn btn-line" onClick={clear}>Clear cart</button></div></div>);
}
