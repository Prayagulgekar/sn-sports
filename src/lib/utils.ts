export type Tier = { min: number; price: number };
export type Product = { id: string; name: string; slug: string; description: string | null; short_description: string | null; price: number; sale_price: number | null; bulk_pricing: Tier[]; sizes: string[]; colors: string[]; images: string[]; stock: number; preorder: boolean; customizable: boolean; allow_name: boolean; allow_number: boolean; allow_logo: boolean; sport: string | null; featured: boolean; new_arrival: boolean };
export const inr = (n: number) => '₹' + Number(n).toLocaleString('en-IN');
export const basePrice = (p: Pick<Product, 'price' | 'sale_price'>) => (p.sale_price && p.sale_price < p.price ? p.sale_price : p.price);
export const discountPct = (p: Pick<Product, 'price' | 'sale_price'>) => (p.sale_price && p.sale_price < p.price ? Math.round(((p.price - p.sale_price) / p.price) * 100) : 0);
export function unitPrice(p: Pick<Product, 'price' | 'sale_price' | 'bulk_pricing'>, qty: number) {
  const tier = [...(p.bulk_pricing ?? [])].sort((a, b) => b.min - a.min).find((t) => qty >= t.min);
  return tier ? Math.min(tier.price, basePrice(p)) : basePrice(p);
}
export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
export const PHONE = '+917676536059';
export const WA = '917676536059';
