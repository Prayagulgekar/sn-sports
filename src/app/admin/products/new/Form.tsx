'use client';
import { useFormState, useFormStatus } from 'react-dom'; import { createProduct } from '../../actions';
const Btn = () => { const { pending } = useFormStatus(); return <button disabled={pending} className="btn btn-blue disabled:opacity-50">{pending ? 'Saving…' : 'Save product'}</button>; };
const Chk = ({ n, l, d }: { n: string; l: string; d?: boolean }) => <label className="flex items-center gap-2"><input type="checkbox" name={n} defaultChecked={d} />{l}</label>;
export default function Form({ cats }: { cats: { id: string; name: string }[] }) {
  const [s, act] = useFormState(createProduct, {} as { error?: string });
  return (<form action={act} className="mt-4 grid max-w-2xl gap-3 rounded-2xl bg-white p-4">
    <input name="name" required placeholder="Product name (e.g. SN Thunder Pro)" className="input" /><input name="slug" placeholder="Slug (optional, auto from name)" className="input" />
    <select name="category_id" className="input"><option value="">Category</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><input name="sport" placeholder="Sport" className="input" />
    <input name="short_description" placeholder="Short description" className="input" /><textarea name="description" rows={4} placeholder="Description" className="input" />
    <div className="grid grid-cols-3 gap-2"><input name="price" type="number" required min="0" placeholder="Price ₹" className="input" /><input name="sale_price" type="number" min="0" placeholder="Sale ₹" className="input" /><input name="stock" type="number" min="0" placeholder="Stock" className="input" /></div>
    <input name="sizes" defaultValue="S, M, L, XL, XXL" className="input" /><input name="colors" placeholder="Colors, comma separated" className="input" /><input name="tags" placeholder="Tags, comma separated" className="input" />
    <input name="bulk_pricing" defaultValue="[]" className="input font-mono text-sm" aria-label="Bulk pricing JSON" /><p className="-mt-2 text-xs text-neutral-600">Bulk pricing example: [{'{"min":5,"price":649},{"min":10,"price":599}'}]</p>
    <label>Images (JPG/PNG/WEBP, 5 MB each)<input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="input" /></label>
    <div className="grid grid-cols-2 gap-1"><Chk n="customizable" l="Customizable" d /><Chk n="allow_name" l="Name" d /><Chk n="allow_number" l="Number" d /><Chk n="allow_logo" l="Logo" d /><Chk n="featured" l="Featured" /><Chk n="new_arrival" l="New arrival" /><Chk n="preorder" l="Preorder" /><Chk n="active" l="Visible on website" d /></div>
    {s?.error && <p role="alert" className="text-red-600">{s.error}</p>}<Btn /></form>);
}
