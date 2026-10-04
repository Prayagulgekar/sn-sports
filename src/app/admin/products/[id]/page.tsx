import Image from 'next/image'; import { notFound } from 'next/navigation'; import { supabaseServer } from '@/lib/supabase/server'; import { updateProductFull } from '../../actions2';
const Chk = ({ n, l, v }: { n: string; l: string; v: boolean }) => <label className="flex items-center gap-2"><input type="checkbox" name={n} defaultChecked={v} />{l}</label>;
export default async function Edit({ params }: { params: { id: string } }) {
  const sb = supabaseServer(); const [{ data: p }, { data: cats }] = await Promise.all([sb.from('products').select('*').eq('id', params.id).maybeSingle(), sb.from('categories').select('id,name').order('name')]);
  if (!p) notFound();
  return (<><h1 className="break-words font-display text-3xl font-bold uppercase sm:text-4xl">Edit {p.name}</h1>
    <form action={updateProductFull} className="mt-4 grid max-w-2xl gap-3 rounded-2xl bg-white p-4"><input type="hidden" name="id" value={p.id} />
      <input name="name" required defaultValue={p.name} className="input" /><input name="slug" defaultValue={p.slug} className="input" />
      <select name="category_id" defaultValue={p.category_id ?? ''} className="input"><option value="">Category</option>{cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="sport" defaultValue={p.sport ?? ''} placeholder="Sport" className="input" />
      <input name="short_description" defaultValue={p.short_description ?? ''} className="input" /><textarea name="description" rows={4} defaultValue={p.description ?? ''} className="input" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><input name="price" type="number" required min="0" defaultValue={p.price} className="input" /><input name="sale_price" type="number" min="0" defaultValue={p.sale_price ?? ''} className="input" placeholder="Sale ₹" /><input name="stock" type="number" min="0" defaultValue={p.stock} className="input" /></div>
      <input name="sizes" defaultValue={p.sizes.join(', ')} className="input" /><input name="colors" defaultValue={p.colors.join(', ')} placeholder="Colors" className="input" /><input name="tags" defaultValue={p.tags.join(', ')} placeholder="Tags" className="input" />
      <input name="bulk_pricing" defaultValue={JSON.stringify(p.bulk_pricing)} className="input font-mono text-sm" aria-label="Bulk pricing JSON" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{p.images.map((u: string) => <label key={u} className="text-xs"><div className="relative aspect-square"><Image src={u} alt="" fill sizes="(max-width: 640px) 45vw, 120px" className="rounded-lg object-cover" /></div><input type="checkbox" name="remove_img" value={u} /> Remove</label>)}</div>
      <label>Add images<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="input" /></label>
      <div className="grid grid-cols-2 gap-1"><Chk n="customizable" l="Customizable" v={p.customizable} /><Chk n="allow_name" l="Name" v={p.allow_name} /><Chk n="allow_number" l="Number" v={p.allow_number} /><Chk n="allow_logo" l="Logo" v={p.allow_logo} /><Chk n="featured" l="Featured" v={p.featured} /><Chk n="new_arrival" l="New arrival" v={p.new_arrival} /><Chk n="preorder" l="Preorder" v={p.preorder} /><Chk n="active" l="Visible on website" v={p.active} /></div>
      <button className="btn btn-blue">Save changes</button></form></>);
}
