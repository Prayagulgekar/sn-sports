import { supabaseServer } from '@/lib/supabase/server'; import { saveSettings } from '../actions2';
const F: [string, string][] = [['business_name', 'Business name'], ['phone', 'Phone (+91…)'], ['whatsapp', 'WhatsApp number (digits, e.g. 917676536059)'], ['email', 'Email'], ['instagram', 'Instagram URL'], ['address', 'Address'], ['business_hours', 'Business hours']];
export default async function Settings() {
  const { data } = await supabaseServer().from('settings').select('*').eq('id', 1).single() as { data: Record<string, string> | null };
  return (<><h1 className="font-display text-4xl font-bold uppercase">Settings</h1><form action={saveSettings} className="mt-4 grid max-w-xl gap-3 rounded-2xl bg-white p-4">{F.map(([k, l]) => <label key={k} className="grid gap-1 text-sm">{l}<input name={k} defaultValue={data?.[k] ?? ''} className="input" /></label>)}<button className="btn btn-blue">Save settings</button></form></>);
}
