'use client';
import Link from 'next/link'; import { ShoppingCart } from 'lucide-react'; import { useCart } from '@/lib/cart';
export default function CartBadge() { const { count } = useCart(); return <Link href="/cart" className="relative" aria-label="Cart"><ShoppingCart />{count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-volt px-1.5 text-xs">{count}</span>}</Link>; }
