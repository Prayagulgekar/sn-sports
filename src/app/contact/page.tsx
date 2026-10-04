import { supabaseServer } from '@/lib/supabase/server';
export const metadata = { title: 'Contact' }; export const revalidate = 60;
export default async function Contact() { const { data: s } = await supabaseServer().from('settings').select('*').eq('id', 1).maybeSingle();
  const phone = s?.phone?.replace(/[^\d+]/g, '') || '';
  const whatsapp = s?.whatsapp?.replace(/\D/g, '') || '';
  return (<div className="mx-auto max-w-2xl px-4 py-8 sm:py-10"><h1 className="font-display text-3xl font-bold uppercase sm:text-4xl md:text-5xl">Contact SN Sports</h1>
  <div className="mt-6 grid gap-3">{phone && <a className="btn min-h-11 w-full btn-blue" href={`tel:${phone}`}>Call now</a>}{whatsapp && <a className="btn min-h-11 w-full btn-dark" href={`https://wa.me/${whatsapp}`}>Chat on WhatsApp</a>}</div>
  <div className="mt-6 grid gap-2 break-words text-neutral-700">{s?.address && <p>{s.address}</p>}{s?.business_hours && <p>{s.business_hours}</p>}{s?.email && <p>{s.email}</p>}{s?.instagram && <a className="min-h-11 content-center text-volt underline" href={s.instagram}>Instagram</a>}</div></div>); }
