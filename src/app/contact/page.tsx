import { supabaseServer } from '@/lib/supabase/server'; import { PHONE, WA } from '@/lib/utils';
export const metadata = { title: 'Contact' }; export const revalidate = 60;
export default async function Contact() { const { data: s } = await supabaseServer().from('settings').select('*').eq('id', 1).maybeSingle();
  return (<div className="mx-auto max-w-2xl px-4 py-10"><h1 className="font-display text-5xl font-bold uppercase">Contact SN Sports</h1>
  <div className="mt-6 grid gap-3"><a className="btn btn-blue" href={`tel:${s?.phone || PHONE}`}>Call now</a><a className="btn btn-dark" href={`https://wa.me/${s?.whatsapp || WA}`}>Chat on WhatsApp</a></div>
  <div className="mt-6 grid gap-1 text-neutral-700">{s?.address && <p>{s.address}</p>}{s?.business_hours && <p>{s.business_hours}</p>}{s?.email && <p>{s.email}</p>}{s?.instagram && <a className="text-volt underline" href={s.instagram}>Instagram</a>}</div></div>); }
