import { supabaseServer } from '@/lib/supabase/server'; import { updateRequest } from '../actions';
const STATUSES = ['NEW', 'CONTACTED', 'QUOTE SENT', 'CONFIRMED', 'DESIGNING', 'PRODUCTION', 'READY', 'DELIVERED', 'CANCELLED'];
export default async function Requests({ searchParams }: { searchParams: { kind?: string } }) {
  const kind = ['bulk', 'tournament', 'league', 'custom'].includes(searchParams.kind ?? '') ? searchParams.kind! : 'bulk';
  const { data } = await supabaseServer().from('requests').select('*').eq('kind', kind).order('created_at', { ascending: false }).limit(100);
  return (<><h1 className="break-words font-display text-3xl font-bold uppercase sm:text-4xl">{kind} requests</h1><div className="mt-4 grid gap-3">{data?.map((r) => (
    <form key={r.id} action={updateRequest} className="grid gap-2 rounded-2xl bg-white p-4"><input type="hidden" name="id" value={r.id} />
      <p className="break-words"><b>{r.customer_name}</b> · <a className="text-volt" href={`tel:${r.phone}`}>{r.phone}</a> {r.email && `· ${r.email}`}</p>
      <p className="break-words text-sm">{[r.team_name, r.sport, r.quantity && `${r.quantity} jerseys`, r.required_date && `by ${r.required_date}`, new Date(r.created_at).toLocaleDateString('en-IN')].filter(Boolean).join(' · ')}</p>
      <pre className="break-words whitespace-pre-wrap rounded-lg bg-chalk p-2 text-xs">{Object.entries(r.details).map(([k, v]) => `${k}: ${v}`).join('\n')}</pre>
      <select name="status" defaultValue={r.status} className="input">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select><textarea name="admin_notes" defaultValue={r.admin_notes ?? ''} placeholder="Internal notes" className="input" /><button className="btn min-h-11 w-full btn-dark sm:w-auto">Save</button></form>))}
    {!data?.length && <p>No requests yet.</p>}</div></>);
}
