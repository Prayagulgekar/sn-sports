'use client';
import { useState } from 'react'; import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart'; import { inr, unitPrice, PHONE, type Product } from '@/lib/utils'; import { orderMessage, waLink } from '@/lib/whatsapp';
export default function Buy({ p }: { p: Product & { image?: string } }) {
  const { add } = useCart(); const router = useRouter();
  const [f, setF] = useState({ size: p.sizes[0] ?? '', color: p.colors[0] ?? '', qty: 1, playerName: '', playerNumber: '', teamName: '', notes: '', logo: false });
  const set = (k: string, v: string | number | boolean) => setF((s) => ({ ...s, [k]: v }));
  const out = p.stock <= 0 && !p.preorder; const unit = unitPrice(p, f.qty);
  const item = () => ({ key: [p.id, f.size, f.color, f.playerName, f.playerNumber, f.teamName].join('|'), productId: p.id, name: p.name, image: p.image, size: f.size, color: f.color || undefined, qty: f.qty, unit, playerName: f.playerName.toUpperCase() || undefined, playerNumber: f.playerNumber || undefined, teamName: f.teamName || undefined, notes: f.notes || undefined, logo: f.logo });
  return (<div className="mt-6 grid gap-4">
    <div><b>Size</b><div className="mt-2 flex flex-wrap gap-2">{p.sizes.map((s) => <button type="button" key={s} onClick={() => set('size', s)} aria-pressed={f.size === s} className={`rounded-full border-2 px-4 py-2 ${f.size === s ? 'border-volt bg-volt text-white' : 'border-neutral-300'}`}>{s}</button>)}</div></div>
    {p.colors.length > 0 && <select className="input" value={f.color} onChange={(e) => set('color', e.target.value)}>{p.colors.map((c) => <option key={c}>{c}</option>)}</select>}
    <label>Quantity<input type="number" min={1} max={500} className="input mt-1" value={f.qty} onChange={(e) => set('qty', Math.max(1, Math.min(500, Number(e.target.value) || 1)))} /></label>
    {p.customizable && <div className="grid gap-3 rounded-2xl bg-chalk p-4"><b>Customize</b>
      {p.allow_name && <input className="input" maxLength={20} placeholder="Player name" value={f.playerName} onChange={(e) => set('playerName', e.target.value)} />}
      {p.allow_number && <input className="input" maxLength={3} inputMode="numeric" placeholder="Number" value={f.playerNumber} onChange={(e) => set('playerNumber', e.target.value.replace(/\D/g, ''))} />}
      <input className="input" maxLength={40} placeholder="Team name" value={f.teamName} onChange={(e) => set('teamName', e.target.value)} />
      {p.allow_logo && <label className="flex items-center gap-2"><input type="checkbox" checked={f.logo} onChange={(e) => set('logo', e.target.checked)} />Add team logo (send the file on WhatsApp)</label>}
      <textarea className="input" maxLength={500} placeholder="Sponsor or other notes" value={f.notes} onChange={(e) => set('notes', e.target.value)} /></div>}
    <p className="text-lg">Total: <b>{inr(unit * f.qty)}</b> <span className="text-sm text-neutral-600">({inr(unit)} each)</span></p>
    {out && <p className="font-semibold text-red-600">OUT OF STOCK. Request a quote for custom orders.</p>}
    {f.qty >= 20 ? <a className="btn btn-blue" href="/bulk-order">Request quote (20+)</a> : <>
      <button disabled={out} className="btn btn-dark disabled:opacity-40" onClick={() => { add(item()); router.push('/cart'); }}>Add to cart</button>
      <a aria-disabled={out} className={`btn btn-blue ${out ? 'pointer-events-none opacity-40' : ''}`} target="_blank" rel="noreferrer" href={waLink(orderMessage([item()]))}>Order on WhatsApp</a></>}
    <a className="btn btn-line" href={`tel:${PHONE}`}>Call to order</a></div>);
}
