import Link from 'next/link'; import { supabaseServer } from '@/lib/supabase/server'; import { toggleProduct, deleteProduct, duplicateProduct, updateProduct } from '../actions';
export default async function Products() {
  const { data } = await supabaseServer().from('products').select('id,name,slug,price,sale_price,stock,active').order('created_at', { ascending: false });
  return (<><div className="flex items-center justify-between"><h1 className="font-display text-4xl font-bold uppercase">Products</h1><Link href="/admin/products/new" className="btn btn-blue">Add product</Link></div>
    <div className="mt-4 grid gap-3">{data?.map((p) => (<div key={p.id} className="rounded-2xl bg-white p-4"><div className="flex justify-between"><b>{p.name}</b><span className={p.active ? 'text-green-600' : 'text-neutral-500'}>{p.active ? 'Visible' : 'Hidden'}</span></div>
      <form action={updateProduct} className="mt-2 flex flex-wrap items-end gap-2"><input type="hidden" name="id" value={p.id} />
        <label className="text-xs">Price<input name="price" type="number" step="1" min="0" defaultValue={p.price} className="input !w-28" /></label>
        <label className="text-xs">Sale price<input name="sale_price" type="number" step="1" min="0" defaultValue={p.sale_price ?? ''} className="input !w-28" /></label>
        <label className="text-xs">Stock<input name="stock" type="number" min="0" defaultValue={p.stock} className="input !w-24" /></label><button className="btn btn-dark !py-2">Save</button></form>
      <div className="mt-2 flex flex-wrap gap-2"><Link href={`/admin/products/${p.id}`} className="btn btn-line !px-4 !py-1 !text-base">Edit</Link>{[[toggleProduct, p.active ? 'Hide' : 'Show', String(p.active)], [duplicateProduct, 'Duplicate', ''], [deleteProduct, 'Delete', '']].map(([a, l, v]) => (
        <form key={l as string} action={a as (fd: FormData) => Promise<void>}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="active" value={v as string} /><button className="btn btn-line !px-4 !py-1 !text-base">{l as string}</button></form>))}</div></div>))}
      {!data?.length && <p>No products yet. Add your first jersey.</p>}</div></>);
}
