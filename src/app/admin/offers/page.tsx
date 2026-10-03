import { supabaseServer } from '@/lib/supabase/server'; import { addOffer, toggleOffer, deleteOffer } from '../actions2';
export default async function Offers() {
  const sb = supabaseServer(); const [{ data: prods }, { data: offers }] = await Promise.all([sb.from('products').select('id,name').order('name'), sb.from('offers').select('*, products(name)').order('start_date', { ascending: false })]);
  return (<><h1 className="font-display text-4xl font-bold uppercase">Offers</h1>
    <form action={addOffer} className="mt-4 grid max-w-xl gap-2 rounded-2xl bg-white p-4"><input name="name" placeholder="Offer name (e.g. Diwali sale)" className="input" />
      <select name="product_id" required className="input"><option value="">Product</option>{prods?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
      <div className="grid grid-cols-2 gap-2"><select name="discount_type" className="input"><option value="percent">Percent off</option><option value="flat">Flat ₹ off</option></select><input name="discount_value" type="number" min="1" step="1" required placeholder="Amount" className="input" /></div>
      <div className="grid grid-cols-2 gap-2"><label className="text-xs">Start<input name="start_date" type="date" className="input" /></label><label className="text-xs">End<input name="end_date" type="date" className="input" /></label></div><button className="btn btn-blue">Create offer</button></form>
    <ul className="mt-4 grid gap-2">{offers?.map((o) => (<li key={o.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3"><span className="mr-auto"><b>{o.name || 'Offer'}</b> · {(o.products as { name: string } | null)?.name} · {o.discount_type === 'percent' ? `${o.discount_value}%` : `₹${o.discount_value}`} off · {o.start_date ?? 'now'} to {o.end_date ?? 'no end'} · {o.active ? 'Active' : 'Off'}</span>
      {[[toggleOffer, o.active ? 'Turn off' : 'Turn on'], [deleteOffer, 'Remove']].map(([a, l]) => <form key={l as string} action={a as (f: FormData) => Promise<void>}><input type="hidden" name="id" value={o.id} /><input type="hidden" name="active" value={String(o.active)} /><button className="btn btn-line !px-4 !py-1 !text-base">{l as string}</button></form>)}</li>))}
      {!offers?.length && <li>No offers yet.</li>}</ul></>);
}
