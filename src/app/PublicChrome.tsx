'use client';

import Link from 'next/link';
import { Home, MessageCircle, Phone, ShoppingBag, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useBusinessSettings } from '@/lib/business-settings';
import CartBadge from './CartBadge';

export default function PublicChrome({ placement }: { placement: 'header' | 'footer' }) {
  const pathname = usePathname();
  const { phone, whatsapp } = useBusinessSettings();

  if (pathname?.startsWith('/admin')) return null;

  if (placement === 'header') {
    return (
      <header className="sticky top-0 z-40 bg-ink text-white">
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 py-3">
          <Link href="/" className="font-display text-3xl font-extrabold tracking-wider">
            SN<span className="text-volt"> SPORTS</span>
          </Link>
          <div className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-1 md:flex xl:gap-x-6">
            {[
              ['/shop', 'Shop'], ['/offers', 'Offers'], ['/gallery', 'Gallery'],
              ['/custom-jersey', 'Custom'], ['/tournament', 'Tournament'],
              ['/bulk-order', 'Bulk order'], ['/contact', 'Contact'],
            ].map(([href, label]) => <Link key={href} href={href} className="hover:text-volt">{label}</Link>)}
            <CartBadge />
            {phone && <a href={`tel:${phone}`} className="btn btn-blue !py-2">Call now</a>}
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <footer className="bg-ink px-4 py-10 text-center text-neutral-400">
        <p className="font-display text-2xl text-white">Wear Your Game. Own Your Style.</p>
        <p className="mt-2 text-sm">SN Sports{phone && ` · ${phone}`} · Fan-inspired designs are not officially affiliated with any team or league.</p>
      </footer>
      {whatsapp && <a href={`https://wa.me/${whatsapp}`} aria-label="WhatsApp" className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-50 grid size-14 place-items-center rounded-full bg-green-500 text-white shadow-lg md:bottom-6">
        <MessageCircle aria-hidden="true" />
      </a>}
      <nav aria-label="Mobile navigation" className={`fixed inset-x-0 bottom-0 z-40 grid ${phone ? 'grid-cols-4' : 'grid-cols-3'} border-t bg-white pb-[env(safe-area-inset-bottom)] text-xs md:hidden`}>
        {[
          ['/', Home, 'Home'], ['/shop', ShoppingBag, 'Shop'], ['/cart', ShoppingCart, 'Cart'],
        ].map(([href, Icon, label]) => {
          const NavIcon = Icon as typeof Home;
          return <Link key={href as string} href={href as string} className="flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2">
            <NavIcon size={20} aria-hidden="true" />{label as string}
          </Link>;
        })}
        {phone && <a href={`tel:${phone}`} className="flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-volt">
          <Phone size={20} aria-hidden="true" />Call
        </a>}
      </nav>
      <div aria-hidden="true" className="h-[calc(3.5rem+env(safe-area-inset-bottom))] md:hidden" />
    </>
  );
}
