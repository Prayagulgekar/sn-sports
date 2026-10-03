import { supabaseServer } from '@/lib/supabase/server'; import { addCategory, toggleCategory, deleteCategory } from '../actions2';
export default async function Cats() {
  const { data } = await supabaseServer().from('categories').select('*').order('name');
  return (<><h1 className="font-display text-4xl font-bold uppercase">Categories</h1>
    <form action={addCategory} className="mt-4 flex flex-wrap gap-2 rounded-2xl bg-white p-4"><input name="name" required placeholder="New category name" className="input md:max-w-xs" /><input name="description" placeholder="Description (optional)" className="input md:max-w-sm" /><button className="btn btn-blue">Add category</button></form>
    <ul className="mt-4 grid gap-2">{data?.map((c) => (<li key={c.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-3"><b className="mr-auto">{c.name}</b><span className="text-sm text-neutral-500">/{c.slug} · {c.active ? 'Visible' : 'Hidden'}</span>
      {[[toggleCategory, c.active ? 'Hide' : 'Show'], [deleteCategory, 'Delete']].map(([a, l]) => <form key={l as string} action={a as (f: FormData) => Promise<void>}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="active" value={String(c.active)} /><button className="btn btn-line !px-4 !py-1 !text-base">{l as string}</button></form>)}</li>))}</ul></>);
}
