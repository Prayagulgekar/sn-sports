'use server';
import { revalidatePath } from 'next/cache'; import { redirect } from 'next/navigation'; import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server'; import { slugify } from '@/lib/utils';
async function admin() {
  const sb = supabaseServer(); const { data: { user } } = await sb.auth.getUser(); if (!user) redirect('/admin/login');
  const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single(); if (me?.role !== 'admin') throw new Error('Not authorized');
  return sb;
}
const refresh = () => { revalidatePath('/', 'layout'); };
const csv = (v: FormDataEntryValue | null) => String(v ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const num = z.coerce.number().min(0).max(1000000);
export async function createProduct(_: unknown, fd: FormData): Promise<{ error?: string }> {
  const sb = await admin();
  const p = z.object({ name: z.string().trim().min(2).max(120), price: num, sale_price: num.optional(), stock: z.coerce.number().int().min(0).max(100000) })
    .safeParse({ name: fd.get('name'), price: fd.get('price'), sale_price: fd.get('sale_price') || undefined, stock: fd.get('stock') || 0 });
  if (!p.success) return { error: p.error.issues[0].message };
  if (p.data.sale_price && p.data.sale_price >= p.data.price) return { error: 'Sale price must be lower than regular price' };
  const slug = slugify(String(fd.get('slug') || p.data.name));
  const images: string[] = [];
  for (const f of fd.getAll('images')) {
    if (!(f instanceof File) || !f.size) continue;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 5 * 1024 * 1024) return { error: 'Images must be JPG, PNG or WEBP under 5 MB' };
    const path = `products/${slug}-${crypto.randomUUID().slice(0, 8)}.${f.type.split('/')[1].replace('jpeg', 'jpg')}`;
    const { error } = await sb.storage.from('media').upload(path, f, { contentType: f.type }); if (error) return { error: 'Image upload failed: ' + error.message };
    images.push(sb.storage.from('media').getPublicUrl(path).data.publicUrl);
  }
  let bulk: unknown[] = []; try { bulk = JSON.parse(String(fd.get('bulk_pricing') || '[]')); } catch { return { error: 'Bulk pricing must be valid JSON, e.g. [{"min":5,"price":649}]' }; }
  const on = (k: string) => fd.get(k) === 'on';
  const { error } = await sb.from('products').insert({ ...p.data, sale_price: p.data.sale_price ?? null, slug, category_id: fd.get('category_id') || null, sport: fd.get('sport') || null, description: fd.get('description') || null, short_description: fd.get('short_description') || null,
    sizes: csv(fd.get('sizes')), colors: csv(fd.get('colors')), tags: csv(fd.get('tags')).map((t) => t.toLowerCase()), images, bulk_pricing: bulk,
    featured: on('featured'), new_arrival: on('new_arrival'), customizable: on('customizable'), allow_name: on('allow_name'), allow_number: on('allow_number'), allow_logo: on('allow_logo'), preorder: on('preorder'), active: on('active') });
  if (error) return { error: error.code === '23505' ? 'A product with this slug already exists' : error.message };
  refresh(); redirect('/admin/products');
}
export async function updateProduct(fd: FormData) {
  const sb = await admin(); const price = Number(fd.get('price')), sale = fd.get('sale_price') ? Number(fd.get('sale_price')) : null;
  if (!(price >= 0) || (sale !== null && (sale < 0 || sale >= price))) return;
  await sb.from('products').update({ price, sale_price: sale, stock: Math.max(0, Number(fd.get('stock')) || 0), updated_at: new Date().toISOString() }).eq('id', String(fd.get('id'))); refresh();
}
export async function toggleProduct(fd: FormData) { const sb = await admin(); await sb.from('products').update({ active: fd.get('active') !== 'true' }).eq('id', String(fd.get('id'))); refresh(); }
export async function deleteProduct(fd: FormData) { const sb = await admin(); await sb.from('products').delete().eq('id', String(fd.get('id'))); refresh(); }
export async function duplicateProduct(fd: FormData) {
  const sb = await admin(); const { data: p } = await sb.from('products').select('*').eq('id', String(fd.get('id'))).single(); if (!p) return;
  const { id, created_at, updated_at, ...rest } = p; await sb.from('products').insert({ ...rest, name: p.name + ' (Copy)', slug: p.slug + '-copy-' + Math.random().toString(36).slice(2, 6), active: false }); refresh();
}
export async function updateRequest(fd: FormData) {
  const sb = await admin(); await sb.from('requests').update({ status: String(fd.get('status')), admin_notes: String(fd.get('admin_notes') || '') }).eq('id', String(fd.get('id'))); revalidatePath('/admin/requests');
}
export async function signOut() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (user) {
    const { data: me } = await sb.from('profiles').select('role').eq('id', user.id).single();
    if (me?.role !== 'admin') {
      await sb.auth.signOut();
      redirect('/admin/login');
    }
  }
  await sb.auth.signOut();
  redirect('/admin/login');
}
export async function saveSettings(fd: FormData) {
  const sb = await admin();

  const settings = {
    business_name: String(fd.get('business_name') || ''),
    phone: String(fd.get('phone') || ''),
    whatsapp: String(fd.get('whatsapp') || ''),
    email: String(fd.get('email') || ''),
    instagram: String(fd.get('instagram') || ''),
    address: String(fd.get('address') || ''),
    business_hours: String(fd.get('business_hours') || ''),
  };

  const { data: existing, error: checkError } = await sb
    .from('settings')
    .select('id')
    .eq('id', 1)
    .maybeSingle();

  if (checkError) {
    console.error('Settings check error:', checkError);
    throw new Error(checkError.message);
  }

  let error;

  if (existing) {
    const result = await sb
      .from('settings')
      .update(settings)
      .eq('id', 1);

    error = result.error;
  } else {
    const result = await sb
      .from('settings')
      .insert({
        id: 1,
        ...settings,
      });

    error = result.error;
  }

  if (error) {
    console.error('Save settings error:', error);
    throw new Error(error.message);
  }

  refresh();
  revalidatePath('/admin/settings');
}