import Image from 'next/image'; import { supabaseServer } from '@/lib/supabase/server'; import { addGallery, toggleGallery, deleteGallery } from '../actions2'; import { GALLERY_CATS } from '@/lib/gallery';
export default async function G() {
  const { data } = await supabaseServer().from('gallery').select('*').order('created_at', { ascending: false });
  return (<><h1 className="font-display text-4xl font-bold uppercase">Gallery</h1>
    <form action={addGallery} className="mt-4 grid max-w-xl gap-2 rounded-2xl bg-white p-4"><input name="image" type="file" required accept="image/jpeg,image/png,image/webp" className="input" /><input name="title" placeholder="Title" className="input" />
      <select name="category" className="input">{GALLERY_CATS.map((c) => <option key={c}>{c}</option>)}</select><button className="btn btn-blue">Upload</button></form>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{data?.map((g) => (<div key={g.id} className="overflow-hidden rounded-xl bg-white"><div className="relative aspect-square"><Image src={g.image_url} alt={g.title ?? 'Gallery'} fill sizes="25vw" className="object-cover" /></div>
      <p className="px-2 pt-1 text-sm">{g.title} · {g.category} · {g.active ? 'Visible' : 'Hidden'}</p><div className="flex gap-1 p-2">{[[toggleGallery, g.active ? 'Hide' : 'Show'], [deleteGallery, 'Delete']].map(([a, l]) => <form key={l as string} action={a as (f: FormData) => Promise<void>}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="active" value={String(g.active)} /><button className="btn btn-line !px-3 !py-0 !text-sm">{l as string}</button></form>)}</div></div>))}</div></>);
}
