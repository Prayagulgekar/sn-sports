'use server';
import { revalidatePath } from 'next/cache'; import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server'; import { slugify } from '@/lib/utils';
async function admin() {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect('/admin/login');
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single(); if (me?.role !== 'admin') throw new Error('Not authorized');
  return sb;
}
const R = () => revalidatePath('/', 'layout');
const csv = (v: FormDataEntryValue | null) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const s = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim();
async function upload(sb: ReturnType<typeof supabaseServer>, f: File, folder: string) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 5 * 1024 * 1024) throw new Error('Images must be JPG, PNG or WEBP under 5 MB');
  const path = `${folder}/${crypto.randomUUID().slice(0, 12)}.${f.type.split('/')[1].replace('jpeg', 'jpg')}`;
  const { error } = await sb.storage.from('media').upload(path, f, { contentType: f.type }); if (error) throw new Error('Upload failed: ' + error.message);
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}
export async function addCategory(fd: FormData) { const sb = await admin(); const name = s(fd, 'name'); if (!name) return; await sb.from('categories').insert({ name, slug: slugify(name), description: s(fd, 'description') || null }); R(); }
export async function toggleCategory(fd: FormData) { const sb = await admin(); await sb.from('categories').update({ active: s(fd, 'active') !== 'true' }).eq('id', s(fd, 'id')); R(); }
export async function deleteCategory(fd: FormData) { const sb = await admin(); await sb.from('categories').delete().eq('id', s(fd, 'id')); R(); }
export async function addOffer(fd: FormData) {
  const sb = await admin(); const v = Number(fd.get('discount_value')); const t = s(fd, 'discount_type') === 'flat' ? 'flat' : 'percent';
  if (!s(fd, 'product_id') || !(v > 0) || (t === 'percent' && v >= 100)) throw new Error('Choose a product and a valid discount');
  await sb.from('offers').insert({ name: s(fd, 'name') || null, product_id: s(fd, 'product_id'), discount_type: t, discount_value: v, start_date: s(fd, 'start_date') || null, end_date: s(fd, 'end_date') || null }); R();
}
export async function toggleOffer(fd: FormData) { const sb = await admin(); await sb.from('offers').update({ active: s(fd, 'active') !== 'true' }).eq('id', s(fd, 'id')); R(); }
export async function deleteOffer(fd: FormData) { const sb = await admin(); await sb.from('offers').delete().eq('id', s(fd, 'id')); R(); }
export async function addGallery(fd: FormData) {
  const sb = await admin(); const f = fd.get('image'); if (!(f instanceof File) || !f.size) throw new Error('Choose an image');
  await sb.from('gallery').insert({ image_url: await upload(sb, f, 'gallery'), title: s(fd, 'title') || null, category: s(fd, 'category') || null }); R();
}
export async function toggleGallery(fd: FormData) { const sb = await admin(); await sb.from('gallery').update({ active: s(fd, 'active') !== 'true' }).eq('id', s(fd, 'id')); R(); }
export async function deleteGallery(fd: FormData) { const sb = await admin(); await sb.from('gallery').delete().eq('id', s(fd, 'id')); R(); }
export async function saveSettings(fd: FormData) {
  const sb = await admin(); const o: Record<string, string> = {}; for (const k of ['business_name', 'phone', 'whatsapp', 'email', 'instagram', 'address', 'business_hours']) o[k] = s(fd, k);
  await sb.from('settings').update(o).eq('id', 1); R();
}
export async function updateProductFull(fd: FormData) {
  const sb = await admin(); const id = s(fd, 'id'); const price = Number(fd.get('price')), sale = fd.get('sale_price') ? Number(fd.get('sale_price')) : null;
  if (!s(fd, 'name') || !(price >= 0) || (sale !== null && (sale < 0 || sale >= price))) throw new Error('Check name and prices (sale price must be below regular price)');
  const { data: cur } = await sb.from('products').select('images').eq('id', id).single();
  const removed = fd.getAll('remove_img').map(String); const images: string[] = (cur?.images ?? []).filter((u: string) => !removed.includes(u));
  for (const f of fd.getAll('images')) if (f instanceof File && f.size) images.push(await upload(sb, f, 'products'));
  let bulk: unknown[] = []; try { bulk = JSON.parse(s(fd, 'bulk_pricing') || '[]'); } catch { throw new Error('Bulk pricing must be valid JSON'); }
  const on = (k: string) => fd.get(k) === 'on';
  const { error } = await sb.from('products').update({ name: s(fd, 'name'), slug: slugify(s(fd, 'slug') || s(fd, 'name')), category_id: s(fd, 'category_id') || null, sport: s(fd, 'sport') || null, short_description: s(fd, 'short_description') || null, description: s(fd, 'description') || null,
    price, sale_price: sale, stock: Math.max(0, Number(fd.get('stock')) || 0), sizes: csv(fd.get('sizes')), colors: csv(fd.get('colors')), tags: csv(fd.get('tags')).map((t) => t.toLowerCase()), bulk_pricing: bulk, images,
    featured: on('featured'), new_arrival: on('new_arrival'), customizable: on('customizable'), allow_name: on('allow_name'), allow_number: on('allow_number'), allow_logo: on('allow_logo'), preorder: on('preorder'), active: on('active'), updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message); R(); redirect('/admin/products');
}
