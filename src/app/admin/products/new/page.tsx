import { supabaseServer } from '@/lib/supabase/server'; import NewProductForm from './Form';
export default async function New() { const { data } = await supabaseServer().from('categories').select('id,name').order('name'); return <><h1 className="font-display text-4xl font-bold uppercase">Add product</h1><NewProductForm cats={data ?? []} /></>; }
