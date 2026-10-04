import Image from 'next/image'; import Link from 'next/link'; import { supabaseServer } from '@/lib/supabase/server';
import { GALLERY_CATS } from '@/lib/gallery';
export const metadata = { title: 'Gallery' }; export const revalidate = 60;
export default async function Gallery({ searchParams }: { searchParams: { category?: string } }) {
  let q = supabaseServer().from('gallery').select('*').eq('active', true).order('created_at', { ascending: false }).limit(120);
  if (searchParams.category) q = q.eq('category', searchParams.category);
  const { data } = await q;
  return (<div className="mx-auto max-w-7xl px-4 py-8"><h1 className="font-display text-3xl font-bold uppercase sm:text-4xl md:text-5xl">Gallery</h1>
    <div className="mt-4 flex flex-wrap gap-2"><Link href="/gallery" className="btn min-h-11 btn-line !px-4 !py-2 !text-base">All</Link>{GALLERY_CATS.map((c) => <Link key={c} href={`/gallery?category=${encodeURIComponent(c)}`} className="btn min-h-11 btn-line !px-4 !py-2 !text-base">{c}</Link>)}</div>
    {!data?.length && <p className="mt-8 text-neutral-600">Photos will appear here soon.</p>}
    <div className="mt-6 columns-2 gap-3 md:columns-4">{data?.map((g) => <div key={g.id} className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-chalk"><Image src={g.image_url} alt={g.title ?? 'SN Sports jersey'} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" loading="lazy" /></div>)}</div></div>);
}
