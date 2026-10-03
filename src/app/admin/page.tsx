import { supabaseServer } from '@/lib/supabase/server';
export default async function Dashboard() {
  const sb = supabaseServer(); const c = (q: any) => q.then((r: { count: number | null }) => r.count ?? 0);
  const head = { count: 'exact' as const, head: true };
  const [total, active, out, orders, pending, bulk, custom] = await Promise.all([c(sb.from('products').select('*', head)), c(sb.from('products').select('*', head).eq('active', true)), c(sb.from('products').select('*', head).lte('stock', 0)),
    c(sb.from('orders').select('*', head)), c(sb.from('orders').select('*', head).eq('status', 'new')), c(sb.from('requests').select('*', head).eq('kind', 'bulk')), c(sb.from('requests').select('*', head).eq('kind', 'custom'))]);
  const { data: recent } = await sb.from('requests').select('id,kind,customer_name,phone,status,created_at').order('created_at', { ascending: false }).limit(8);
  const cards = [['Products', total], ['Active', active], ['Out of stock', out], ['Orders', orders], ['Pending orders', pending], ['Bulk requests', bulk], ['Custom requests', custom]];
  return (<><h1 className="font-display text-4xl font-bold uppercase">Dashboard</h1>
    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{cards.map(([l, n]) => <div key={l as string} className="rounded-2xl bg-white p-4"><p className="text-sm text-neutral-600">{l}</p><p className="font-display text-4xl font-bold">{n}</p></div>)}</div>
    <h2 className="mt-8 font-display text-2xl font-bold uppercase">Recent requests</h2>
    <ul className="mt-2 grid gap-2">{recent?.map((r) => <li key={r.id} className="rounded-xl bg-white p-3">{r.kind} · {r.customer_name} · <a className="text-volt" href={`tel:${r.phone}`}>{r.phone}</a> · {r.status}</li>)}{!recent?.length && <li>No requests yet.</li>}</ul></>);
}
