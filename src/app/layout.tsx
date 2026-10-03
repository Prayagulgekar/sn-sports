import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ShoppingBag, ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { CartProvider } from '@/lib/cart';
import { PHONE, WA } from '@/lib/utils';
import CartBadge from './CartBadge';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'SN SPORTS | Custom Sports Jerseys', template: '%s | SN SPORTS' },
  description: 'Wear Your Game. Own Your Style. Custom cricket, tennis cricket and football jerseys for players, teams, tournaments and leagues.',
  openGraph: { title: 'SN SPORTS', description: 'Wear Your Game. Own Your Style.', type: 'website' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <CartProvider>
        <header className="sticky top-0 z-40 bg-ink text-white"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-display text-3xl font-extrabold tracking-wider">SN<span className="text-volt"> SPORTS</span></Link>
          <div className="hidden items-center gap-6 md:flex">
            {[['/shop', 'Shop'], ['/offers', 'Offers'], ['/gallery', 'Gallery'], ['/custom-jersey', 'Custom'], ['/tournament', 'Tournament'], ['/bulk-order', 'Bulk order'], ['/contact', 'Contact']].map(([h, l]) => <Link key={h} href={h} className="hover:text-volt">{l}</Link>)}
            <CartBadge /><a href={`tel:${PHONE}`} className="btn btn-blue !py-2">Call now</a>
          </div></nav></header>
        <main>{children}</main>
        <footer className="bg-ink px-4 py-10 text-center text-neutral-400"><p className="font-display text-2xl text-white">Wear Your Game. Own Your Style.</p><p className="mt-2 text-sm">SN Sports · {PHONE.replace('+91', '+91 ')} · Fan-inspired designs are not officially affiliated with any team or league.</p></footer>
        <a href={`https://wa.me/${WA}`} aria-label="WhatsApp" className="fixed bottom-20 right-4 z-50 rounded-full bg-green-500 p-4 text-white shadow-lg md:bottom-6"><MessageCircle /></a>
        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-white py-2 text-xs md:hidden">
          {[['/', Home, 'Home'], ['/shop', ShoppingBag, 'Shop'], ['/cart', ShoppingCart, 'Cart']].map(([h, I, l]) => { const Icon = I as typeof Home; return <Link key={h as string} href={h as string} className="flex flex-col items-center gap-1"><Icon size={20} />{l as string}</Link>; })}
          <a href={`tel:${PHONE}`} className="flex flex-col items-center gap-1 text-volt"><Phone size={20} />Call</a>
        </nav>
      </CartProvider></body></html>
  );
}
