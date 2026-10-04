import Link from 'next/link'; import { supabaseServer } from '@/lib/supabase/server'; import { signOut } from './actions';
export const metadata = { title: 'Admin', robots: { index: false } };
export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser();
  if (!user) return <>{children}</>;
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== 'admin') return <div className="p-10 text-center"><h1 className="font-display text-4xl font-bold">Not authorized</h1><p className="mt-2">This account is not an admin.</p><form action={signOut}><button className="btn btn-dark mt-4">Logout</button></form></div>;
  const links = [['/admin', 'Dashboard'], ['/admin/products', 'Products'], ['/admin/products/new', 'Add product'], ['/admin/categories', 'Categories'], ['/admin/offers', 'Offers'], ['/admin/gallery', 'Gallery'], ['/admin/settings', 'Settings'], ['/admin/requests?kind=bulk', 'Bulk orders'], ['/admin/requests?kind=tournament', 'Tournament'], ['/admin/requests?kind=league', 'League'], ['/admin/requests?kind=custom', 'Custom requests']];
  return (<div className="min-h-screen md:flex"><aside className="shrink-0 bg-ink p-4 text-white md:w-56"><b className="font-display text-2xl">SN ADMIN</b><nav className="mt-3 grid grid-cols-2 gap-1 md:grid-cols-1 md:gap-2">{links.map(([h, l]) => <Link key={h} href={h} className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm leading-tight hover:bg-white/10">{l}</Link>)}<form action={signOut}><button className="min-h-11 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10">Logout</button></form></nav></aside><div className="min-w-0 flex-1 bg-chalk p-4 md:p-8">{children}</div></div>);
}
